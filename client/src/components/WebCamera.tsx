import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, Image as ImageIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebCameraProps {
  onCapture: (imageSrc: string) => void;
  onGallerySelect?: () => void;
}

export function WebCamera({ onCapture, onGallerySelect }: WebCameraProps) {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);

  useEffect(() => {
    // Check if camera is available on mount
    checkCameraAvailability();
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      setCameraAvailable(hasCamera);
    } catch (error) {
      console.error('Error checking camera availability:', error);
      setCameraAvailable(false);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
  }, [webcamRef, onCapture]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        onCapture(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  // Fallback UI when camera is not available
  if (!cameraAvailable) {
    return (
      <div className="relative w-full h-full flex flex-col bg-black overflow-hidden rounded-lg cyber-border">
        <div className="relative flex-1 bg-gradient-to-br from-black via-blue-900/10 to-black flex flex-col items-center justify-center overflow-hidden">
          {/* Camera Overlay UI */}
          <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-lg" />
          </div>

          <div className="text-center z-10">
            <Camera className="w-16 h-16 mx-auto mb-4 text-primary/50 animate-pulse" />
            <h2 className="text-xl font-mono font-bold text-primary mb-2 cyber-text-glow">NO CAMERA DETECTED</h2>
            <p className="text-sm text-muted-foreground mb-6">Upload an image to get started</p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/80 text-black font-bold cyber-glow border-2 border-white/20"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5 mr-2" />
              UPLOAD IMAGE
            </Button>
          </div>
        </div>

        <div className="h-24 bg-black/80 backdrop-blur-md flex items-center justify-around p-4 border-t border-primary/30">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full w-12 h-12 border-primary/50 text-primary hover:bg-primary/20"
            onClick={onGallerySelect}
          >
            <ImageIcon className="w-6 h-6" />
          </Button>

          <Button 
            variant="default" 
            size="icon" 
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/80 text-black cyber-glow border-4 border-white/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-8 h-8" />
          </Button>

          <div className="w-12 h-12" />
        </div>

        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          onChange={handleFileUpload} 
          className="hidden" 
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col bg-black overflow-hidden rounded-lg cyber-border">
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {!isCameraReady && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center text-primary animate-pulse">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="font-mono text-sm">جاري تشغيل الكاميرا...</p>
            </div>
          </div>
        )}

        {cameraError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
            <div className="text-center text-destructive">
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-mono text-sm mb-4">{cameraError}</p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-accent text-accent-foreground"
              >
                Upload Image Instead
              </Button>
            </div>
          </div>
        )}
        
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
          onUserMedia={() => {
            setIsCameraReady(true);
            setCameraError(null);
          }}
          onUserMediaError={(err: any) => {
            console.error('Camera error:', err);
            setCameraError('Camera not accessible. Use upload instead.');
            setIsCameraReady(false);
          }}
        />
        
        {/* Scan Line Effect */}
        <div className="scan-line" />
        
        {/* Camera Overlay UI */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-lg" />
        </div>
      </div>

      <div className="h-24 bg-black/80 backdrop-blur-md flex items-center justify-around p-4 border-t border-primary/30">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-12 h-12 border-primary/50 text-primary hover:bg-primary/20"
          onClick={onGallerySelect}
        >
          <ImageIcon className="w-6 h-6" />
        </Button>

        <Button 
          variant="default" 
          size="icon" 
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/80 text-black cyber-glow border-4 border-white/20"
          onClick={capture}
          disabled={!isCameraReady || !!cameraError}
        >
          <Camera className="w-8 h-8" />
        </Button>

        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-12 h-12 border-primary/50 text-primary hover:bg-primary/20"
          onClick={toggleCamera}
          disabled={!isCameraReady || !!cameraError}
        >
          <RefreshCw className="w-6 h-6" />
        </Button>
      </div>

      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload} 
        className="hidden" 
      />
    </div>
  );
}
