import { supabaseAuthService, supabaseContentService, supabaseMemberService, supabaseNotificationService } from '@/services/supabaseServices';

export const services = {
  auth: supabaseAuthService,
  members: supabaseMemberService,
  content: supabaseContentService,
  notifications: supabaseNotificationService,
};
