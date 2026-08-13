import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { PageContainer } from '../components/layout/PageContainer';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Camera,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  WifiOff,
  XCircle,
  Info,
} from 'lucide-react';

/* ------------------------------------------------------------------
 * QR SCANNER STATES
 * ------------------------------------------------------------------
 * IDLE             – Initial screen with "Start Camera" button
 * REQUESTING       – Requesting camera permission via getUserMedia
 * PERMISSION_DENIED – User denied camera access
 * SCANNING         – Real camera stream active on <video> element
 * SUCCESS          – QR decoded successfully, shows valid Product ID
 * INVALID_QR       – QR found but not a valid BlockTrace Product ID
 * CAMERA_ERROR     – Camera hardware / API error
 * ------------------------------------------------------------------ */
type ScannerState =
  | 'IDLE'
  | 'REQUESTING'
  | 'PERMISSION_DENIED'
  | 'SCANNING'
  | 'SUCCESS'
  | 'INVALID_QR'
  | 'CAMERA_ERROR';

const BLOCKTRACE_ID_PATTERN = /^PROD-\d{6}$/i;

export const QrScannerPage: React.FC = () => {
  const { setActiveNav, setGlobalSearch } = useNavigation();
  const [state, setState] = useState<ScannerState>('IDLE');
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [manualInput, setManualInput] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up media stream track on unmount or retry
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Real browser camera permission request and stream initialization
  const handleStartScan = async () => {
    stopCameraStream();
    setState('REQUESTING');
    setScannedValue(null);
    setErrorMessage('');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (navigator.mediaDevices.getUserMedia) is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });

      streamRef.current = stream;
      setState('SCANNING');

      // Attach stream to video element after render
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.warn('Video playback notice:', e));
        }
      }, 100);
    } catch (err: any) {
      console.error('Camera Access Error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setState('PERMISSION_DENIED');
      } else {
        setErrorMessage(err.message || 'Camera device is unavailable or unreadable.');
        setState('CAMERA_ERROR');
      }
    }
  };

  const handleDecodeResult = (rawValue: string) => {
    stopCameraStream();
    const cleaned = rawValue.trim();
    if (BLOCKTRACE_ID_PATTERN.test(cleaned)) {
      setScannedValue(cleaned.toUpperCase());
      setState('SUCCESS');
    } else {
      setScannedValue(cleaned);
      setState('INVALID_QR');
    }
  };

  const handleVerifyResult = () => {
    if (scannedValue) {
      setGlobalSearch(scannedValue);
      setActiveNav('verify-product');
    }
  };

  const handleRetry = () => {
    stopCameraStream();
    setState('IDLE');
    setScannedValue(null);
    setErrorMessage('');
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      handleDecodeResult(manualInput.trim());
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Scan Product QR Code"
        description="Point your device camera at the QR code tag on physical packaging to instantly verify on Algorand."
        breadcrumbs={[
          { label: 'Verify Product', key: 'verify-product' },
          { label: 'QR Scanner' },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveNav('verify-product')}
          >
            Enter ID Instead
          </Button>
        }
      />

      <div className="max-w-lg mx-auto space-y-5">
        {/* Camera Viewfinder Card */}
        <Card variant="default" className="overflow-hidden">
          <div className="relative w-full aspect-square max-h-80 bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Corner brackets */}
            {(state === 'IDLE' || state === 'SCANNING' || state === 'REQUESTING') && (
              <>
                <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-teal-400 rounded-tl-lg z-20" />
                <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-teal-400 rounded-tr-lg z-20" />
                <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-teal-400 rounded-bl-lg z-20" />
                <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-teal-400 rounded-br-lg z-20" />
              </>
            )}

            {/* REAL CAMERA VIDEO STREAM */}
            {state === 'SCANNING' && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                {/* Laser animation overlay */}
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
                  <div className="relative w-48 h-48 border-2 border-teal-400/60 rounded-xl shadow-lg">
                    <div className="absolute left-0 right-0 h-0.5 bg-teal-400 shadow-lg shadow-teal-400 animate-bounce" style={{ top: '50%' }} />
                  </div>
                  <span className="mt-3 px-3 py-1 bg-slate-900/80 text-teal-300 rounded-full text-xs font-mono font-bold tracking-widest backdrop-blur-xs">
                    CAMERA ACTIVE — SCANNING...
                  </span>
                </div>
              </>
            )}

            {/* State: IDLE */}
            {state === 'IDLE' && (
              <div className="text-center space-y-3 p-6 z-10">
                <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-slate-300 text-sm font-semibold">Camera is off</p>
                <p className="text-slate-500 text-xs">Press the button below to initialize device camera feed.</p>
              </div>
            )}

            {/* State: REQUESTING PERMISSION */}
            {state === 'REQUESTING' && (
              <div className="text-center space-y-3 p-6 z-10">
                <div className="w-10 h-10 rounded-full border-4 border-slate-700 border-t-teal-500 animate-spin mx-auto" />
                <p className="text-slate-300 text-sm font-semibold">Requesting camera access...</p>
                <p className="text-slate-500 text-xs">Please allow camera permissions when requested by browser.</p>
              </div>
            )}

            {/* State: SUCCESS */}
            {state === 'SUCCESS' && (
              <div className="text-center space-y-3 p-6 z-10">
                <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500">
                  <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-300 font-bold text-sm">✓ QR Code Decoded Successfully</p>
                  <p className="text-white font-mono font-extrabold text-xl mt-1 tracking-wide">{scannedValue}</p>
                  <p className="text-slate-400 text-xs mt-0.5">Valid BlockTrace Product ID</p>
                </div>
              </div>
            )}

            {/* State: INVALID QR */}
            {state === 'INVALID_QR' && (
              <div className="text-center space-y-3 p-6 z-10">
                <div className="w-16 h-16 bg-amber-900/40 rounded-full flex items-center justify-center mx-auto border-2 border-amber-500">
                  <AlertCircle className="w-9 h-9 text-amber-400" />
                </div>
                <div>
                  <p className="text-amber-300 font-bold text-sm">Invalid QR Code Format</p>
                  <p className="text-slate-300 text-xs mt-1 break-all max-w-[220px]">
                    Decoded: <span className="font-mono text-white font-bold">{scannedValue}</span>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-1">Expected format: <span className="font-mono font-bold text-amber-200">PROD-XXXXXX</span></p>
                </div>
              </div>
            )}

            {/* State: CAMERA ERROR */}
            {state === 'CAMERA_ERROR' && (
              <div className="text-center space-y-3 p-6 z-10">
                <div className="w-16 h-16 bg-rose-900/40 rounded-full flex items-center justify-center mx-auto border-2 border-rose-500">
                  <XCircle className="w-9 h-9 text-rose-400" />
                </div>
                <div>
                  <p className="text-rose-300 font-bold text-sm">Camera Hardware Error</p>
                  <p className="text-slate-400 text-xs mt-1 max-w-[240px] break-words">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* State: PERMISSION DENIED */}
            {state === 'PERMISSION_DENIED' && (
              <div className="text-center space-y-3 p-6 z-10">
                <div className="w-16 h-16 bg-rose-900/40 rounded-full flex items-center justify-center mx-auto border-2 border-rose-500">
                  <WifiOff className="w-9 h-9 text-rose-400" />
                </div>
                <div>
                  <p className="text-rose-300 font-bold text-sm">Camera Permission Denied</p>
                  <p className="text-slate-400 text-xs mt-1 max-w-[240px]">
                    Please grant camera access in browser site settings and click retry.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls & Quick Scan Utilities */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {(state === 'IDLE' || state === 'PERMISSION_DENIED' || state === 'CAMERA_ERROR') && (
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Camera className="w-4 h-4" />}
                  onClick={handleStartScan}
                >
                  {state === 'IDLE' ? 'Start Camera Scanner' : 'Retry Camera Access'}
                </Button>
              )}

              {(state === 'SCANNING' || state === 'INVALID_QR') && (
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                  onClick={handleRetry}
                >
                  Stop / Retry
                </Button>
              )}

              {state === 'SUCCESS' && (
                <>
                  <Button
                    variant="outline"
                    size="md"
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                    onClick={handleRetry}
                  >
                    Scan Another
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                    onClick={handleVerifyResult}
                  >
                    Verify {scannedValue}
                  </Button>
                </>
              )}
            </div>

            {/* Decode Test Helper / Integration test bar */}
            <div className="pt-3 border-t border-slate-200">
              <form onSubmit={handleManualSubmit} className="flex gap-2">
                <Input
                  placeholder="Test QR Payload (e.g. PROD-100001)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                />
                <Button type="submit" variant="outline" size="md">
                  Decode
                </Button>
              </form>
            </div>

            {/* Architecture / Integration Notice */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <span>
                <strong>QR Library Integration:</strong> The HTML5 camera stream is live on{' '}
                <span className="font-mono text-slate-800 bg-slate-200 px-1 py-0.5 rounded">&lt;video ref=videoRef&gt;</span>.
                Integrations with <span className="font-mono text-slate-800">@zxing/browser</span> or{' '}
                <span className="font-mono text-slate-800">html5-qrcode</span> invoke{' '}
                <span className="font-mono text-slate-800">handleDecodeResult(decodedString)</span> on detection.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

