/**
 * مكتبة فلاتر الصور للويب
 * تستخدم Canvas API لمعالجة الصور مباشرة في المتصفح
 */

export type FilterType = 'none' | 'scanner' | 'edges' | 'grayscale' | 'contrast' | 'brightness' | 'sharpness';

export const FILTER_TYPES: Record<string, FilterType> = {
  NONE: 'none',
  SCANNER: 'scanner',
  EDGES: 'edges',
  GRAYSCALE: 'grayscale',
  CONTRAST: 'contrast',
  BRIGHTNESS: 'brightness',
  SHARPNESS: 'sharpness',
};

export const FILTER_NAMES: Record<FilterType, string> = {
  none: 'بدون فلتر',
  scanner: 'سكانر',
  edges: 'كشف الحواف',
  grayscale: 'رمادي',
  contrast: 'تباين عالي',
  brightness: 'إضاءة',
  sharpness: 'حدة',
};

/**
 * تطبيق الفلتر على الصورة
 * @param imageElement عنصر الصورة أو رابط الصورة
 * @param filterType نوع الفلتر
 * @returns رابط الصورة المعالجة (Data URL)
 */
export const applyFilter = async (imageSource: string | HTMLImageElement, filterType: FilterType): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      // رسم الصورة الأصلية
      ctx.drawImage(img, 0, 0);
      
      // الحصول على بيانات البكسل
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // تطبيق الفلتر
      switch (filterType) {
        case 'grayscale':
          applyGrayscale(data);
          break;
        case 'contrast':
          applyContrast(data, 50);
          break;
        case 'brightness':
          applyBrightness(data, 40);
          break;
        case 'scanner':
          applyScanner(data);
          break;
        case 'edges':
          // Edge detection requires convolution, handled separately
          const edgeData = applyEdgeDetection(ctx, canvas.width, canvas.height);
          if (edgeData) {
            ctx.putImageData(edgeData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
            return;
          }
          break;
        case 'sharpness':
          const sharpData = applySharpen(ctx, canvas.width, canvas.height);
          if (sharpData) {
            ctx.putImageData(sharpData, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
            return;
          }
          break;
        case 'none':
        default:
          break;
      }
      
      if (filterType !== 'edges' && filterType !== 'sharpness') {
        ctx.putImageData(imageData, 0, 0);
      }
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = (err) => reject(err);
    
    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = imageSource.src;
    }
  });
};

// --- Filter Implementations ---

function applyGrayscale(data: Uint8ClampedArray) {
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
  }
}

function applyBrightness(data: Uint8ClampedArray, adjustment: number) {
  for (let i = 0; i < data.length; i += 4) {
    data[i] += adjustment;
    data[i + 1] += adjustment;
    data[i + 2] += adjustment;
  }
}

function applyContrast(data: Uint8ClampedArray, contrast: number) {
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }
}

function applyScanner(data: Uint8ClampedArray) {
  // Scanner effect: High contrast + Grayscale + Slight brightness
  applyGrayscale(data);
  applyContrast(data, 60);
  applyBrightness(data, 10);
}

function applyConvolution(ctx: CanvasRenderingContext2D, width: number, height: number, kernel: number[]) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const side = Math.round(Math.sqrt(kernel.length));
  const halfSide = Math.floor(side / 2);
  const output = ctx.createImageData(width, height);
  const dst = output.data;
  
  // Fill alpha channel
  for (let i = 0; i < dst.length; i += 4) {
    dst[i + 3] = 255;
  }
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dstOff = (y * width + x) * 4;
      let r = 0, g = 0, b = 0;
      
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;
          
          if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
            const srcOff = (scy * width + scx) * 4;
            const wt = kernel[cy * side + cx];
            r += data[srcOff] * wt;
            g += data[srcOff + 1] * wt;
            b += data[srcOff + 2] * wt;
          }
        }
      }
      
      dst[dstOff] = r;
      dst[dstOff + 1] = g;
      dst[dstOff + 2] = b;
    }
  }
  
  return output;
}

function applyEdgeDetection(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Sobel operator kernel approximation
  const kernel = [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1
  ];
  
  // First convert to grayscale for better edge detection
  const imageData = ctx.getImageData(0, 0, width, height);
  applyGrayscale(imageData.data);
  ctx.putImageData(imageData, 0, 0);
  
  return applyConvolution(ctx, width, height, kernel);
}

function applySharpen(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const kernel = [
    0, -1,  0,
    -1,  5, -1,
    0, -1,  0
  ];
  return applyConvolution(ctx, width, height, kernel);
}

/**
 * تدوير الصورة
 */
export const rotateImage = async (imageSource: string, degrees: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Swap width/height for 90/270 degrees
      if (degrees % 180 !== 0) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = (err) => reject(err);
    img.src = imageSource;
  });
};
