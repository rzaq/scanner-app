# ✅ متطلبات بناء APK على GitHub Actions

## الملفات المضافة

### 1. **`.github/workflows/build-apk.yml`** 
   ملف GitHub Actions الأساسي لبناء APK تلقائياً

### 2. **`.github/workflows/build-release.yml`**
   ملف متقدم مع دعم Release والإشعارات

### 3. **`GITHUB_ACTIONS_SETUP.md`**
   دليل شامل للإعداد والاستخدام

### 4. **`build-and-push.sh`**
   سكريبت bash سهل لدفع التحديثات

---

## 🎯 ما تحتاج إلى فعله الآن

### الخطوة 1️⃣: إنشاء Git Repository (إذا لم تكن موجودة)

```bash
cd /var/www/html/scan

# تهيئة git (إذا لم تكن مهيأة)
git init

# إضافة كل الملفات
git add .

# أول commit
git commit -m "Initial commit: Scanner App with GitHub Actions automation"

# تسمية الفرع الرئيسي
git branch -M main
```

### الخطوة 2️⃣: إنشاء Repository على GitHub

1. اذهب إلى: https://github.com/new
2. أنشئ repository بدون README/gitignore (موجود لديك بالفعل)
3. نسخ الرابط (مثل: `https://github.com/USERNAME/scanner-app.git`)

### الخطوة 3️⃣: ربط المشروع بـ GitHub

```bash
# ربط بـ GitHub (استبدل USERNAME/REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# دفع الكود
git push -u origin main
```

### الخطوة 4️⃣: فتح GitHub Actions (اختياري)

```bash
# جعل السكريبت قابل للتنفيذ
chmod +x build-and-push.sh

# استخدام السكريبت المساعد
./build-and-push.sh
```

---

## 📋 ما يحدث تلقائياً

### عند كل push على main:
```
1. ✅ Checkout الكود
2. ✅ تثبيت Node.js و pnpm
3. ✅ تثبيت Java 21
4. ✅ تثبيت Android SDK تلقائياً
5. ✅ تثبيت المكتبات (pnpm install)
6. ✅ بناء الويب (pnpm build)
7. ✅ بناء APK Debug
8. ✅ تحميل APK كـ Artifact
```

### عند إنشاء Release:
```
+ بناء APK Release
+ تحميل على صفحة Release
+ إشعارات (اختياري)
```

---

## 🔗 روابط مهمة

بعد الدفع الأول:

| الرابط | الوصف |
|--------|------|
| `github.com/USERNAME/REPO/actions` | حالة البناء |
| `github.com/USERNAME/REPO/releases` | الإصدارات |
| `github.com/USERNAME/REPO/settings/actions` | إعدادات Actions |

---

## 🎨 الخطوات السريعة

### طريقة سريعة (شيل):
```bash
cd /var/www/html/scan
git add .
git commit -m "تحديث"
git push
# ✅ يتم البناء تلقائياً!
```

### طريقة باستخدام السكريبت:
```bash
chmod +x build-and-push.sh
./build-and-push.sh
# اختر 1 → أدخل الرسالة → دفع تلقائي
```

---

## ❌ استكشاف المشاكل

### "Repository not found"
```bash
# تأكد من الرابط صحيح
git remote -v

# تصحيح إذا لزم الأمر
git remote set-url origin https://github.com/USERNAME/REPO.git
```

### "Permission denied (publickey)"
```bash
# تحتاج SSH key، أو استخدم HTTPS مع token:
git remote set-url origin https://USERNAME:TOKEN@github.com/USERNAME/REPO.git
```

### Build fails على GitHub Actions
```
1. اذهب إلى Actions tab
2. اضغط على Workflow المفشل
3. شاهد logs تفصيلية
4. صحح الأخطاء في الكود
5. Push مرة أخرى
```

---

## 💡 نصائح إضافية

### إضافة متغيرات بيئية:
```bash
# في GitHub settings > Secrets > Actions
# ثم استخدمها في workflow:
env:
  MY_VAR: ${{ secrets.MY_VAR }}
```

### تشغيل البناء يدوياً:
```
1. اذهب إلى Actions
2. اختر Workflow
3. اضغط "Run workflow"
```

### مراقبة البناء من الويب:
```
actions/runs/WORKFLOW_ID
```

---

## ✨ الآن أنت مستعد!

```bash
✅ Workflow جاهز
✅ كل التوثيق موجود
✅ لا تحتاج SDK محلي
✅ بناء تلقائي في السحابة
```

**اتبع الخطوات الأربع أعلاه وستصبح كل شيء يعمل! 🚀**
