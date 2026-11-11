import type { MembershipStatus } from '@/types';

export interface MembershipStatusMeta {
  label: string;
  description: string;
  tone: 'success' | 'warning' | 'danger' | 'neutral';
}

export const membershipStatusMeta: Record<MembershipStatus, MembershipStatusMeta> = {
  active: {
    label: 'عضوية نشطة',
    description: 'عضويتك معتمدة وسارية.',
    tone: 'success',
  },
  pending: {
    label: 'قيد المراجعة',
    description: 'طلب انخراطك قيد المراجعة من الإدارة.',
    tone: 'warning',
  },
  inactive: {
    label: 'عضوية غير نشطة',
    description: 'عضويتك غير نشطة حاليًا. تواصل مع إدارة النادي.',
    tone: 'neutral',
  },
  suspended: {
    label: 'عضوية موقوفة',
    description: 'عضويتك موقوفة. تواصل مع إدارة النادي لمزيد من المعلومات.',
    tone: 'danger',
  },
};
