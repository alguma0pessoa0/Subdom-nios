'use client';
import { useEffect, useState } from 'react';
import { scanAPI } from '@/lib/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { TrendingUp, Zap, Target, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function DashboardOverview() {
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await scanAPI.getScanHistory(5, 0);
      setRecentScans(response.data.scans);

      // Calculate stats
      const totalScans = response.data.pagination.total;
      const totalSubdomains = response.data.scans.reduce(
        (sum, scan) => sum + scan.totalFound,
        0
      );

      setStats({
        totalScans,
        totalSubdomains,
        avgExecutionTime: Math.round(
          response.data.scans.reduce((sum, s) => sum + s.executionTime, 0) /
            response.data.scans.length
        ),
      });
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Target,
            label: 'Total de Scans',
            value: stats?.totalScans || 0,
            color: 'blue',
          },
          {
            icon: Zap,
            label: 'Subdomínios Encontrados',
            value: stats?.totalSubdomains || 0,
            color: 'purple',
          },
          {
            icon: Clock,
            label: 'Tempo Médio',
            value: `${stats?.avgExecutionTime || 0}ms`,
            color: 'green',
          },
          {
            icon: TrendingUp,
            label: 'Plano',
            value: 'Free',
            color: 'pink',
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 text-${stat.color}-400 opacity-50`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent">
            <h3 className="text-lg font-semibold mb-4">Começar Nova Varredura</h3>
            <p className="text-slate-400 text-sm mb-6">
              Descubra subdomínios em seus domínios usando Light ou Deep scan
            </p>
            <Link href="/dashboard/scan/new">
              <Button variant="primary" className="w-full">
                Nova Varredura
              </Button>
            </Link>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
            <h3 className="text-lg font-semibold mb-4">Gerenciar API Keys</h3>
            <p className="text-slate-400 text-sm mb-6">
              Crie e gerencie suas chaves de API para acesso programático
            </p>
            <Link href="/dashboard/api-keys">
              <Button variant="primary" className="w-full">
                API Keys
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>

      {/* Recent Scans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Scans Recentes</h2>
        <Card>
          {recentScans.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400">
                Nenhum scan realizado ainda. Comece criando um!
              </p>
              <Link href="/dashboard/scan/new" className="mt-6 inline-block">
                <Button variant="primary">Criar Primeira Varredura</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                      Domínio
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                      Subdomínios
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-slate-400 font-semibold">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentScans.map((scan) => (
                    <tr
                      key={scan.id}
                      className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-sm">
                        <Link
                          href={`/dashboard/scan/${scan.id}`}
                          className="text-blue-400 hover:underline"
                        >
                          {scan.domain}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-slate-800 rounded text-xs">
                          {scan.scanType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {scan._count.subdomains}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            scan.status === 'COMPLETED'
                              ? 'bg-green-900/30 text-green-400'
                              : scan.status === 'RUNNING'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {scan.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-sm">
                        {new Date(scan.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
