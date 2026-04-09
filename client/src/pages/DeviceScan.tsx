import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ScanLine, Upload, Check, X, Loader2 } from 'lucide-react';
import { applyFilter } from '@/lib/imageFilters';
import { saveImage, getFolders } from '@/lib/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DeviceScanProps {
  onBack: () => void;
  onComplete: () => void;
}

interface ScanFile {
  id: string;
  name: string;
  originalSrc: string;
  processedSrc: string | null;
  status: 'pending' | 'scanning' | 'done' | 'error';
}

export function DeviceScan({ onBack, onComplete }: DeviceScanProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<ScanFile[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [phase, setPhase] = useState<'select' | 'scanning' | 'done'>('select');
  const objectUrlsRef = useRef<string[]>([]);

  // Revoke all object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selected = event.target.files;
      if (!selected || selected.length === 0) return;

      // Revoke previous object URLs before creating new ones
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];

      const newFiles: ScanFile[] = Array.from(selected).map((file, i) => {
        const url = URL.createObjectURL(file);
        objectUrlsRef.current.push(url);
        return {
          id: `${Date.now()}-${i}`,
          name: file.name,
          originalSrc: url,
          processedSrc: null,
          status: 'pending',
        };
      });

      setFiles(newFiles);
      setPhase('select');
      setScanProgress(0);

      // Reset file input so the same files can be re-selected
      event.target.value = '';
    },
    []
  );

  const startScan = useCallback(async () => {
    if (files.length === 0) return;

    setIsScanning(true);
    setPhase('scanning');

    const folders = getFolders();
    const defaultFolderId = folders[0]?.id || 'default';

    const updated = [...files];

    for (let i = 0; i < updated.length; i++) {
      // Mark current file as scanning (single update per iteration start)
      updated[i] = { ...updated[i], status: 'scanning' };
      setFiles([...updated]);

      try {
        const processed = await applyFilter(updated[i].originalSrc, 'scanner');
        saveImage(processed, defaultFolderId);
        // Update status and processedSrc together in one state update
        updated[i] = { ...updated[i], status: 'done', processedSrc: processed };
      } catch {
        updated[i] = { ...updated[i], status: 'error' };
      }

      setFiles([...updated]);
      setScanProgress(Math.round(((i + 1) / updated.length) * 100));
    }

    setIsScanning(false);
    setPhase('done');

    const doneCount = updated.filter((f) => f.status === 'done').length;
    toast.success(`تم مسح ${doneCount} صورة وحفظها في المعرض`);
  }, [files]);

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.originalSrc);
      return prev.filter((f) => f.id !== id);
    });
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} disabled={isScanning}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-lg font-mono font-bold tracking-wider text-primary cyber-text-glow">
          افحص جهازي
        </h2>
        <div className="w-10" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {phase === 'select' && files.length === 0 && (
          /* Empty state – pick files */
          <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/40 rounded-full flex items-center justify-center">
                <ScanLine className="w-10 h-10 text-primary animate-pulse" />
              </div>
              {/* Rotating ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-mono font-bold text-primary mb-2 cyber-text-glow">
                افحص جهازي
              </h3>
              <p className="text-sm text-muted-foreground">
                اختر الصور من جهازك لمسحها ضوئياً وحفظها
              </p>
            </div>

            <Button
              size="lg"
              className="bg-primary hover:bg-primary/80 text-black font-bold cyber-glow border-2 border-white/20"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5 mr-2" />
              اختر الصور
            </Button>
          </div>
        )}

        {(phase === 'select' || phase === 'scanning' || phase === 'done') &&
          files.length > 0 && (
            <div className="p-4 space-y-4">
              {/* Progress bar (visible while scanning) */}
              {phase === 'scanning' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-muted-foreground">
                    <span>جارٍ المسح الضوئي...</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 cyber-glow"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {phase === 'done' && (
                <div className="flex items-center gap-2 text-accent font-mono text-sm">
                  <Check className="w-5 h-5" />
                  <span>اكتمل المسح – {files.filter((f) => f.status === 'done').length} صورة محفوظة</span>
                </div>
              )}

              {/* File grid */}
              <div className="grid grid-cols-3 gap-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={cn(
                      'aspect-square relative rounded-lg overflow-hidden border',
                      file.status === 'done'
                        ? 'border-accent'
                        : file.status === 'error'
                          ? 'border-destructive'
                          : file.status === 'scanning'
                            ? 'border-primary'
                            : 'border-border'
                    )}
                  >
                    <img
                      src={file.processedSrc ?? file.originalSrc}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Scanning animation overlay */}
                    {file.status === 'scanning' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        <div className="scan-line" />
                      </div>
                    )}

                    {/* Done badge */}
                    {file.status === 'done' && (
                      <div className="absolute top-1 right-1 bg-accent rounded-full p-0.5">
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}

                    {/* Error badge */}
                    {file.status === 'error' && (
                      <div className="absolute top-1 right-1 bg-destructive rounded-full p-0.5">
                        <X className="w-3 h-3 text-white" />
                      </div>
                    )}

                    {/* Remove button (only before scan starts) */}
                    {phase === 'select' && (
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 hover:bg-destructive transition-colors"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    )}

                    {/* File name */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                      <p className="text-[9px] text-white font-mono truncate">{file.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Footer actions */}
      <div className="shrink-0 border-t border-border bg-card/50 backdrop-blur-sm p-4 space-y-2">
        {phase === 'select' && files.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              إضافة المزيد
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/80 text-black font-bold cyber-glow"
              onClick={startScan}
            >
              <ScanLine className="w-4 h-4 mr-2" />
              ابدأ المسح ({files.length})
            </Button>
          </div>
        )}

        {phase === 'scanning' && (
          <Button className="w-full" disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            جارٍ المسح...
          </Button>
        )}

        {phase === 'done' && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 border-primary/50 text-primary hover:bg-primary/10"
              onClick={() => {
                setFiles([]);
                setPhase('select');
                setScanProgress(0);
              }}
            >
              مسح جديد
            </Button>
            <Button
              className="flex-1 bg-accent hover:bg-accent/80 text-black font-bold"
              onClick={onComplete}
            >
              <Check className="w-4 h-4 mr-2" />
              عرض المعرض
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
