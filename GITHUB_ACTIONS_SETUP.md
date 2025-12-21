# 🚀 بناء APK تلقائياً عبر GitHub Actions

## النظرة العامة

تم إعداد **GitHub Actions Workflow** لبناء تطبيق Android APK تلقائياً في السحابة عند كل push أو تحديث PR.

## الميزات

✅ **بناء تلقائي** - عند كل push على main أو develop
✅ **بدون تثبيت محلي** - لا تحتاج Android SDK على جهازك
✅ **يدوي اختياري** - تشغيل البناء يدوياً من صفحة Actions
✅ **تحميل الملفات** - حفظ APK تلقائياً كـ artifacts
✅ **بناء Release** - عند إنشاء git tag (علامة)

---

## 📋 الملفات المنشأة

```
.github/workflows/build-apk.yml  ← ملف GitHub Actions الرئيسي
```

---

## 🎯 خطوات الإعداد

### 1️⃣ دفع المشروع إلى GitHub

```bash
cd /var/www/html/scan

# إذا لم تكن قد أنشأت repository بعد
git init
git add .
git commit -m "Initial commit: Scanner App with GitHub Actions"
git branch -M main

# ربط بـ GitHub (استبدل USERNAME/REPO بمعلوماتك)
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### 2️⃣ تفعيل GitHub Actions

1. اذهب إلى: `https://github.com/USERNAME/REPO/settings/actions`
2. تأكد من أن **Actions** مفعلة (عادةً تكون مفعلة افتراضياً)

### 3️⃣ الآن البناء سيعمل تلقائياً! 🎉

---

## 🔧 كيفية استخدام GitHub Actions

### **الطريقة 1: البناء التلقائي**
```bash
# فقط ادفع الكود
git add .
git commit -m "إضافة ميزة جديدة"
git push
```
✅ سيبني APK تلقائياً (شاهد في **Actions tab**)

### **الطريقة 2: البناء اليدوي**
1. اذهب إلى: `https://github.com/USERNAME/REPO/actions`
2. اختر **"Build Android APK"**
3. اضغط **"Run workflow"**

### **الطريقة 3: بناء Release (الإصدار الرسمي)**
```bash
# إنشاء علامة (tag) لـ release
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin v1.0.0
```
✅ سيبني Release APK تلقائياً

---

## 📥 تحميل APK

بعد انتهاء البناء:

1. اذهب إلى: `https://github.com/USERNAME/REPO/actions`
2. اختر أحدث build workflow
3. اضغط على **Artifacts** أسفل الصفحة
4. حمّل `app-debug.apk` أو `app-release.apk`

### مثال على الرابط:
```
https://github.com/USERNAME/REPO/actions/runs/WORKFLOW_ID
```

---

## 🔍 مراقبة البناء

### أثناء البناء:
- شاهد الحالة على GitHub Actions tab
- سترى logs تفصيلية لكل خطوة
- تنبيهات تلقائية عند النجاح أو الفشل

### في حالة الفشل:
- اضغط على workflow run المفشلة
- شاهد logs التفاصيل
- تحقق من الأخطاء واصلح في الكود

---

## ⚙️ تخصيص Workflow

### تغيير فروع البناء:
عدّل في `.github/workflows/build-apk.yml`:
```yaml
on:
  push:
    branches:
      - main           # ← غيّر هنا
      - develop
```

### إضافة متغيرات بيئية:
```yaml
env:
  NODE_ENV: production
  VITE_API_URL: https://api.example.com
```

### تحديد نسخة Java:
```yaml
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '21'  # ← غيّر هنا
```

---

## 🔐 أمان وأفضل الممارسات

### Secrets (للمعلومات الحساسة):
```bash
# إذا أردت استخدام API keys أو passwords
# أضفها في: Settings > Secrets > Actions
```

ثم استخدمها في workflow:
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
```

---

## 📊 معلومات عن البناء

| المعلومة | القيمة |
|---------|--------|
| **OS** | ubuntu-latest |
| **Node.js** | 20 |
| **Java** | 21 (Temurin) |
| **pnpm** | 10.4.1 |
| **Android SDK** | تثبيت تلقائي |

---

## 🚨 استكشاف الأخطاء

### "Build failed: SDK not found"
✅ **تم الحل:** android-actions/setup-android يثبت SDK تلقائياً

### "Permission denied: gradlew"
✅ **تم الحل:** `chmod +x gradlew` يعمل تلقائياً

### "Node modules not found"
✅ **تم الحل:** `pnpm install` يعمل تلقائياً

### "Vite build failed"
✅ تحقق من `package.json` و `vite.config.ts`

---

## 📚 موارد إضافية

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Android Build Actions](https://github.com/marketplace/actions/android-build)
- [Node.js Setup Action](https://github.com/marketplace/actions/setup-node-js-environment)

---

## ✅ التحقق من النجاح

بعد أول push:
```bash
✅ Workflow runs (شاهد في Actions tab)
✅ APK built successfully
✅ Artifacts uploaded
✅ جاهز للتحميل!
```

---

**الآن يمكنك بناء APK دون تثبيت محلي! 🎉**
