'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LayoutGrid,
  Plus,
  History,
  FileText,
  Key,
  Settings,
  LogOut,
  Radar,
} from 'lucide-react';
import Button from '@/components/Button';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const menuItems = [
    { icon: LayoutGrid, label: 'Overview', href: '/dashboard', exact: true },
    { icon: Plus, label: 'Nova Varredura', href: '/dashboard/scan/new' },
    { icon: History, label: 'Histórico', href: '/dashboard/scans' },
    { icon: FileText, label: 'Relatórios', href: '/dashboard/reports' },
    { icon: Key, label: 'API Keys', href: '/dashboard/api-keys' },
    { icon: Settings, label: 'Configurações', href: '/dashboard/settings' },
  ];

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full pt-6 px-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 mb-8 px-2">
            <Radar className="w-8 h-8 text-blue-400 flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-lg font-bold gradient-text">SubRecon</span>
            )}
          </Link>

          {/* Menu */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-100">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>

          {/* User Info */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            {sidebarOpen && (
              <div className="px-4 py-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-500 mb-1">Plano Atual</div>
                <div className="text-sm font-semibold text-blue-400">{user.plan}</div>
              </div>
            )}
            
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && 'Logout'}
            </Button>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full mt-4 p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 mx-auto text-slate-400" />
            ) : (
              <Menu className="w-5 h-5 mx-auto text-slate-400" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 overflow-auto transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <div className="bg-slate-950 min-h-screen">
          {/* Top Bar */}
          <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-30">
            <div className="px-8 py-4 flex items-center justify-between">
              <h1 className="text-xl font-semibold text-slate-100">
                Bem-vindo, {user.name}!
              </h1>
              <div className="flex items-center gap-4"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
