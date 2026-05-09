'use client';
import { useEffect, useState } from 'react';
import { apiKeyAPI } from '@/lib/api';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Alert from '@/components/Alert';
import { Copy, Trash2, Plus } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '' });
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKey, setNewKey] = useState(null);

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await apiKeyAPI.getKeys();
      setApiKeys(response.data.apiKeys);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      toast.error('Erro ao carregar chaves de API');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Nome da chave é obrigatório');
      return;
    }

    setCreatingKey(true);

    try {
      const response = await apiKeyAPI.generateKey(formData);
      setNewKey(response.data.apiKey);
      setFormData({ name: '' });
      setShowForm(false);
      await fetchApiKeys();
      toast.success('Chave de API criada!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erro ao criar chave');
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (id) => {
    if (!confirm('Tem certeza que deseja revogar esta chave?')) {
      return;
    }

    try {
      await apiKeyAPI.revokeKey(id);
      await fetchApiKeys();
      toast.success('Chave revogada');
    } catch (error) {
      toast.error('Erro ao revogar chave');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-slate-400 mt-1">
            Gerenciar suas chaves de API para acesso programático
          </p>
        </div>
        {!showForm && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" />
            Nova Chave
          </Button>
        )}
      </div>

      <Alert
        type="info"
        title="Como usar a API"
        message="Inclua sua chave no header: x-api-key: sk_xxxx"
      />

      {/* Create Form */}
      {showForm && (
        <Card>
          <form onSubmit={handleCreateKey} className="space-y-4">
            <Input
              label="Nome da Chave"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              placeholder="ex: My App"
              disabled={creatingKey}
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                loading={creatingKey}
                disabled={creatingKey}
              >
                Criar Chave
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: '' });
                }}
                disabled={creatingKey}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* New Key Display */}
      {newKey && (
        <Card className="border-green-500/50 bg-green-500/10">
          <h3 className="font-semibold mb-2">Chave Criada com Sucesso!</h3>
          <p className="text-sm text-slate-400 mb-4">
            Copie esta chave e guarde em um local seguro. Ela não será exibida novamente.
          </p>
          <div className="flex gap-2 items-center bg-slate-900 p-4 rounded border border-slate-700 mb-4">
            <code className="flex-1 font-mono text-sm break-all">{newKey.key}</code>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => copyToClipboard(newKey.key)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={() => setNewKey(null)}
            className="w-full"
          >
            Entendido
          </Button>
        </Card>
      )}

      {/* Keys List */}
      <Card>
        {apiKeys.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Nenhuma chave de API criada</p>
            <p className="text-sm text-slate-500 mt-1">
              Crie uma nova chave para começar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="p-4 bg-slate-800/30 rounded border border-slate-700 flex items-start justify-between"
              >
                <div className="flex-1">
                  <h4 className="font-semibold">{key.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Criada em {new Date(key.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  {key.lastUsedAt && (
                    <p className="text-xs text-slate-500">
                      Última utilização:{' '}
                      {new Date(key.lastUsedAt).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  <div className="mt-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        key.active
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {key.active ? 'Ativa' : 'Revogada'}
                    </span>
                  </div>
                </div>
                {key.active && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRevokeKey(key.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* API Documentation */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Documentação da API</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Criar Varredura</h4>
            <code className="block bg-slate-800 p-3 rounded font-mono text-xs mb-2">
              POST /api/v1/scan<br />
              Header: x-api-key: sk_xxxx<br />
              {'{'}domain: "example.com", scanType: "LIGHT"{'}'}
            </code>
          </div>

          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Obter Resultado</h4>
            <code className="block bg-slate-800 p-3 rounded font-mono text-xs">
              GET /api/v1/scan/{scanId}<br />
              Header: x-api-key: sk_xxxx
            </code>
          </div>
        </div>
      </Card>
    </div>
  );
}
