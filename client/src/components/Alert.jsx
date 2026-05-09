import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function Alert({ type = 'info', title, message, className = '' }) {
  const styles = {
    info: 'bg-blue-900/20 border-blue-700/50 text-blue-300',
    success: 'bg-green-900/20 border-green-700/50 text-green-300',
    warning: 'bg-yellow-900/20 border-yellow-700/50 text-yellow-300',
    error: 'bg-red-900/20 border-red-700/50 text-red-300',
  };

  const icons = {
    info: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  };

  return (
    <div className={`border rounded-lg p-4 flex gap-3 ${styles[type]} ${className}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
    </div>
  );
}
