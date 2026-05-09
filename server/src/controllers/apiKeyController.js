import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function generateApiKey(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'API key name is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (user.plan === 'FREE') {
      return res.status(403).json({
        error: 'API access requires PRO plan',
        upgrade: true,
      });
    }

    const apiKey = await prisma.apiKey.create({
      data: {
        userId: req.userId,
        key: uuidv4(),
        name,
        active: true,
      },
    });

    res.status(201).json({
      success: true,
      apiKey: {
        id: apiKey.id,
        key: apiKey.key,
        name: apiKey.name,
        createdAt: apiKey.createdAt,
      },
    });
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({ error: 'Failed to generate API key' });
  }
}

export async function getApiKeys(req, res) {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: req.userId },
      select: {
        id: true,
        name: true,
        active: true,
        createdAt: true,
        lastUsedAt: true,
      },
    });

    res.json({ apiKeys });
  } catch (error) {
    console.error('Get API keys error:', error);
    res.status(500).json({ error: 'Failed to get API keys' });
  }
}

export async function revokeApiKey(req, res) {
  try {
    const { id } = req.params;

    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    });

    if (!apiKey || apiKey.userId !== req.userId) {
      return res.status(404).json({ error: 'API key not found' });
    }

    await prisma.apiKey.update({
      where: { id },
      data: { active: false },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
}

export async function validateApiKey(apiKey) {
  try {
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey },
    });

    if (!key || !key.active) {
      return null;
    }

    // Update last used time
    await prisma.apiKey.update({
      where: { key: apiKey },
      data: { lastUsedAt: new Date() },
    });

    return key.userId;
  } catch (error) {
    return null;
  }
}
