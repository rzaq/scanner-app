import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Camera, 
  Image as ImageIcon, 
  Upload,
  ArrowLeft
} from 'lucide-react';
import { 
  capturePhoto, 
  pickPhoto, 
  isNativeApp 
} from '@/lib/capacitorPlugins';
import { cn } from '@/lib/utils';

interface NativeCameraProps {
  onCapture: (imageSrc: string) => void;
  onGallerySelect?: () => void;
}

export function NativeCamera({ onCapture, onGallerySelect }: NativeCameraProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(isNativeApp());
  }, []);

  const handleCapturePhoto = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const photo = await capturePhoto();
      onCapture(photo);
    } catch (err) {
      console.error('Capture error:', err);
      setError('Failed to capture photo');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickPhoto = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const photo = await pickPhoto();
      onCapture(photo);
    } catch (err) {
      console.error('Pick error:', err);
      setError('Failed to pick photo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-black overflow-hidden rounded-lg cyber-border">
      {/* Main Content Area */}
      <div className="relative flex-1 bg-gradient-to-br from-black via-blue-900/10 to-black flex flex-col items-center justify-center overflow-hidden">
        {/* Camera Overlay UI */}
        <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent">
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-lg" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-primary font-mono text-sm animate-pulse">PROCESSING...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center text-destructive">
              <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="font-mono text-sm mb-4">{error}</p>
              <Button 
                onClick={() => setError(null)}
                className="bg-accent text-accent-foreground"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Main UI */}
        <div className="text-center z-10">
          <Camera className="w-16 h-16 mx-auto mb-4 text-primary/70 animate-pulse" />
          <h2 className="text-2xl font-mono font-bold text-primary mb-2 cyber-text-glow">
            SCANNER
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {isNative ? 'Ready to scan documents' : 'Native app required'}
          </p>
          
          <div className="flex flex-col gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/80 text-black font-bold cyber-glow border-2 border-white/20 w-48"
              onClick={handleCapturePhoto}
              disabled={isLoading || !isNative}
            >
              <Camera className="w-5 h-5 mr-2" />
              TAKE PHOTO
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/20 font-bold w-48"
              onClick={handlePickPhoto}
              disabled={isLoading || !isNative}
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              CHOOSE PHOTO
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="h-24 bg-black/80 backdrop-blur-md flex items-center justify-around p-4 border-t border-primary/30">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full w-12 h-12 border-primary/50 text-primary hover:bg-primary/20"
          onClick={onGallerySelect}
        >
          <ImageIcon className="w-6 h-6" />
        </Button>

        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
          <span className="text-xs font-mono text-primary text-center">NATIVE</span>
        </div>

        <div className="w-12 h-12" />
      </div>
    </div>
  );
}
