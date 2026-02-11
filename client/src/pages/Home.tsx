import React, { useState, useEffect } from 'react';
import { WebCamera } from '@/components/WebCamera';
import { Editor } from '@/pages/Editor';
import { Gallery } from '@/pages/Gallery';
import { saveImage, getFolders } from '@/lib/storage';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Upload, Image as ImageIcon } from 'lucide-react';

type AppState = 'camera' | 'editor' | 'gallery' | 'upload';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraAvailable, setIsCameraAvailable] = useState(false);

  useEffect(() => {
    // Check if camera is available
    checkCamera();
  }, []);

  const checkCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      setIsCameraAvailable(hasCamera);
      if (hasCamera) {
        setAppState('camera');
      }
    } catch (error) {
      console.error('Camera check error:', error);
      setIsCameraAvailable(false);
    }
  };

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setAppState('editor');
  };

  const handleSave = (finalImage: string) => {
    const folders = getFolders();
    const defaultFolderId = folders[0]?.id || 'default';
    
    saveImage(finalImage, defaultFolderId);
    toast.success('Image saved successfully');
    setAppState('gallery');
  };

  const handleGallerySelect = (imageSrc: string) => {
    setCapturedImage(imageSrc);
    setAppState('editor');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setCapturedImage(imageSrc);
        setAppState('editor');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col">
      {appState === 'upload' && !isCameraAvailable && (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-black via-blue-900/10 to-black">
          <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-lg" />
          </div>

          <div className="text-center z-10">
            <h1 className="text-3xl font-bold text-primary mb-6 cyber-text-glow">مرحبا</h1>
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-primary/70 animate-pulse" />
            <h2 className="text-2xl font-mono font-bold text-primary mb-2 cyber-text-glow">SCANNER</h2>
            <p className="text-sm text-muted-foreground mb-8">Upload an image to get started</p>
            
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/80 text-black font-bold cyber-glow border-2 border-white/20"
                asChild
              >
                <span>
                  <Upload className="w-5 h-5 mr-2" />
                  UPLOAD IMAGE
                </span>
              </Button>
            </label>

            <Button 
              variant="outline" 
              size="lg" 
              className="mt-4 border-primary/50 text-primary hover:bg-primary/20"
              onClick={() => setAppState('gallery')}
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              OPEN GALLERY
            </Button>
          </div>
        </div>
      )}

      {appState === 'camera' && isCameraAvailable && (
        <WebCamera 
          onCapture={handleCapture} 
          onGallerySelect={() => setAppState('gallery')} 
        />
      )}

      {appState === 'editor' && capturedImage && (
        <Editor 
          imageSrc={capturedImage} 
          onBack={() => setAppState(isCameraAvailable ? 'camera' : 'upload')} 
          onSave={handleSave} 
        />
      )}

      {appState === 'gallery' && (
        <Gallery 
          onBack={() => setAppState(isCameraAvailable ? 'camera' : 'upload')} 
          onSelectImage={handleGallerySelect} 
        />
      )}
    </div>
  );
}
