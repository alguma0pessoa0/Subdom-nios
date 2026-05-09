'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { authAPI } from '@/lib/api';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import Alert from '@/components/Alert';
import { Shield, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const user = useAuthStore((state) => state.user);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      setToken(response.data.token);
      
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao fazer login';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 text-slate-400 hover:text-slate-300">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <Card>
          <div className="flex items-center gap-2 mb-8 justify-center">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold gradient-text">SubRecon Pro</h1>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">Fazer Login</h2>
          <p className="text-slate-400 text-center mb-8">
            Entre em sua conta para acessar a plataforma
          </p>

          {errors.submit && <Alert type="error" message={errors.submit} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              error={errors.email}
              disabled={loading}
              required
            />

            <Input
              label="Senha"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Sua senha"
              error={errors.password}
              disabled={loading}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">Não tem uma conta?</p>
            <Link href="/register">
              <Button variant="ghost" className="w-full mt-2">
                Criar Conta
              </Button>
            </Link>
          </div>
        </Card>

        <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800 text-center text-sm text-slate-400">
          <p>📧 <strong>Demo:</strong> demo@subrecon.com / password123</p>
        </div>
      </div>
    </div>
  );
}
