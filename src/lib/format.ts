export const toLocalDateTimeString = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const generateFINumber = (): string => {
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `207${suffix}`;
};

export const formatName = (individual: { firstName: string; middleName: string; lastName: string; suffix: string }): string => {
  const parts = [individual.firstName, individual.middleName, individual.lastName, individual.suffix].filter(Boolean);
  return parts.join(' ') || 'Unknown';
};

export const formatRelativeTime = (timestamp: string): string => {
  const now = new Date();
  const then = new Date(timestamp);
  const diff = now.getTime() - then.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const formatFINumber = (n: string): string => `FI #${n}`;
