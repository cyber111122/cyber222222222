import { ImageOff } from 'lucide-react';

interface ContentImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function ContentImage({ src, alt, className = '' }: ContentImageProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-100 text-stone-600 ${className}`}
        aria-hidden="true"
      >
        <ImageOff size={28} />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={`object-cover ${className}`} />;
}
