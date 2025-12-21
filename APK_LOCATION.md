# أين هو ملف APK؟ / Where is the APK file?

## الإجابة السريعة / Quick Answer

ملف APK **غير موجود مسبقاً** ويجب بناؤه أولاً.

The APK file **does not exist** and must be built first.

---

## كيف أحصل على ملف APK؟ / How to get the APK?

### الطريقة السريعة / Quick Method

```bash
pnpm run build:apk
```

### موقع الملف بعد البناء / File Location After Build

```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## الخطوات الكاملة / Complete Steps

### 1. تثبيت المتطلبات / Install Requirements

- Java JDK 11+ (JDK 17+ recommended for modern Android Gradle Plugin versions)
- Android SDK (via Android Studio)
- Node.js & pnpm

### 2. بناء التطبيق / Build the App

```bash
# التثبيت / Install dependencies
pnpm install

# بناء APK / Build APK
pnpm run build:apk
```

### 3. موقع الملف / APK Location

**Debug APK:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK:**
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## أوامر مفيدة / Useful Commands

```bash
# بناء APK للتطوير / Build debug APK
pnpm run build:apk

# بناء APK للإصدار / Build release APK
pnpm run build:apk:release

# فتح المشروع في Android Studio / Open in Android Studio
pnpm run android:open

# مزامنة ملفات Capacitor / Sync Capacitor files
pnpm run android:sync
```

---

## لمزيد من التفاصيل / For More Details

- **[README.md](README.md)** - دليل البدء الكامل / Complete Getting Started Guide
- **[BUILD_APK.md](BUILD_APK.md)** - تعليمات البناء التفصيلية / Detailed Build Instructions
- **[ANDROID_APP_SUMMARY.md](ANDROID_APP_SUMMARY.md)** - نظرة عامة على التطبيق / App Overview

---

## تثبيت APK على الجهاز / Install APK on Device

```bash
# عبر ADB / Via ADB
adb install android/app/build/outputs/apk/debug/app-debug.apk

# أو انقل الملف إلى جهازك وافتحه / Or transfer to device and open
```
