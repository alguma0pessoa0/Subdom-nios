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

export default function Register() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não conferem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setUser(response.data.user);
      setToken(response.data.token);

      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao criar conta';
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

          <h2 className="text-2xl font-bold mb-2 text-center">Criar Conta</h2>
          <p className="text-slate-400 text-center mb-8">
            Comece a enumerar subdomínios gratuitamente
          </p>

          {errors.submit && <Alert type="error" message={errors.submit} className="mb-6" />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome"
              error={errors.name}
              disabled={loading}
              required
            />

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
              placeholder="Min. 8 caracteres"
              error={errors.password}
              disabled={loading}
              required
            />

            <Input
              label="Confirmar Senha"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme sua senha"
              error={errors.confirmPassword}
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
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">Já tem uma conta?</p>
            <Link href="/login">
              <Button variant="ghost" className="w-full mt-2">
                Fazer Login
              </Button>
            </Link>
          </div>
        </Card>

        <Alert
          type="info"
          title="Plano Free Automaticamente"
          message="Sua conta será criada com o plano Free (5 scans/dia)"
          className="mt-6"
        />
      </div>
    </div>
  );
}
