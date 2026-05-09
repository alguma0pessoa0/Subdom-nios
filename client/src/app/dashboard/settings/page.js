'use client';
import { useAuthStore } from '@/lib/store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Alert from '@/components/Alert';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-slate-400 mt-1">Gerencie suas preferências da conta</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Informações da Conta</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400">Nome</label>
            <p className="text-lg font-semibold mt-1">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm text-slate-400">Email</label>
            <p className="text-lg font-semibold mt-1">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm text-slate-400">Plano Atual</label>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-lg font-semibold text-blue-400">{user?.plan}</span>
              {user?.plan === 'FREE' && (
                <Button variant="primary" size="sm">
                  Upgrade para PRO
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Billing */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Billing & Planos</h3>
        <Alert type="info" message="Gerenciamento de pagamentos e planos em breve" />
        <div className="mt-4 space-y-3">
          {[
            { name: 'Free', price: '$0/mês', features: ['5 scans/dia', 'Light only'] },
            {
              name: 'Pro',
              price: '$29/mês',
              features: ['Unlimited scans', 'Light + Deep', 'API access'],
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className="p-4 bg-slate-800/30 rounded border border-slate-700 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{plan.name}</h4>
                <p className="text-sm text-slate-400">{plan.price}</p>
              </div>
              {user?.plan === 'FREE' && plan.name === 'Pro' && (
                <Button variant="primary" size="sm">
                  Escolher
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Segurança</h3>
        <div className="space-y-3">
          <Button variant="secondary" className="w-full">
            Alterar Senha
          </Button>
          <Button variant="secondary" className="w-full">
            Ativar Autenticação de Dois Fatores
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30 bg-red-500/5">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Zona de Perigo</h3>
        <p className="text-sm text-slate-400 mb-4">
          Estas ações são permanentes e não podem ser desfeitas
        </p>
        <div className="space-y-3">
          <Button variant="danger" className="w-full">
            Deletar Conta
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={handleLogout}
          >
            Fazer Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
