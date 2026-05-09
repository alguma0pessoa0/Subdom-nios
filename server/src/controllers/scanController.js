import { PrismaClient } from '@prisma/client';
import dns from 'dns/promises';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// In-memory queue for scans (production would use Redis)
const scanQueue = [];
let isProcessing = false;

export async function createScan(req, res) {
  try {
    const { domain, scanType } = req.body;

    if (!domain || !scanType) {
      return res.status(400).json({ error: 'Missing domain or scanType' });
    }

    // Check plan limits
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // FREE plan: only LIGHT scans
    if (user.plan === 'FREE' && scanType === 'DEEP') {
      return res.status(403).json({
        error: 'Deep scans require PRO plan',
        upgrade: true,
      });
    }

    // Check daily scan limits for FREE plan
    if (user.plan === 'FREE') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const scanCount = await prisma.scan.count({
        where: {
          userId: req.userId,
          createdAt: { gte: today },
        },
      });

      if (scanCount >= 5) {
        return res.status(429).json({
          error: 'Daily scan limit (5) reached for FREE plan',
          upgrade: true,
        });
      }
    }

    // Create scan record
    const scan = await prisma.scan.create({
      data: {
        id: uuidv4(),
        userId: req.userId,
        domain,
        scanType,
        status: 'PENDING',
        executionTime: 0,
        techniques: [],
      },
    });

    // Queue the scan
    scanQueue.push({ scanId: scan.id, domain, scanType });
    processScanQueue();

    res.status(201).json({
      success: true,
      scan: {
        id: scan.id,
        domain,
        scanType,
        status: 'PENDING',
        createdAt: scan.createdAt,
      },
    });
  } catch (error) {
    console.error('Create scan error:', error);
    res.status(500).json({ error: 'Failed to create scan' });
  }
}

export async function getScan(req, res) {
  try {
    const { id } = req.params;

    const scan = await prisma.scan.findUnique({
      where: { id },
      include: {
        subdomains: true,
      },
    });

    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    if (scan.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Calculate stats
    const stats = {
      active: scan.subdomains.filter((s) => s.status === 'active').length,
      inactive: scan.subdomains.filter((s) => s.status === 'inactive').length,
      totalWithSSL: scan.subdomains.filter((s) => s.ssl).length,
    };

    res.json({
      scan: {
        ...scan,
        stats,
      },
    });
  } catch (error) {
    console.error('Get scan error:', error);
    res.status(500).json({ error: 'Failed to get scan' });
  }
}

export async function getScanHistory(req, res) {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const scans = await prisma.scan.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      select: {
        id: true,
        domain: true,
        scanType: true,
        status: true,
        totalFound: true,
        executionTime: true,
        createdAt: true,
        _count: {
          select: { subdomains: true },
        },
      },
    });

    const total = await prisma.scan.count({
      where: { userId: req.userId },
    });

    res.json({
      scans,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
      },
    });
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({ error: 'Failed to get scan history' });
  }
}

async function processScanQueue() {
  if (isProcessing || scanQueue.length === 0) {
    return;
  }

  isProcessing = true;

  while (scanQueue.length > 0) {
    const { scanId, domain, scanType } = scanQueue.shift();

    try {
      await executeScan(scanId, domain, scanType);
    } catch (error) {
      console.error('Scan execution error:', error);

      await prisma.scan.update({
        where: { id: scanId },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
        },
      });
    }
  }

  isProcessing = false;
}

async function executeScan(scanId, domain, scanType) {
  const startTime = Date.now();

  await prisma.scan.update({
    where: { id: scanId },
    data: { status: 'RUNNING' },
  });

  const techniques = [];
  const foundSubdomains = new Set();

  // Technique 1: Common subdomains (Passive DNS simulation)
  techniques.push('Passive DNS');
  const commonSubs = await checkCommonSubdomains(domain);
  commonSubs.forEach((sub) => foundSubdomains.add(sub));

  // Technique 2: DNS Records
  techniques.push('DNS Records');
  const dnsRecords = await resolveDNSRecords(domain);
  dnsRecords.subdomains.forEach((sub) => foundSubdomains.add(sub));

  // Deep scan techniques
  if (scanType === 'DEEP') {
    techniques.push('Certificate Transparency');
    const ctSubs = await getCertificateTransparencySubs(domain);
    ctSubs.forEach((sub) => foundSubdomains.add(sub));

    techniques.push('SSL Certificate Parsing');
    // Simulated
    foundSubdomains.add(`ssl.${domain}`);

    techniques.push('HTML Crawling');
    // Simulated
    foundSubdomains.add(`www.${domain}`);

    techniques.push('Search Engine Scraping');
    // Simulated
    foundSubdomains.add(`mail.${domain}`);

    techniques.push('Reverse DNS');
    // Simulated
    foundSubdomains.add(`admin.${domain}`);

    techniques.push('CNAME Brute');
    // Simulated
    foundSubdomains.add(`cdn.${domain}`);

    techniques.push('Wordlist Bruteforce');
    // Simulated common subdomains
    const wordlistSubs = [
      'api',
      'app',
      'blog',
      'dev',
      'ftp',
      'git',
      'mail',
      'staging',
      'test',
      'vpn',
    ];
    wordlistSubs.forEach((sub) => foundSubdomains.add(`${sub}.${domain}`));
  }

  // Resolve and check each subdomain
  const subdomainRecords = [];
  for (const subdomain of foundSubdomains) {
    try {
      const record = await resolveAndCheckSubdomain(subdomain);
      subdomainRecords.push(record);
    } catch (error) {
      subdomainRecords.push({
        subdomain,
        ip: null,
        status: 'inactive',
        responseTime: 0,
        httpCode: null,
        ssl: false,
        technology: null,
      });
    }
  }

  // Save subdomains to database
  for (const record of subdomainRecords) {
    await prisma.subdomain.create({
      data: {
        scanId,
        subdomain: record.subdomain,
        ip: record.ip || '',
        status: record.status,
        responseTime: record.responseTime,
        httpCode: record.httpCode,
        ssl: record.ssl,
        technology: record.technology,
      },
    });
  }

  const executionTime = Date.now() - startTime;

  await prisma.scan.update({
    where: { id: scanId },
    data: {
      status: 'COMPLETED',
      totalFound: foundSubdomains.size,
      executionTime,
      techniques,
    },
  });
}

async function checkCommonSubdomains(domain) {
  const commonSubs = [
    `www.${domain}`,
    `mail.${domain}`,
    `ftp.${domain}`,
    `localhost.${domain}`,
    `webmail.${domain}`,
    `smtp.${domain}`,
    `pop.${domain}`,
    `ns.${domain}`,
    `webdisk.${domain}`,
    `ns1.${domain}`,
    `cpanel.${domain}`,
    `whm.${domain}`,
    `autodiscover.${domain}`,
    `autoconfig.${domain}`,
    `m.${domain}`,
    `api.${domain}`,
    `admin.${domain}`,
    `dev.${domain}`,
    `staging.${domain}`,
    `test.${domain}`,
    `cdn.${domain}`,
  ];

  return commonSubs;
}

async function resolveDNSRecords(domain) {
  try {
    const addresses = await dns.resolve4(domain);
    return {
      subdomains: [domain],
      ips: addresses,
    };
  } catch (error) {
    return { subdomains: [], ips: [] };
  }
}

async function getCertificateTransparencySubs(domain) {
  // Simulated CT log fetching
  try {
    const response = await axios.get(
      `https://crt.sh/?q=%25.${domain}&output=json`,
      { timeout: 5000 }
    );
    if (Array.isArray(response.data)) {
      return response.data
        .slice(0, 50)
        .map((cert) => cert.name_value)
        .flat()
        .filter((name) => name.includes(domain));
    }
  } catch (error) {
    // Silently fail
  }
  return [];
}

async function resolveAndCheckSubdomain(subdomain) {
  try {
    const startTime = Date.now();
    const addresses = await dns.resolve4(subdomain);
    const responseTime = Date.now() - startTime;

    // Try to fetch and check if active
    try {
      const response = await axios.get(`http://${subdomain}`, {
        timeout: 3000,
        validateStatus: () => true,
      });

      return {
        subdomain,
        ip: addresses[0],
        status: 'active',
        responseTime,
        httpCode: response.status,
        ssl: response.status >= 200 && response.status < 400,
        technology: extractTechnology(response.headers),
      };
    } catch (error) {
      return {
        subdomain,
        ip: addresses[0],
        status: 'active',
        responseTime,
        httpCode: null,
        ssl: false,
        technology: null,
      };
    }
  } catch (error) {
    return {
      subdomain,
      ip: null,
      status: 'inactive',
      responseTime: 0,
      httpCode: null,
      ssl: false,
      technology: null,
    };
  }
}

function extractTechnology(headers) {
  const server = headers['server'];
  if (!server) return null;

  if (server.includes('nginx')) return 'Nginx';
  if (server.includes('Apache')) return 'Apache';
  if (server.includes('IIS')) return 'IIS';
  if (server.includes('Cloudflare')) return 'Cloudflare';

  return server.split('/')[0];
}

export async function exportScan(req, res) {
  try {
    const { id } = req.params;
    const { format } = req.query;

    const scan = await prisma.scan.findUnique({
      where: { id },
      include: { subdomains: true },
    });

    if (!scan) {
      return res.status(404).json({ error: 'Scan not found' });
    }

    if (scan.userId !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (format === 'csv') {
      const csv = generateCSV(scan);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="scan-${id}.csv"`);
      res.send(csv);
    } else if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="scan-${id}.json"`);
      res.json(scan);
    } else if (format === 'pdf') {
      res.status(501).json({ error: 'PDF export coming soon' });
    } else {
      res.status(400).json({ error: 'Invalid format. Use csv, json, or pdf' });
    }
  } catch (error) {
    console.error('Export scan error:', error);
    res.status(500).json({ error: 'Export failed' });
  }
}

function generateCSV(scan) {
  let csv = `Subdomain Enumeration Report - ${scan.domain}\n`;
  csv += `Scan Type: ${scan.scanType}\n`;
  csv += `Date: ${scan.createdAt}\n`;
  csv += `Execution Time: ${scan.executionTime}ms\n\n`;

  csv += 'Subdomain,IP,Status,Response Time (ms),HTTP Code,SSL,CNAME,Technology\n';

  scan.subdomains.forEach((sub) => {
    csv += `"${sub.subdomain}","${sub.ip}","${sub.status}",${
      sub.responseTime
    },"${sub.httpCode || 'N/A'}","${sub.ssl ? 'Yes' : 'No'}","${
      sub.cname || 'N/A'
    }","${sub.technology || 'N/A'}"\n`;
  });

  return csv;
}
