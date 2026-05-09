export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function formatDomain(domain) {
  return domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function getStatusColor(status) {
  switch (status) {
    case 'active':
      return 'text-green-400';
    case 'inactive':
      return 'text-red-400';
    case 'pending':
      return 'text-yellow-400';
    default:
      return 'text-slate-400';
  }
}
