'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { plants } from '@/data/parks';

type Props = {
  open: boolean;
  onClose: () => void;
  onScannedPlantId: (plantId: string) => void;
  darkMode?: boolean;
};

function normalizeCode(raw: string): string {
  const s = raw.trim();
  // Accept formats:
  // - "pl1"
  // - "greenpulse://plant/pl1"
  // - "https://greenpulse.app/plant/pl1"
  const m = s.match(/(pl\d+)/i);
  if (m?.[1]) return m[1].toLowerCase();
  return s.toLowerCase();
}

export default function QrScannerModal({ open, onClose, onScannedPlantId, darkMode }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [manual, setManual] = useState('');

  const supported = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices && 'BarcodeDetector' in window;
  }, []);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setManual('');

    const start = async () => {
      if (!supported) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        // @ts-expect-error BarcodeDetector exists in supporting browsers
        const detector = new BarcodeDetector({ formats: ['qr_code'] });

        const scan = async () => {
          if (!open) return;
          try {
            const v = videoRef.current;
            if (v && v.readyState >= 2) {
              const codes = await detector.detect(v);
              if (codes?.length) {
                const raw = String(codes[0].rawValue || '');
                const code = normalizeCode(raw);
                if (plants.some(p => p.id === code)) {
                  onScannedPlantId(code);
                  onClose();
                  return;
                } else {
                  setErr('QR detected, but it is not a Green Pulse plant code.');
                }
              }
            }
          } catch (_) {
            // ignore per-frame errors
          }
          rafRef.current = window.requestAnimationFrame(scan);
        };

        rafRef.current = window.requestAnimationFrame(scan);
      } catch (e: any) {
        setErr(e?.message || 'Camera permission denied.');
      }
    };

    start();

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      const s = streamRef.current;
      if (s) s.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [open, supported, onClose, onScannedPlantId]);

  if (!open) return null;

  const frame = darkMode ? 'bg-gray-950/70' : 'bg-black/50';
  const panel = darkMode ? 'bg-gray-900 border-gray-800 text-gray-100' : 'bg-white border-gray-100 text-gray-800';

  const submitManual = () => {
    const code = normalizeCode(manual);
    if (!plants.some(p => p.id === code)) {
      setErr('That code does not match any plant in demo data. Try something like "pl1".');
      return;
    }
    onScannedPlantId(code);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[2000] ${frame} flex items-center justify-center p-4`}>
      <div className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${panel}`}>
        <div className="p-4 flex items-center justify-between">
          <div>
            <div className="font-black text-sm">Scan Plant QR</div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Point camera at a QR code in the park</div>
          </div>
          <button onClick={onClose} className={`w-9 h-9 rounded-full flex items-center justify-center ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <X size={16} />
          </button>
        </div>

        {supported ? (
          <div className="px-4 pb-4">
            <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-100 bg-black'}`}>
              <video ref={videoRef} className="w-full aspect-video object-cover" playsInline muted />
            </div>
            <div className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Demo codes: <span className="font-bold">pl1</span> … <span className="font-bold">pl10</span>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-4">
            <div className={`rounded-2xl p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
              <div className="text-sm font-bold mb-1">Camera scan not supported here</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter a demo QR code manually.</div>
            </div>
          </div>
        )}

        {err && (
          <div className={`mx-4 mb-3 rounded-2xl p-3 text-xs border ${darkMode ? 'bg-red-900/20 border-red-800/40 text-red-200' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {err}
          </div>
        )}

        <div className="px-4 pb-4 flex gap-2">
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            placeholder="Or type code (e.g., pl1)"
            className={`flex-1 rounded-xl border px-3 py-2 text-sm outline-none ${darkMode ? 'bg-gray-950 border-gray-800 text-gray-100 placeholder-gray-600 focus:border-green-700' : 'bg-white border-gray-200 focus:border-green-500'}`}
          />
          <button
            onClick={submitManual}
            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

