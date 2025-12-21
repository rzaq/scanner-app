# 📱 Scanner Web App - ماسح الصور الذكي

> تطبيق هجين (Web + Android) لمسح ومعالجة الصور بـ React + Capacitor + GitHub Actions

[![Build Status](https://img.shields.io/badge/build-automated-brightgreen?style=flat-square)](./github/workflows)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Actions-blue?style=flat-square)](https://github.com/features/actions)

---

## �� البدء السريع

```bash
# 1. تهيئة
cd /var/www/html/scan
git remote add origin https://github.com/USERNAME/scanner-app.git
git push -u origin main

# 2. شاهد البناء
# https://github.com/USERNAME/scanner-app/actions

# 3. حمّل APK وثبّت!
```

📖 [اقرأ FINAL_STEPS.md للخطوات الكاملة](./FINAL_STEPS.md)

---

## ✨ المميزات

- 📸 **التقاط الصور** من الكاميرا أو المعرض
- 🎨 **7 فلاتر متقدمة** - معالجة فورية في الوقت الفعلي
- 💾 **التخزين المحلي** - حفظ آمن ومنظم للصور
- 🌐 **تطبيق هجين** - يعمل على الويب و Android أصلي
- ☁️ **بناء تلقائي** - GitHub Actions بدون تثبيت محلي
- 🎨 **تصميم حديث** - Neo-Brutalism/Cyberpunk UI

---

## 🛠️ التكنولوجيا

```
Frontend:        Backend:         Native:
React 19         Express.js       Capacitor 8
TypeScript       Node.js 20       Android
Tailwind CSS 4   port 3000        Java
shadcn/ui                         Gradle
```

---

## 📁 الهيكل

```
scanner-web-app/
├── client/              # React App
│   ├── src/
│   │   ├── components/  # UI Components
│   │   ├── pages/       # Pages (Home, Editor, Gallery)
│   │   ├── lib/         # Utilities (imageFilters, storage)
│   │   └── contexts/    # Theme Context
│   └── vite.config.ts
├── android/             # Native Android
│   ├── app/
│   └── gradle/
├── server/              # Express Backend
│   └── index.ts
├── .github/
│   └── workflows/       # GitHub Actions
│       ├── build-apk.yml
│       └── build-release.yml
└── package.json
```

---

## 💻 الأوامر

### التطوير:
```bash
pnpm dev         # بدء الخادم والويب
pnpm build       # بناء الإنتاج
pnpm check       # فحص TypeScript
pnpm format      # تنسيق الكود
```

### Android:
```bash
cd android
./gradlew assembleDebug    # بناء APK (محلياً)
./gradlew assembleRelease  # بناء Release
```

### Git:
```bash
git add .
git commit -m "رسالة"
git push                   # بناء تلقائي على GitHub!
```

---

## 🔄 سير العمل (CI/CD)

```
git push
    ↓
GitHub Actions Webhook
    ↓
✅ Checkout
✅ Install Node.js 20
✅ Install Java 21
✅ Install Android SDK
✅ pnpm install
✅ pnpm build
✅ gradle assembleDebug
✅ Upload APK
    ↓
📱 APK في Artifacts!
```

⏱️ **المدة:** 5-10 دقائق
💾 **الحجم:** ~80-100MB
🔒 **الحفظ:** 30 يوم

---

## 📥 تحميل APK

```
1. اذهب: GitHub Actions
2. اختر آخر Workflow
3. اضغط "Artifacts"
4. حمّل app-debug.apk
5. ثبّت على الجهاز!
```

---

## 📚 التوثيق

| الملف | الموضوع |
|------|---------|
| [QUICK_START.md](./QUICK_START.md) | ملخص سريع (5 دقائق) |
| [FINAL_STEPS.md](./FINAL_STEPS.md) | ربط GitHub والدفع |
| [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) | شرح مفصل |
| [CI_CD_COMPLETE_GUIDE.md](./CI_CD_COMPLETE_GUIDE.md) | دليل متقدم |

---

## 🔒 الأمان

- ✅ `.gitignore` محدثة
- ✅ بيانات حساسة في Secrets
- ✅ بناء معزول في السحابة
- ✅ لا توجد مفاتيح في الكود

---

## 🐛 المشاكل؟

### "Build failed"
→ شاهد Logs في GitHub Actions

### "APK not found"
→ انتظر 5-10 دقائق لانتهاء البناء

### "Authentication failed"
→ استخدم GitHub Token: https://github.com/settings/tokens/new

### "Push rejected"
→ تحقق من الفرع: `git branch` (يجب أن يكون main)

---

## 🎓 التعلم المزيد

- [Capacitor Docs](https://capacitorjs.com)
- [React Docs](https://react.dev)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Android Development](https://developer.android.com)

---

## 📄 الترخيص

MIT License - استخدم بحرية! 🎉

---

## 🙏 شكر

- **Capacitor** - جسر React/Android
- **GitHub Actions** - البناء التلقائي
- **React** - واجهة المستخدم
- **Tailwind** - نظام التصميم

---

<div align="center">

**الآن أنت مستعد لبناء APK دون متاعب! ✨**

[QUICK_START.md](./QUICK_START.md) • [FINAL_STEPS.md](./FINAL_STEPS.md) • [GitHub](https://github.com)

</div>
