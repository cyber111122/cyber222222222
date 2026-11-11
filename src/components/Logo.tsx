import { appConfig } from '@/config/app.config';

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 56, className = '' }: LogoProps) {
  return (
    <img
      src="/logo-1024.png"
      alt={`شعار ${appConfig.clubNameAr}`}
      width={size}
      height={size}
      decoding="async"
      className={`rounded-full object-contain ring-1 ring-brand-400 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
