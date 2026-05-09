'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, Lock, ArrowRight, Check } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur border-b border-slate-800' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold gradient-text">SubRecon Pro</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Iniciar Teste Grátis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center z-10"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
            Inteligência de Subdomínios em Nível Empresarial
          </h1>
          
          <p className="text-xl text-slate-400 mb-8 leading-relaxed">
            SubRecon Pro é a plataforma SaaS definitiva para descoberta, enumeração e análise de subdomínios.
            Desenvolvida para profissionais de segurança, pentestadores e analistas de cibersegurança.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link href="/register">
              <Button variant="primary" size="lg">
                Começar Agora <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="secondary" size="lg">
              Ver Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 text-sm">
            <div className="cyber-card">
              <div className="text-3xl font-bold text-blue-400">10K+</div>
              <p className="text-slate-400">Subdomínios/dia</p>
            </div>
            <div className="cyber-card">
              <div className="text-3xl font-bold text-purple-400">99.9%</div>
              <p className="text-slate-400">Uptime</p>
            </div>
            <div className="cyber-card">
              <div className="text-3xl font-bold text-pink-400">5min</div>
              <p className="text-slate-400">Tempo médio</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
          Recursos Poderosos
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Enumeração Rápida',
              desc: 'Scanners Light e Deep com resultados em minutos',
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Segurança em Primeiro Lugar',
              desc: 'Encriptação end-to-end e conformidade com LGPD',
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: 'Analytics Avançado',
              desc: 'Gráficos e relatórios detalhados de cada scan',
            },
            {
              icon: <Lock className="w-6 h-6" />,
              title: 'API RESTful',
              desc: 'Integração completa com suas ferramentas',
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Histórico Completo',
              desc: 'Rastreie todos os seus scans com timestamps',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Exportação',
              desc: 'CSV, JSON e PDF para seus relatórios',
            },
          ].map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="hover:border-blue-500/50 cursor-pointer">
                <div className="text-blue-400 mb-3">{feat.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm">{feat.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
          Planos Transparentes
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: 'Free',
              price: '$0',
              desc: 'Perfeito para começar',
              features: [
                '5 scans/dia',
                'Apenas Light',
                '500 subdomínios',
                'Suporte por email',
              ],
            },
            {
              name: 'Pro',
              price: '$29',
              desc: 'Mais popular',
              highlighted: true,
              features: [
                'Unlimited scans',
                'Light + Deep',
                'Acesso à API',
                'Exportação avançada',
                'Suporte 24/7',
              ],
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              desc: 'Para times',
              features: [
                'Multi-user',
                'Priority queue',
                'SLA garantido',
                'Dedicated support',
                'Single Sign-On',
              ],
            },
          ].map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={plan.highlighted ? 'border-blue-500 shadow-lg shadow-blue-500/20 scale-105' : ''}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.desc}</p>
                <div className="text-4xl font-bold mb-6">{plan.price}</div>
                <Button variant={plan.highlighted ? 'primary' : 'secondary'} className="w-full mb-6">
                  Começar
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="text-center border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-slate-400 mb-8">
            Junte-se a centenas de profissionais de segurança usando SubRecon Pro
          </p>
          <Link href="/register">
            <Button variant="primary" size="lg">
              Criar Conta Grátis <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20 py-10 text-center text-slate-400 text-sm">
        <p>&copy; 2024 SubRecon Pro. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
