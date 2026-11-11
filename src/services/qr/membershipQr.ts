const MEMBERSHIP_NUMBER_PATTERN = /^EM-\d{4}-\d{3,}$/;

export function parseMembershipQr(raw: string): string | null {
  const candidate = raw.trim().toUpperCase();
  return MEMBERSHIP_NUMBER_PATTERN.test(candidate) ? candidate : null;
}
