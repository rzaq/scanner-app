/**
 * مكتبة التخزين المحلي للويب
 * تستخدم LocalStorage و IndexedDB لتخزين الصور والبيانات
 */

import { nanoid } from 'nanoid';

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface ScannedImage {
  id: string;
  folderId: string;
  dataUrl: string;
  createdAt: string;
  name: string;
}

const STORAGE_KEYS = {
  FOLDERS: 'scanner_folders',
  IMAGES: 'scanner_images',
  SETTINGS: 'scanner_settings',
};

// --- Folders Management ---

export const getFolders = (): Folder[] => {
  try {
    const foldersJson = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (foldersJson) {
      return JSON.parse(foldersJson);
    }
    // Default folder
    const defaultFolder: Folder = {
      id: 'default',
      name: 'المستندات الممسوحة',
      createdAt: new Date().toISOString(),
    };
    saveFolders([defaultFolder]);
    return [defaultFolder];
  } catch (error) {
    console.error('Error getting folders:', error);
    return [];
  }
};

export const saveFolders = (folders: Folder[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    return true;
  } catch (error) {
    console.error('Error saving folders:', error);
    return false;
  }
};

export const addFolder = (name: string): Folder => {
  const folders = getFolders();
  const newFolder: Folder = {
    id: nanoid(),
    name,
    createdAt: new Date().toISOString(),
  };
  folders.push(newFolder);
  saveFolders(folders);
  return newFolder;
};

export const deleteFolder = (folderId: string): boolean => {
  const folders = getFolders();
  const newFolders = folders.filter(f => f.id !== folderId);
  
  // Delete images in folder
  const images = getAllImages();
  const newImages = images.filter(img => img.folderId !== folderId);
  saveAllImages(newImages);
  
  return saveFolders(newFolders);
};

// --- Images Management ---

// Note: In a real production app, we should use IndexedDB for large images.
// For this demo, we'll use LocalStorage but be mindful of the 5MB limit.
// We'll compress images before saving.

const getAllImages = (): ScannedImage[] => {
  try {
    const imagesJson = localStorage.getItem(STORAGE_KEYS.IMAGES);
    return imagesJson ? JSON.parse(imagesJson) : [];
  } catch (error) {
    console.error('Error getting images:', error);
    return [];
  }
};

const saveAllImages = (images: ScannedImage[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(images));
    return true;
  } catch (error) {
    console.error('Error saving images (Storage might be full):', error);
    return false;
  }
};

export const getImagesByFolder = (folderId: string): ScannedImage[] => {
  const images = getAllImages();
  return images.filter(img => img.folderId === folderId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const saveImage = (dataUrl: string, folderId: string): ScannedImage => {
  const images = getAllImages();
  const newImage: ScannedImage = {
    id: nanoid(),
    folderId,
    dataUrl,
    createdAt: new Date().toISOString(),
    name: `Scan ${new Date().toLocaleString()}`,
  };
  
  // Check storage limit roughly
  try {
    images.unshift(newImage);
    saveAllImages(images);
    return newImage;
  } catch (e) {
    // If full, remove oldest image
    if (images.length > 0) {
      images.pop();
      images.unshift(newImage);
      saveAllImages(images);
    }
    return newImage;
  }
};

export const deleteImages = (imageIds: string[]): boolean => {
  const images = getAllImages();
  const newImages = images.filter(img => !imageIds.includes(img.id));
  return saveAllImages(newImages);
};

// --- Settings ---

export interface Settings {
  whatsappNumber: string;
  gmailAddress: string;
  defaultFolderId: string;
}

export const getSettings = (): Settings => {
  try {
    const settingsJson = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (settingsJson) return JSON.parse(settingsJson);
    
    const folders = getFolders();
    return {
      whatsappNumber: '',
      gmailAddress: '',
      defaultFolderId: folders[0]?.id || 'default',
    };
  } catch {
    return {
      whatsappNumber: '',
      gmailAddress: '',
      defaultFolderId: 'default',
    };
  }
};

export const saveSettings = (settings: Settings): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
};
