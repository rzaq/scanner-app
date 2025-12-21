# بناء تطبيق Android APK

## المتطلبات الأساسية

1. **Java Development Kit (JDK)** - الإصدار 11 أو أحدث
2. **Android SDK** - مثبت عبر Android Studio
3. **Gradle** - سيتم تثبيته تلقائياً

## خطوات البناء

### 1. التحقق من المتطلبات

```bash
cd /home/ubuntu/scanner-web-app
java -version
```

### 2. بناء ملف APK للتطوير

```bash
cd android
./gradlew assembleDebug
```

سيتم إنشاء الملف في:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. بناء ملف APK للإصدار (Release)

```bash
cd android
./gradlew assembleRelease
```

سيتم إنشاء الملف في:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### 4. التوقيع على ملف APK (للإصدار)

```bash
# إنشاء مفتاح توقيع (مرة واحدة فقط)
keytool -genkey -v -keystore scanner-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias scanner

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

## التثبيت على جهاز

### عبر ADB (Android Debug Bridge)

```bash
# تثبيت ملف Debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# تثبيت ملف Release APK
adb install app-release.apk
```

### عبر نقل الملف مباشرة

انقل ملف APK إلى جهازك وافتحه لتثبيته.

## استكشاف الأخطاء

### خطأ: "Gradle not found"
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### خطأ: "SDK not found"
تأكد من تثبيت Android SDK وتعيين متغير البيئة:
```bash
export ANDROID_SDK_ROOT=/path/to/android/sdk
```

### خطأ: "Java version"
استخدم Java 11 أو أحدث:
```bash
java -version
```

## الملفات الناتجة

- **app-debug.apk** - للاختبار والتطوير
- **app-release.apk** - للنشر على Google Play Store

## المزيد من المعلومات

- [Capacitor Build Guide](https://capacitorjs.com/docs/android)
- [Android Build Documentation](https://developer.android.com/build)
