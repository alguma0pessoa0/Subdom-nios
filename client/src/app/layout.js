import './styles/globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'SubRecon Pro - Subdomain Intelligence Platform',
  description: 'Enterprise-grade cybersecurity SaaS for subdomain enumeration and reconnaissance',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
