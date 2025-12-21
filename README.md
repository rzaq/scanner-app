# تطبيق ماسح الصور - Scanner App

تطبيق أندرويد أصلي لمسح الصور والمستندات مع فلاتر متقدمة وواجهة مستخدم عصرية.

## 📱 أين هو ملف APK؟

ملف APK **غير موجود مسبقاً** في المشروع. يجب عليك **بناء التطبيق** أولاً لإنشاء ملف APK.

### موقع ملف APK بعد البناء

بعد بناء التطبيق، ستجد ملف APK في أحد المواقع التالية:

#### ملف التطوير (Debug APK)
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### ملف الإصدار (Release APK)
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## 🚀 كيفية بناء ملف APK

### المتطلبات الأساسية

1. **Java Development Kit (JDK)** - الإصدار 11 أو أحدث
2. **Android SDK** - مثبت عبر Android Studio
3. **Node.js & pnpm** - لبناء تطبيق الويب

### الطريقة السريعة (خطوة واحدة)

```bash
# بناء ملف APK للتطوير
pnpm run build:apk

# بناء ملف APK للإصدار
pnpm run build:apk:release
```

### الطريقة التفصيلية

#### 1. بناء تطبيق الويب
```bash
pnpm install
pnpm run build
```

#### 2. مزامنة ملفات Capacitor
```bash
npx cap sync android
```

#### 3. بناء ملف APK
```bash
cd android
./gradlew assembleDebug
```

سيتم إنشاء الملف في:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## 📦 التثبيت على الجهاز

### عبر ADB (Android Debug Bridge)
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### عبر نقل الملف
1. انقل ملف APK إلى جهازك الأندرويد
2. افتح الملف من مدير الملفات
3. اضغط على "تثبيت" (قد تحتاج إلى السماح بتثبيت التطبيقات من مصادر غير معروفة)

## 📖 الوثائق التفصيلية

- **[BUILD_APK.md](BUILD_APK.md)** - دليل شامل لبناء ملف APK مع تفاصيل التوقيع والتحسين
- **[ANDROID_APP_SUMMARY.md](ANDROID_APP_SUMMARY.md)** - نظرة عامة على بنية التطبيق والميزات

## ✨ مميزات التطبيق

- 📸 التقاط الصور عبر الكاميرا الأصلية
- 🎨 7 فلاتر مختلفة (سكانر، كشف حواف، رمادي، وأكثر)
- 💾 التخزين المحلي للصور
- 🖼️ معرض صور مع إدارة المجلدات
- 🎯 تصميم Neo-Brutalism عصري

## 🛠️ البنية التقنية

- **React 19** - واجهة المستخدم
- **Capacitor 8** - جسر الويب والأندرويد
- **Tailwind CSS 4** - التصميم
- **Vite** - أداة البناء

## 🔧 استكشاف الأخطاء

### خطأ: Java not found
```bash
# تحقق من تثبيت Java
java -version

# يجب أن يكون الإصدار 11 أو أحدث
```

### خطأ: Android SDK not found
```bash
# تأكد من تعيين متغير البيئة
export ANDROID_SDK_ROOT=/path/to/android/sdk
```

### خطأ: Gradle build failed
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## 📄 الترخيص

MIT License

## 📞 الدعم

للمزيد من المعلومات، راجع الملفات التالية:
- [BUILD_APK.md](BUILD_APK.md) - تعليمات البناء الكاملة
- [ANDROID_APP_SUMMARY.md](ANDROID_APP_SUMMARY.md) - وصف التطبيق الكامل
