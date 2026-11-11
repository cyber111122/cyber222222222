import type { Opportunity } from '@/types';

export const opportunityCategoryLabels: Record<Opportunity['category'], string> = {
  training: 'التكوين والتدريب',
  technology: 'التكنولوجيا والذكاء الاصطناعي',
  robotics: 'الروبوتيك',
  drones: 'الطائرات بدون طيار',
  entrepreneurship: 'ريادة الأعمال',
  culture: 'الثقافة والسياحة',
  volunteering: 'المبادرات التطوعية',
  competitions: 'المسابقات',
  forums: 'الملتقيات',
};
