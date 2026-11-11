const dateFormatter = new Intl.DateTimeFormat('ar', { day: 'numeric', month: 'long', year: 'numeric' });
const dateTimeFormatter = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function isPast(value: string | null): boolean {
  return value !== null && new Date(value).getTime() < Date.now();
}
