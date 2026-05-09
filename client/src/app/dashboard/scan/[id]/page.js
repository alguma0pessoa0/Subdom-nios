'use client';
import { useEffect, useState } from 'react';
import { scanAPI } from '@/lib/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { Target, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

export default function ScanDetail({ params }) {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    fetchScan();
    const interval = setInterval(fetchScan, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchScan = async () => {
    try {
      const response = await scanAPI.getScan(params.id);
      setScan(response.data.scan);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch scan:', error);
    }
  };

  const handleExport = async (format) => {
    try {
      setExporting(format);
      const response = await scanAPI.exportScan(params.id, format);

      const blob = new Blob([response.data], {
        type:
          format === 'csv'
            ? 'text/csv'
            : format === 'json'
            ? 'application/json'
            : 'application/pdf',
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan-${params.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Exportado em ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Erro ao exportar');
    } finally {
      setExporting(null);
    }
  };

  if (loading || !scan) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statusColors = {
    PENDING: 'yellow',
    RUNNING: 'blue',
    COMPLETED: 'green',
    FAILED: 'red',
  };

  const statusColor = statusColors[scan.status] || 'slate';

  // Dados para gráficos
  const pieData = [
    { name: 'Ativos', value: scan.stats?.active || 0 },
    { name: 'Inativos', value: scan.stats?.inactive || 0 },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  return (
    <div className="max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            ← Voltar
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{scan.domain}</h1>
            <p className="text-slate-400 mt-1">
              Varredura {scan.scanType} • {new Date(scan.createdAt).toLocaleString('pt-BR')}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-lg font-semibold text-white bg-${statusColor}-900/30 border border-${statusColor}-700/50 text-${statusColor}-300`}
          >
            {scan.status}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total de Subdomínios',
            value: scan.totalFound,
            icon: Target,
          },
          { label: 'Ativos', value: scan.stats?.active || 0, icon: Target },
          { label: 'Inativos', value: scan.stats?.inactive || 0, icon: Target },
          { label: 'Tempo de Execução', value: `${scan.executionTime}ms`, icon: Target },
        ].map((stat, i) => (
          <Card key={i}>
            <p className="text-slate-400 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Status dos Subdomínios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Técnicas Utilizadas</h3>
          <div className="space-y-2">
            {scan.techniques.map((tech, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 bg-slate-800/30 rounded"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <span className="text-sm">{tech}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Export */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Exporta Resultados</h3>
        <div className="flex gap-3">
          {['csv', 'json'].map((format) => (
            <Button
              key={format}
              variant="secondary"
              onClick={() => handleExport(format)}
              loading={exporting === format}
              disabled={exporting !== null}
            >
              <Download className="w-4 h-4" />
              {format.toUpperCase()}
            </Button>
          ))}
        </div>
      </Card>

      {/* Subdomains Table */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Subdomínios Encontrados</h3>
        {scan.subdomains.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            Nenhum subdomínio encontrado
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4">Subdomínio</th>
                  <th className="text-left py-3 px-4">IP</th>
                  <th className="text-center py-3 px-4">Status</th>
                  <th className="text-center py-3 px-4">HTTP</th>
                  <th className="text-center py-3 px-4">SSL</th>
                  <th className="text-center py-3 px-4">Tempo (ms)</th>
                </tr>
              </thead>
              <tbody>
                {scan.subdomains.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-800 hover:bg-slate-800/20">
                    <td className="py-3 px-4 font-mono text-xs">{sub.subdomain}</td>
                    <td className="py-3 px-4 font-mono text-xs">{sub.ip || 'N/A'}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          sub.status === 'active'
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.httpCode ? (
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            sub.httpCode >= 200 && sub.httpCode < 400
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {sub.httpCode}
                        </span>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {sub.ssl ? (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                          ✓
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">{sub.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
