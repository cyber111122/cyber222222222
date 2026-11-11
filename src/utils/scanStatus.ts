import type { ScanStatus } from '@/types';

export interface ScanStatusMeta {
  label: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
}

export const scanStatusMeta: Record<ScanStatus, ScanStatusMeta> = {
  active: { label: 'عضوية نشطة', tone: 'success' },
  pending: { label: 'قيد المراجعة', tone: 'warning' },
  inactive: { label: 'عضوية غير نشطة', tone: 'warning' },
  suspended: { label: 'عضوية موقوفة', tone: 'danger' },
  not_found: { label: 'رقم عضوية غير موجود', tone: 'neutral' },
  invalid: { label: 'رمز QR غير صالح', tone: 'neutral' },
};
