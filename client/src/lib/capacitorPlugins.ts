/**
 * مكتبة Capacitor للوصول إلى ميزات الهاتف الأصلية
 */

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

/**
 * التقاط صورة من الكاميرا
 */
export const capturePhoto = async (): Promise<string> => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    return image.dataUrl || '';
  } catch (error) {
    console.error('Camera capture error:', error);
    throw error;
  }
};

/**
 * اختيار صورة من المعرض
 */
export const pickPhoto = async (): Promise<string> => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });
    return image.dataUrl || '';
  } catch (error) {
    console.error('Photo picker error:', error);
    throw error;
  }
};

/**
 * حفظ الصورة في التخزين المحلي للهاتف
 */
export const savePhotoToDevice = async (
  dataUrl: string,
  fileName: string,
  folderName: string = 'Scanner'
): Promise<string> => {
  try {
    // تحويل Data URL إلى Base64
    const base64Data = dataUrl.split(',')[1];

    // إنشاء المجلد إذا لم يكن موجوداً
    try {
      await Filesystem.mkdir({
        path: folderName,
        directory: Directory.Documents,
        recursive: true,
      });
    } catch (err) {
      // المجلد قد يكون موجوداً بالفعل
    }

    // حفظ الملف
    const result = await Filesystem.writeFile({
      path: `${folderName}/${fileName}`,
      data: base64Data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });

    return result.uri;
  } catch (error) {
    console.error('Save photo error:', error);
    throw error;
  }
};

/**
 * قراءة الملفات من مجلد معين
 */
export const getFilesFromFolder = async (folderName: string) => {
  try {
    const result = await Filesystem.readdir({
      path: folderName,
      directory: Directory.Documents,
    });
    return result.files;
  } catch (error) {
    console.error('Read files error:', error);
    return [];
  }
};

/**
 * قراءة ملف صورة
 */
export const readPhotoFile = async (
  folderName: string,
  fileName: string
): Promise<string> => {
  try {
    const result = await Filesystem.readFile({
      path: `${folderName}/${fileName}`,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    return `data:image/jpeg;base64,${result.data}`;
  } catch (error) {
    console.error('Read photo error:', error);
    throw error;
  }
};

/**
 * حذف ملف
 */
export const deletePhotoFile = async (
  folderName: string,
  fileName: string
): Promise<void> => {
  try {
    await Filesystem.deleteFile({
      path: `${folderName}/${fileName}`,
      directory: Directory.Documents,
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    throw error;
  }
};

/**
 * التحقق من توفر الكاميرا
 */
export const checkCameraAvailability = async (): Promise<boolean> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      return false; // لا توجد كاميرا في الويب
    }
    // في تطبيق أصلي، الكاميرا متاحة دائماً
    return true;
  } catch {
    return false;
  }
};

/**
 * التحقق من أننا في تطبيق أصلي
 */
export const isNativeApp = (): boolean => {
  return Capacitor.isNativePlatform();
};
