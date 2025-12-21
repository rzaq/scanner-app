import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCw, 
  Save, 
  Share2, 
  ArrowLeft, 
  Wand2, 
  Layers, 
  Sun, 
  Contrast, 
  ScanLine,
  Trash2
} from 'lucide-react';
import { applyFilter, rotateImage, FILTER_TYPES, FILTER_NAMES, FilterType } from '@/lib/imageFilters';
import { cn } from '@/lib/utils';
import { useLocation } from 'wouter';

interface EditorProps {
  imageSrc: string;
  onBack: () => void;
  onSave: (finalImage: string) => void;
}

export function Editor({ imageSrc, onBack, onSave }: EditorProps) {
  const [currentImage, setCurrentImage] = useState<string>(imageSrc);
  const [originalImage, setOriginalImage] = useState<string>(imageSrc);
  const [activeFilter, setActiveFilter] = useState<FilterType>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Reset when imageSrc changes
  useEffect(() => {
    setCurrentImage(imageSrc);
    setOriginalImage(imageSrc);
    setActiveFilter('none');
    setRotation(0);
  }, [imageSrc]);

  const handleFilterChange = async (filter: FilterType) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setActiveFilter(filter);
    
    try {
      // Always apply filter to the rotated original image to avoid quality loss
      // In a real app, we might want to chain operations more efficiently
      let baseImage = originalImage;
      if (rotation !== 0) {
        baseImage = await rotateImage(originalImage, rotation);
      }
      
      const filtered = await applyFilter(baseImage, filter);
      setCurrentImage(filtered);
    } catch (error) {
      console.error('Filter error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRotate = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      const newRotation = (rotation + 90) % 360;
      setRotation(newRotation);
      
      const rotated = await rotateImage(originalImage, newRotation);
      
      // Re-apply current filter
      const filtered = await applyFilter(rotated, activeFilter);
      setCurrentImage(filtered);
    } catch (error) {
      console.error('Rotation error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const filterIcons: Record<FilterType, React.ReactNode> = {
    none: <Layers className="w-5 h-5" />,
    scanner: <ScanLine className="w-5 h-5" />,
    edges: <Wand2 className="w-5 h-5" />,
    grayscale: <div className="w-5 h-5 rounded-full bg-gradient-to-r from-gray-900 to-gray-100 border border-gray-500" />,
    contrast: <Contrast className="w-5 h-5" />,
    brightness: <Sun className="w-5 h-5" />,
    sharpness: <div className="w-5 h-5 border-2 border-current flex items-center justify-center text-[10px] font-bold">HD</div>,
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-lg font-mono font-bold tracking-wider text-primary cyber-text-glow">EDITOR</h2>
        <Button 
          variant="default" 
          size="sm" 
          className="bg-accent text-accent-foreground hover:bg-accent/80 font-bold"
          onClick={() => onSave(currentImage)}
        >
          <Save className="w-4 h-4 mr-2" />
          SAVE
        </Button>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden bg-black/50">
        {isProcessing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-primary font-mono text-sm animate-pulse">PROCESSING...</span>
            </div>
          </div>
        )}
        
        <img 
          src={currentImage} 
          alt="Edited" 
          className="max-w-full max-h-full object-contain shadow-2xl border border-border/30"
        />
      </div>

      {/* Tools Panel */}
      <div className="bg-card border-t border-border p-4 space-y-4">
        {/* Actions */}
        <div className="flex justify-center gap-4 mb-2">
          <Button variant="outline" size="sm" onClick={handleRotate} disabled={isProcessing}>
            <RotateCw className="w-4 h-4 mr-2" />
            Rotate
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={onBack}>
            <Trash2 className="w-4 h-4 mr-2" />
            Discard
          </Button>
        </div>

        {/* Filters Scroll */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Filters</label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {Object.entries(FILTER_TYPES).map(([key, type]) => (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                disabled={isProcessing}
                className={cn(
                  "flex flex-col items-center gap-2 min-w-[70px] p-2 rounded-lg border transition-all duration-200",
                  activeFilter === type 
                    ? "bg-primary/10 border-primary text-primary cyber-glow" 
                    : "bg-muted/30 border-transparent hover:bg-muted/50 text-muted-foreground"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full bg-background/50",
                  activeFilter === type ? "text-primary" : "text-foreground"
                )}>
                  {filterIcons[type]}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase">{FILTER_NAMES[type]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
