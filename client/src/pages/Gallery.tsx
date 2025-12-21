import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Share2, 
  ArrowLeft, 
  Check, 
  FolderPlus,
  MoreVertical,
  Image as ImageIcon
} from 'lucide-react';
import { 
  getFolders, 
  getImagesByFolder, 
  deleteImages, 
  addFolder, 
  deleteFolder,
  Folder, 
  ScannedImage 
} from '@/lib/storage';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface GalleryProps {
  onBack: () => void;
  onSelectImage: (imageSrc: string) => void;
}

export function Gallery({ onBack, onSelectImage }: GalleryProps) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string>('');
  const [images, setImages] = useState<ScannedImage[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    if (activeFolderId) {
      loadImages(activeFolderId);
    }
  }, [activeFolderId]);

  const loadFolders = () => {
    const loadedFolders = getFolders();
    setFolders(loadedFolders);
    if (!activeFolderId && loadedFolders.length > 0) {
      setActiveFolderId(loadedFolders[0].id);
    }
  };

  const loadImages = (folderId: string) => {
    const loadedImages = getImagesByFolder(folderId);
    setImages(loadedImages);
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    addFolder(newFolderName);
    setNewFolderName('');
    setIsNewFolderOpen(false);
    loadFolders();
    toast.success('Folder created');
  };

  const handleDeleteFolder = (folderId: string) => {
    if (folders.length <= 1) {
      toast.error('Cannot delete the last folder');
      return;
    }
    deleteFolder(folderId);
    loadFolders();
    setActiveFolderId(folders[0].id);
    toast.success('Folder deleted');
  };

  const toggleSelection = (imageId: string) => {
    if (selectedImageIds.includes(imageId)) {
      setSelectedImageIds(prev => prev.filter(id => id !== imageId));
    } else {
      setSelectedImageIds(prev => [...prev, imageId]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedImageIds.length === 0) return;
    deleteImages(selectedImageIds);
    setSelectedImageIds([]);
    setIsSelectionMode(false);
    loadImages(activeFolderId);
    toast.success('Images deleted');
  };

  const handleShareSelected = () => {
    // In a real web app, we would use Web Share API
    // For now, we'll just show a toast
    if (navigator.share && selectedImageIds.length === 1) {
      const img = images.find(i => i.id === selectedImageIds[0]);
      if (img) {
        fetch(img.dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'scan.jpg', { type: 'image/jpeg' });
            navigator.share({
              files: [file],
              title: 'Scanned Image',
            });
          });
      }
    } else {
      toast.info(`Sharing ${selectedImageIds.length} images (Simulated)`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-lg font-mono font-bold tracking-wider text-primary cyber-text-glow">GALLERY</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {isSelectionMode ? (
            <>
              <span className="text-xs font-mono text-muted-foreground mr-2">{selectedImageIds.length} SELECTED</span>
              <Button variant="destructive" size="icon" onClick={handleDeleteSelected} disabled={selectedImageIds.length === 0}>
                <Trash2 className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShareSelected} disabled={selectedImageIds.length === 0}>
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setIsSelectionMode(false); setSelectedImageIds([]); }}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsSelectionMode(true)}>
              Select
            </Button>
          )}
        </div>
      </div>

      {/* Folders Bar */}
      <div className="h-14 border-b border-border flex items-center px-4 gap-2 overflow-x-auto scrollbar-hide bg-muted/20">
        <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 rounded-full border-dashed border-primary/50 text-primary hover:bg-primary/10">
              <FolderPlus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-primary/20">
            <DialogHeader>
              <DialogTitle className="font-mono text-primary">NEW FOLDER</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Input 
                value={newFolderName} 
                onChange={(e) => setNewFolderName(e.target.value)} 
                placeholder="Folder Name"
                className="bg-background border-border"
              />
              <Button onClick={handleCreateFolder}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>

        {folders.map(folder => (
          <div key={folder.id} className="relative group shrink-0">
            <button
              onClick={() => setActiveFolderId(folder.id)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-mono transition-all border",
                activeFolderId === folder.id
                  ? "bg-primary text-primary-foreground border-primary font-bold cyber-glow"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50"
              )}
            >
              {folder.name}
            </button>
            {activeFolderId === folder.id && folders.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleDeleteFolder(folder.id)} className="text-destructive">
                    Delete Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        {images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <ImageIcon className="w-16 h-16 mb-4" />
            <p className="font-mono">NO IMAGES FOUND</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {images.map(image => (
              <div 
                key={image.id} 
                className={cn(
                  "aspect-square relative rounded-lg overflow-hidden border cursor-pointer group",
                  selectedImageIds.includes(image.id) 
                    ? "border-primary ring-2 ring-primary/50" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => {
                  if (isSelectionMode) {
                    toggleSelection(image.id);
                  } else {
                    onSelectImage(image.dataUrl);
                  }
                }}
              >
                <img src={image.dataUrl} alt="Scan" className="w-full h-full object-cover" />
                
                {isSelectionMode && (
                  <div className={cn(
                    "absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedImageIds.includes(image.id)
                      ? "bg-primary border-primary text-black"
                      : "bg-black/50 border-white text-transparent"
                  )}>
                    <Check className="w-4 h-4" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-[10px] text-white font-mono truncate text-center">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
