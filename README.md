# تطبيق ماسح الصور (Scanner App)

تطبيق ويب حديث لمسح ومعالجة الصور مع دعم Android الأصلي عبر Capacitor.

## 🚀 البداية السريعة

### تشغيل التطبيق في وضع التطوير

```bash
pnpm install
pnpm dev
```

### بناء التطبيق للويب

```bash
pnpm build
```

## 📱 كيفية تحويل التطبيق إلى APK

### المتطلبات الأساسية

قبل بناء ملف APK، تأكد من تثبيت:

1. **Java Development Kit (JDK)** - الإصدار 11 أو أحدث
   ```bash
   java -version
   ```

2. **Android SDK** - يمكن تثبيته عبر [Android Studio](https://developer.android.com/studio)

### الطريقة السريعة ⚡

#### بناء APK للتطوير والاختبار

```bash
pnpm run build:apk
```

ملف APK سيكون في:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### بناء APK للإصدار النهائي

```bash
pnpm run build:apk:release
```

ملف APK سيكون في:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

### الأوامر المتاحة

| الأمر | الوصف |
|-------|-------|
| `pnpm run build:apk` | بناء APK للتطوير (كل الخطوات تلقائياً) |
| `pnpm run build:apk:release` | بناء APK للإصدار (كل الخطوات تلقائياً) |
| `pnpm run cap:sync` | مزامنة الملفات مع Android |
| `pnpm run android:build` | بناء APK للتطوير فقط |
| `pnpm run android:release` | بناء APK للإصدار فقط |

### التثبيت على الجهاز

#### عبر USB (ADB)

```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### عبر نقل الملف مباشرة

1. انقل ملف APK إلى جهازك
2. افتح الملف من مدير الملفات
3. اضغط "تثبيت"

## 🛠️ التقنيات المستخدمة

- **React 19** - واجهة المستخدم
- **TypeScript** - لغة البرمجة
- **Vite** - أداة البناء
- **Tailwind CSS 4** - التصميم
- **Capacitor 8** - التحويل إلى تطبيق أصلي
- **Express** - خادم Node.js

## 📚 المزيد من الوثائق

- [BUILD_APK.md](./BUILD_APK.md) - تعليمات مفصلة لبناء APK
- [ANDROID_APP_SUMMARY.md](./ANDROID_APP_SUMMARY.md) - ملخص التطبيق الأصلي

## 🔧 استكشاف الأخطاء

### خطأ: "Gradle not found"

```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### خطأ: "SDK not found"

تأكد من تعيين متغير البيئة:
```bash
export ANDROID_SDK_ROOT=/path/to/android/sdk
```

### خطأ: "Java version"

استخدم Java 11 أو أحدث:
```bash
java -version
```

## 📄 الرخصة

MIT License

## 🤝 المساهمة

المساهمات مرحب بها! افتح Issue أو Pull Request.
