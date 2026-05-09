'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { scanAPI } from '@/lib/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Alert from '@/components/Alert';
import { formatDomain } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Zap } from 'lucide-react';

export default function NewScan() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [scanType, setScanType] = useState('LIGHT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      setError('Domínio é obrigatório');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedDomain = formatDomain(domain);
      const response = await scanAPI.createScan({
        domain: formattedDomain,
        scanType,
      });

      toast.success('Varredura iniciada!');
      router.push(`/dashboard/scan/${response.data.scan.id}`);
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar varredura';
      if (error.response?.data?.upgrade) {
        setError(`${message} Upgrade para PRO para acessar.`);
      } else {
        setError(message);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Nova Varredura</h1>
      <p className="text-slate-400 mb-8">
        Digite um domínio e escolha o tipo de varredura
      </p>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Domínio"
            type="text"
            value={domain}
            onChange={(e) => {
              setDomain(e.target.value);
              setError('');
            }}
            placeholder="exemplo.com.br"
            disabled={loading}
            error={error}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Tipo de Varredura
            </label>
            <div className="space-y-3">
              {[
                {
                  value: 'LIGHT',
                  title: 'Light Scan',
                  desc: 'Técnicas passivas rápidas',
                  techniques: [
                    'Passive DNS',
                    'DNS Records',
                    'DNS Enumeration',
                  ],
                },
                {
                  value: 'DEEP',
                  title: 'Deep Scan',
                  desc: 'Análise completa com brute force',
                  techniques: [
                    'Light + Certificate Transparency',
                    'SSL Certificates',
                    'HTML Crawling',
                    'Wordlist Bruteforce',
                  ],
                  proOnly: true,
                },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    scanType === type.value
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600'
                  } ${type.proOnly ? 'opacity-50' : ''}`}
                >
                  <input
                    type="radio"
                    name="scanType"
                    value={type.value}
                    checked={scanType === type.value}
                    onChange={(e) => setScanType(e.target.value)}
                    disabled={type.proOnly}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{type.title}</h3>
                      {type.proOnly && (
                        <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded">
                          PRO
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{type.desc}</p>
                    <ul className="mt-2 space-y-1 text-xs text-slate-500">
                      {type.techniques.map((tech, i) => (
                        <li key={i}>✓ {tech}</li>
                      ))}
                    </ul>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Alert
            type="info"
            title="Comparação de Técnicas"
            message="Veja a página de Técnicas para visualizar um comparativo completo entre Light e Deep scan."
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              className="flex-1"
            >
              <Zap className="w-5 h-5" />
              Iniciar Varredura
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>

      {/* Técnicas Comparativas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Técnicas Utilizadas</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4">Técnica</th>
                  <th className="text-center py-3 px-4">Light</th>
                  <th className="text-center py-3 px-4">Deep</th>
                </tr>
              </thead>
              <tbody>
                {[
                  'Passive DNS',
                  'DNS Records',
                  'DNS Enumeration',
                  'Certificate Transparency',
                  'SSL Certificate Parsing',
                  'HTML Crawling',
                  'Search Engine Scraping',
                  'External APIs',
                  'Reverse DNS',
                  'CNAME Brute',
                  'Wordlist Bruteforce',
                ].map((tech) => {
                  const isBasic = [
                    'Passive DNS',
                    'DNS Records',
                    'DNS Enumeration',
                  ].includes(tech);
                  return (
                    <tr key={tech} className="border-b border-slate-800">
                      <td className="py-3 px-4">{tech}</td>
                      <td className="py-3 px-4 text-center">
                        {isBasic ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-green-400">✓</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
