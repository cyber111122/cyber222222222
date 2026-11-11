import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { AlertTriangle, Camera, Loader2 } from 'lucide-react';

type CameraState = 'starting' | 'scanning' | 'denied' | 'unsupported' | 'error';

interface QrScannerProps {
  onDetect: (raw: string) => void;
}

const stateMessages: Record<Exclude<CameraState, 'starting' | 'scanning'>, string> = {
  denied: 'تم رفض إذن الكاميرا. فعّله من إعدادات الهاتف، أو استخدم البحث اليدوي.',
  unsupported: 'الكاميرا غير متاحة على هذا الجهاز. استخدم البحث اليدوي.',
  error: 'تعذر تشغيل الكاميرا. تحقق من الإعدادات وحاول مرة أخرى.',
};

export function QrScanner({ onDetect }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDetectRef = useRef(onDetect);
  const [cameraState, setCameraState] = useState<CameraState>('starting');

  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('unsupported');
      return;
    }

    let stream: MediaStream | null = null;
    let frameId = 0;
    let stopped = false;

    function stop() {
      stopped = true;
      cancelAnimationFrame(frameId);
      stream?.getTracks().forEach((track) => track.stop());
      video!.srcObject = null;
    }

    function scanFrame() {
      if (stopped) return;
      if (video!.readyState === video!.HAVE_ENOUGH_DATA && video!.videoWidth > 0) {
        const context = canvas!.getContext('2d', { willReadFrequently: true });
        if (context) {
          canvas!.width = video!.videoWidth;
          canvas!.height = video!.videoHeight;
          context.drawImage(video!, 0, 0, canvas!.width, canvas!.height);
          const image = context.getImageData(0, 0, canvas!.width, canvas!.height);
          const code = jsQR(image.data, image.width, image.height, { inversionAttempts: 'dontInvert' });
          if (code?.data) {
            stop();
            onDetectRef.current(code.data);
            return;
          }
        }
      }
      frameId = requestAnimationFrame(scanFrame);
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(async (mediaStream) => {
        if (stopped) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = mediaStream;
        video!.srcObject = mediaStream;
        video!.setAttribute('playsinline', 'true');
        await video!.play();
        setCameraState('scanning');
        scanFrame();
      })
      .catch((err: unknown) => {
        if (stopped) return;
        const denied = err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
        setCameraState(denied ? 'denied' : 'error');
      });

    return stop;
  }, []);

  const failed = cameraState === 'denied' || cameraState === 'unsupported' || cameraState === 'error';

  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-xl2 border border-brand-200 bg-stone-100">
      <video ref={videoRef} muted autoPlay playsInline className="h-full w-full object-cover" aria-label="معاينة الكاميرا" />
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {cameraState === 'scanning' && (
        <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-brand-200 shadow-[0_0_0_9999px_rgba(6,19,44,0.45)]">
          <span className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-brand-50 animate-pulse" />
        </div>
      )}

      {cameraState === 'starting' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 text-sm text-stone-600">
          <Loader2 size={28} className="animate-spin text-brand-700" />
          جارٍ تشغيل الكاميرا...
        </div>
      )}

      {failed && (
        <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/90 p-6 text-center text-sm leading-relaxed text-danger-700">
          <AlertTriangle size={28} />
          {stateMessages[cameraState]}
        </div>
      )}

      {cameraState === 'scanning' && (
        <p className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 text-xs text-stone-900/90">
          <Camera size={14} />
          وجّه الكاميرا نحو رمز QR
        </p>
      )}
    </div>
  );
}
