# 🔄 دليل كامل: بناء APK تلقائياً على GitHub Actions

## المقدمة

بدلاً من تثبيت Android SDK محلياً (1.5GB+ وتعقيدات)، يمكنك الآن:
- ✅ بناء APK في السحابة
- ✅ توفير وقتك وموارد جهازك
- ✅ بناء تلقائي عند كل تحديث
- ✅ إدارة رسمية للإصدارات

---

## 📦 المكونات المنشأة

### 1. GitHub Actions Workflows
```
.github/workflows/
├── build-apk.yml          ← بناء أساسي
└── build-release.yml      ← بناء متقدم مع releases
```

### 2. ملفات التوثيق
```
GITHUB_ACTIONS_SETUP.md        ← شرح مفصل
GITHUB_ACTIONS_REQUIREMENTS.md ← متطلبات وخطوات
```

### 3. سكريبتات مساعدة
```
build-and-push.sh              ← أداة سهلة للدفع
```

---

## 🚀 البدء السريع

### 5 دقائق فقط!

#### 1. تهيئة Git (إذا لزم)
```bash
cd /var/www/html/scan
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

#### 2. إنشاء Repository على GitHub
- اذهب: https://github.com/new
- أنشئ repository فارغ
- انسخ الرابط

#### 3. ربط المشروع
```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

#### 4. شاهد البناء
- اذهب: https://github.com/USERNAME/REPO/actions
- شاهد البناء يعمل! 🎉

---

## 🎯 سيناريوهات الاستخدام

### السيناريو 1: تطوير عادي
```bash
# عمل محلي
git add .
git commit -m "إضافة ميزة جديدة"
git push
# ✅ البناء يعمل تلقائياً!
```

### السيناريو 2: إصدار رسمي
```bash
# إنشاء علامة
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
# ✅ بناء Release + upload على صفحة الإصدار
```

### السيناريو 3: بناء يدوي
```
GitHub > Actions > Build APK > Run workflow
# ✅ بناء فوري بدون commit
```

---

## 📊 خريطة سير العمل

```
┌─────────────────┐
│  محرر الكود     │
│  (VS Code)      │
└────────┬────────┘
         │ git push
         ▼
┌─────────────────┐
│  GitHub         │
│  Repository     │
└────────┬────────┘
         │ webhook trigger
         ▼
┌─────────────────────────────────────┐
│  GitHub Actions Workflow            │
├─────────────────────────────────────┤
│ 1. Checkout Code                   │
│ 2. Setup Node.js 20                │
│ 3. Install pnpm                    │
│ 4. Setup Java 21                   │
│ 5. Setup Android SDK               │
│ 6. pnpm install                    │
│ 7. pnpm build (React)              │
│ 8. ./gradlew assembleDebug         │
│ 9. Upload APK                      │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  📱 APK Output                      │
├─────────────────────────────────────┤
│ android/app/build/outputs/apk/...   │
│   ├─ app-debug.apk                 │
│   └─ app-release.apk               │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  📥 GitHub Artifacts                │
│  (تحميل + حفظ 30 يوم)              │
└─────────────────────────────────────┘
```

---

## 🔧 التخصيص والإعدادات

### تغيير نسخة Java
```yaml
# في .github/workflows/build-apk.yml
java-version: '21'  # غيّر إلى 17 أو 11 إذا لزم
```

### إضافة متغيرات بيئية
```yaml
env:
  NODE_ENV: production
  VITE_API_URL: https://api.example.com
```

### تشغيل على فروع محددة
```yaml
on:
  push:
    branches:
      - main
      - develop
      - staging
```

### إرسال إشعارات (Slack/Discord)
```yaml
- name: Slack Notification
  if: failure()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -d "Build failed"
```

---

## 📥 تحميل APK

### من الويب:
```
1. GitHub > Actions
2. اختر Workflow Run
3. اضغط Artifacts
4. حمّل APK
```

### مثال على الرابط:
```
github.com/USERNAME/REPO/actions/runs/123456789
```

---

## 🔒 الأمان والسرية

### استخدام Secrets للبيانات الحساسة:
```bash
# Settings > Secrets > Actions > New repository secret
```

ثم في Workflow:
```yaml
env:
  API_KEY: ${{ secrets.API_KEY }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 🐛 استكشاف الأخطاء

### "Build failed: Android SDK"
✅ تم الحل: `android-actions/setup-android` يعالجه

### "Permission denied: gradlew"
✅ تم الحل: `chmod +x gradlew` يعمل تلقائياً

### "npm/pnpm not found"
✅ تم الحل: Setup action يثبتها

### Workflow لا يعمل؟
1. تحقق من:
   - ✅ الملف في `.github/workflows/`
   - ✅ اسم الملف ينتهي بـ `.yml`
   - ✅ YAML syntax صحيح
2. شاهد Logs:
   - GitHub > Actions > Workflow > Logs

---

## 📈 مراقبة الأداء

### شاشة Dashboard:
```
GitHub > Actions > Insights
```

### إحصائيات:
- عدد Workflows الناجحة
- متوسط وقت البناء
- الأخطاء الشائعة

---

## 💡 نصائح احترافية

### 1. تقسيم الـ Workflows
```
build-apk.yml       → للتطوير
build-release.yml   → للإصدارات
test.yml           → للاختبارات
lint.yml           → للفحص
```

### 2. استخدام Caching
```yaml
# تسريع البناء
cache:
  gradle-cache: ~/.gradle
  pnpm-cache: ~/.pnpm-store
```

### 3. Notifications
```yaml
- استخدم Slack/Teams/Discord
- أرسل تنبيهات على الفشل
- شارك نتائج البناء
```

### 4. Badge في README
```markdown
[![Build Status](github.com/.../actions/workflows/build-apk.yml/badge.svg)](github.com/.../actions)
```

---

## 🎓 الخطوات النهائية

```bash
# 1. تهيئة (مرة واحدة)
cd /var/www/html/scan
git init

# 2. ربط بـ GitHub (مرة واحدة)
git remote add origin https://github.com/USERNAME/REPO.git

# 3. دفع الكود (مستمر)
git add .
git commit -m "Update"
git push

# 4. شاهد البناء (تلقائي!)
# GitHub > Actions
```

---

## ✅ Checklist نهائي

```
□ إنشاء Git Repository
□ ربط بـ GitHub
□ Duff الكود الأول
□ شاهد Actions يعمل
□ حمّل APK الأول
□ اختبر التطبيق
□ أنشئ Release الأول
□ أرسل لأصدقائك! 🎉
```

---

## 📚 مراجع إضافية

- [GitHub Actions Docs](https://docs.github.com/actions)
- [Android Gradle Plugin](https://developer.android.com/studio/build)
- [React/Vite Build](https://vitejs.dev/guide/build.html)
- [Capacitor Documentation](https://capacitorjs.com/docs)

---

## 🎉 الخلاصة

**قبل:** تثبيت 1.5GB Android SDK محلياً ❌
**بعد:** بناء في السحابة بـ GitHub Actions ✅

**الفوائد:**
- 🚀 أسرع
- 💰 مجاني
- 🔄 تلقائي
- 📱 موثوق
- 🌍 في السحابة

---

**الآن أنت على استعداد لبناء APK دون متاعب! 🎊**
