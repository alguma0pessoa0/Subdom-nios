'use client';
import { useEffect, useState } from 'react';
import { scanAPI } from '@/lib/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { Trash2, Eye, Download } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ total: 0, limit: 10, offset: 0 });

  useEffect(() => {
    fetchScans();
  }, [pagination.offset]);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const response = await scanAPI.getScanHistory(pagination.limit, pagination.offset);
      setScans(response.data.scans);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch scans:', error);
      toast.error('Erro ao carregar histórico');
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Histórico de Varreduras</h1>
          <p className="text-slate-400 mt-1">
            Total: {pagination.total} varreduras
          </p>
        </div>
        <Link href="/dashboard/scan/new">
          <Button variant="primary">Nova Varredura</Button>
        </Link>
      </div>

      <Card>
        {scans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Nenhuma varredura realizada ainda</p>
            <Link href="/dashboard/scan/new" className="mt-6 inline-block">
              <Button variant="primary">Criar Primeira Varredura</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400">Domínio</th>
                  <th className="text-left py-3 px-4 text-slate-400">Tipo</th>
                  <th className="text-left py-3 px-4 text-slate-400">Subdomínios</th>
                  <th className="text-left py-3 px-4 text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400">Data</th>
                  <th className="text-left py-3 px-4 text-slate-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {scans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-sm">{scan.domain}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-slate-800 rounded text-xs">
                        {scan.scanType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{scan._count.subdomains}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          scan.status === 'COMPLETED'
                            ? 'bg-green-900/30 text-green-400'
                            : scan.status === 'RUNNING'
                            ? 'bg-yellow-900/30 text-yellow-400'
                            : scan.status === 'PENDING'
                            ? 'bg-blue-900/30 text-blue-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}
                      >
                        {scan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {new Date(scan.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link href={`/dashboard/scan/${scan.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex gap-2 justify-center">
          <Button
            variant="secondary"
            disabled={pagination.offset === 0}
            onClick={() =>
              setPagination({
                ...pagination,
                offset: Math.max(0, pagination.offset - pagination.limit),
              })
            }
          >
            Anterior
          </Button>
          <span className="flex items-center justify-center px-4 py-2">
            Página {Math.floor(pagination.offset / pagination.limit) + 1} de{' '}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <Button
            variant="secondary"
            disabled={pagination.offset + pagination.limit >= pagination.total}
            onClick={() =>
              setPagination({
                ...pagination,
                offset: pagination.offset + pagination.limit,
              })
            }
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
