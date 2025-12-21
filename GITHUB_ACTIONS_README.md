# 📱 Scanner Web App - بناء APK في السحابة

> تطبيق ماسح الصور الأصلي بـ React + Capacitor + GitHub Actions

[![Build Status](https://img.shields.io/badge/build-automated-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-20-green)](package.json)

---

## ✨ المميزات

- 📸 **التقاط الصور** من الكاميرا أو المعرض
- 🎨 **7 فلاتر متقدمة** - معالجة فورية
- 💾 **التخزين المحلي** - حفظ آمن للصور
- 🌐 **تطبيق ويب هجين** - يعمل على الويب و Android
- ☁️ **بناء تلقائي** - عبر GitHub Actions
- 🚀 **بدون تثبيت محلي** - كل شيء في السحابة

---

## 🎯 البدء السريع

### الخطوة 1: تهيئة Git
```bash
git init
git add .
git commit -m "Initial commit: Scanner App"
git branch -M main
```

### الخطوة 2: إنشاء GitHub Repository
1. اذهب: [github.com/new](https://github.com/new)
2. أنشئ repository جديد
3. انسخ الرابط

### الخطوة 3: ربط وادفع
```bash
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### الخطوة 4: شاهد البناء
```
https://github.com/USERNAME/REPO/actions
```

✅ **تم! الآن البناء يعمل تلقائياً!**

---

## 📚 التوثيق

### للمبتدئين:
📖 [QUICK_START.md](./QUICK_START.md) - ملخص سريع (5 دقائق)

### للتفاصيل:
📖 [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) - شرح مفصل
📖 [GITHUB_ACTIONS_REQUIREMENTS.md](./GITHUB_ACTIONS_REQUIREMENTS.md) - متطلبات كاملة

### للمتقدمين:
📖 [CI_CD_COMPLETE_GUIDE.md](./CI_CD_COMPLETE_GUIDE.md) - دليل شامل

---

## 🔧 البنية التقنية

### المكتبات:
```
Frontend:
  • React 19
  • Tailwind CSS 4
  • shadcn/ui
  • Framer Motion

Backend:
  • Express.js

Native:
  • Capacitor 8
  • Android SDK
```

### المشروع:
```
scanner-web-app/
├── client/          ← واجهة المستخدم (React)
├── android/         ← التطبيق الأصلي
├── server/          ← الخادم (Express)
└── .github/         ← GitHub Actions
    └── workflows/
        ├── build-apk.yml
        └── build-release.yml
```

---

## 🚀 سير العمل

### عند كل Push:
```
📝 تحديث الكود
↓
🔄 GitHub Webhook
↓
⚙️ GitHub Actions Workflow
  ├─ Node.js 20 تثبيت
  ├─ Java 21 تثبيت
  ├─ Android SDK تثبيت
  ├─ pnpm install
  ├─ pnpm build (React)
  ├─ gradle assembleDebug
  └─ Upload APK
↓
📱 APK جاهز للتحميل!
```

---

## 📥 تحميل APK

### من GitHub:
1. اذهب: `GitHub Actions`
2. اختر آخر Workflow
3. اضغط `Artifacts`
4. حمّل `app-debug.apk`

### التثبيت على جهاز:
```bash
# عبر ADB
adb install app-debug.apk

# أو نقل مباشر وفتح الملف
```

---

## 🎯 الأوامر السريعة

### تطوير:
```bash
# بدء تطوير الويب
pnpm dev

# بناء الويب
pnpm build

# فحص TypeScript
pnpm check

# تنسيق الكود
pnpm format
```

### Git:
```bash
# دفع مع بناء تلقائي
git add .
git commit -m "تحديث"
git push

# إنشاء Release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### Helper Script:
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

---

## 💡 الفوائد

| المعيار | بدون CI/CD | مع GitHub Actions |
|--------|-----------|------------------|
| **التثبيت** | 1.5GB+ SDK | تلقائي |
| **الوقت** | 10-15 دقيقة | 5-10 دقائق |
| **التكلفة** | مجاني | مجاني |
| **التعقيد** | عالي | منخفض |
| **الموثوقية** | متغيرة | ثابتة |
| **التطوير** | محلي فقط | سحابة |

---

## ❓ الأسئلة الشائعة

**س: هل أحتاج Android SDK؟**
ج: لا! يتم كل شيء تلقائياً في السحابة ☁️

**س: هل البناء مجاني؟**
ج: نعم! GitHub Actions مجاني للـ public repositories

**س: كم وقت البناء؟**
ج: 5-10 دقائق عادةً (أول مرة قد تكون أطول)

**س: أين أحمّل APK؟**
ج: GitHub Actions → Artifacts

**س: ماذا إذا فشل البناء؟**
ج: شاهد Logs في GitHub Actions وصحح الأخطاء

**س: كيف أعمل إصدار رسمي؟**
ج: أنشئ tag: `git tag -a v1.0.0 && git push origin v1.0.0`

---

## 🔒 الأمان

### ملفات محمية (.gitignore):
```
- node_modules/
- android/app/build/
- dist/
- *.apk
- *.keystore
- .env
```

### بيانات حساسة:
```
استخدم GitHub Secrets:
Settings > Secrets > Actions > New secret
```

---

## 📊 الإحصائيات

```
📦 الملفات الجديدة: 8
📝 أسطر التوثيق: 1000+
🔧 Workflows: 2
📚 أدلة شاملة: 4
🛠️ Scripts: 1
```

---

## 🎓 التعلم المزيد

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Capacitor Docs](https://capacitorjs.com)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)

---

## 📞 الدعم

### المشاكل الشائعة:
1. **Repository not found**: تأكد من رابط GitHub صحيح
2. **Build fails**: شاهد Logs في GitHub Actions
3. **APK not generated**: تحقق من صيغة XML و Java

### الموارد:
- 📖 [QUICK_START.md](./QUICK_START.md)
- 📖 [CI_CD_COMPLETE_GUIDE.md](./CI_CD_COMPLETE_GUIDE.md)
- 💬 Issues على GitHub

---

## 📄 الترخيص

MIT License - استمتع بالاستخدام الحر! 🎉

---

## 🙏 شكر خاص

- **Capacitor** - جسر React/Android المميز
- **GitHub Actions** - البناء التلقائي في السحابة
- **React** - أفضل مكتبة UI
- **Tailwind** - نظام CSS قوي

---

## 🚀 الخطوة التالية

```bash
✅ 1. اقرأ QUICK_START.md
✅ 2. أنشئ GitHub Repository
✅ 3. ادفع الكود
✅ 4. شاهد البناء يعمل
✅ 5. حمّل APK الأول
✅ 6. اختبر التطبيق
✅ 7. أنشئ Release
✅ 8. شارك مع الجميع! 🎉
```

---

<div align="center">

**الآن أنت مستعد لبناء APK دون متاعب! ✨**

[QUICK_START.md](./QUICK_START.md) | [SETUP.md](./GITHUB_ACTIONS_SETUP.md) | [GUIDE.md](./CI_CD_COMPLETE_GUIDE.md)

</div>
