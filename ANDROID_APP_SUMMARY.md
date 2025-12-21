# تطبيق ماسح الصور - تطبيق Android أصلي

## نظرة عامة

تم تحويل تطبيق الويب بنجاح إلى تطبيق Android أصلي باستخدام **Capacitor**. التطبيق يتمتع بجميع الميزات الأصلية للهاتف مع الحفاظ على واجهة المستخدم الحديثة.

## المميزات الرئيسية

### 1. الكاميرا الأصلية
- التقاط الصور مباشرة من كاميرا الهاتف
- اختيار الصور من معرض الهاتف
- دعم كاميرا أمامية وخلفية

### 2. الفلاتر الفعلية
- 7 فلاتر مختلفة:
  - بدون فلتر
  - سكانر (عالي التباين)
  - كشف الحواف
  - رمادي
  - تباين عالي
  - إضاءة
  - حدة
- معالجة فورية للفلاتر
- معاينة حية قبل الحفظ

### 3. التخزين المحلي
- حفظ الصور في ذاكرة الهاتف
- دعم مجلدات متعددة
- إدارة المساحة التخزينية
- حذف آمن للصور

### 4. المعرض المتقدم
- عرض الصور حسب المجلدات
- اختيار متعدد للصور
- حذف سريع
- إعادة إرسال الصور

### 5. التصميم الحديث
- تصميم **Neo-Brutalism / Cyberpunk**
- ألوان كهربائية (أزرق، أخضر نيون)
- تأثيرات بصرية متقدمة
- واجهة سهلة الاستخدام

## الصلاحيات المطلوبة

التطبيق يطلب الصلاحيات التالية:

- **CAMERA** - للوصول إلى كاميرا الهاتف
- **READ_EXTERNAL_STORAGE** - لقراءة الصور من المعرض
- **WRITE_EXTERNAL_STORAGE** - لحفظ الصور
- **READ_MEDIA_IMAGES** - للوصول إلى معرض الصور (Android 13+)
- **INTERNET** - للاتصال بالإنترنت

## البنية التقنية

```
scanner-web-app/
├── client/                    # كود الويب (React)
│   ├── src/
│   │   ├── components/       # مكونات React
│   │   │   ├── WebCamera.tsx    # كاميرا الويب
│   │   │   └── NativeCamera.tsx # كاميرا Capacitor
│   │   ├── pages/            # الصفحات
│   │   │   ├── Home.tsx
│   │   │   ├── Editor.tsx
│   │   │   └── Gallery.tsx
│   │   ├── lib/
│   │   │   ├── imageFilters.ts  # نظام الفلاتر
│   │   │   ├── storage.ts       # التخزين المحلي
│   │   │   └── capacitorPlugins.ts # مكونات Capacitor
│   │   └── index.css         # التصميم
│   └── public/               # الأصول الثابتة
├── android/                  # كود Android الأصلي
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml  # الصلاحيات
│   │   │   └── assets/public        # أصول الويب
│   │   └── build.gradle
│   └── gradle/
├── capacitor.config.ts       # إعدادات Capacitor
└── BUILD_APK.md             # تعليمات البناء
```

## المكتبات المستخدمة

### Frontend
- **React 19** - واجهة المستخدم
- **Tailwind CSS 4** - التصميم
- **shadcn/ui** - مكونات UI
- **Wouter** - التنقل
- **Framer Motion** - الحركات

### Native
- **Capacitor 8** - جسر بين الويب والأصلي
- **@capacitor/camera** - الكاميرا
- **@capacitor/filesystem** - نظام الملفات

## خطوات البناء

### 1. المتطلبات

```bash
# Java Development Kit (JDK 11+)
java -version

# Android SDK (عبر Android Studio)
# Gradle (يتم تثبيته تلقائياً)
```

### 2. بناء ملف APK للتطوير

```bash
cd /home/ubuntu/scanner-web-app
pnpm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

الملف الناتج:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. بناء ملف APK للإصدار

```bash
cd android
./gradlew assembleRelease
```

الملف الناتج:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 4. التوقيع والتحسين

```bash
# إنشاء مفتاح التوقيع
keytool -genkey -v -keystore scanner-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias scanner

# توقيع الملف
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore scanner-key.keystore \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  scanner

# تحسين الملف
zipalign -v 4 \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  app-release.apk
```

## التثبيت على الجهاز

### عبر ADB

```bash
# تثبيت ملف Debug
adb install android/app/build/outputs/apk/debug/app-debug.apk

# تثبيت ملف Release
adb install app-release.apk
```

### عبر نقل الملف

1. انقل ملف APK إلى جهازك
2. افتح الملف من مدير الملفات
3. اضغط تثبيت

## استكشاف الأخطاء

### خطأ: Camera not accessible
- تأكد من منح صلاحية الكاميرا للتطبيق
- تحقق من وجود كاميرا على الجهاز

### خطأ: Storage permission denied
- اذهب إلى الإعدادات → التطبيقات → ماسح الصور
- امنح صلاحيات التخزين

### خطأ: Gradle build failed
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## الملفات المهمة

- **capacitor.config.ts** - إعدادات Capacitor الرئيسية
- **android/app/src/main/AndroidManifest.xml** - الصلاحيات والإعدادات
- **android/app/build.gradle** - تكوين البناء
- **BUILD_APK.md** - تعليمات البناء المفصلة

## النسخة الحالية

- **تطبيق**: ماسح الصور
- **Package ID**: com.scanner.app
- **الإصدار**: 1.0
- **الحد الأدنى للـ SDK**: Android 5.0 (API 21)
- **الهدف**: Android 14 (API 34)

## الخطوات التالية

1. **اختبار شامل** على أجهزة مختلفة
2. **تحسين الأداء** لتقليل حجم APK
3. **إضافة ميزات** مثل OCR أو المزامنة السحابية
4. **نشر على Google Play Store**

## المراجع

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com)
- [React Native Web](https://necolas.github.io/react-native-web/)

---

**ملاحظة**: التطبيق جاهز للبناء والتثبيت على أجهزة Android حقيقية.
