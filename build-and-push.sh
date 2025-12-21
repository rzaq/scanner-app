#!/bin/bash

# 🚀 سكريبت سهل لدفع التحديثات وتشغيل GitHub Actions

set -e

echo "╔════════════════════════════════════════╗"
echo "║   Scanner App - GitHub Actions Helper  ║"
echo "╚════════════════════════════════════════╝"
echo ""

# التحقق من git
if ! command -v git &> /dev/null; then
    echo "❌ Git غير مثبت!"
    exit 1
fi

# التحقق من repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ هذا ليس git repository!"
    echo "💡 شغّل: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# قائمة الخيارات
echo "اختر العملية:"
echo ""
echo "1) دفع التحديثات (push) وتشغيل البناء"
echo "2) إنشاء Release (إصدار رسمي)"
echo "3) عرض حالة البناء"
echo "4) فتح صفحة GitHub Actions"
echo ""

read -p "اختر (1-4): " choice

case $choice in
    1)
        echo ""
        read -p "رسالة commit: " message
        
        git add .
        git commit -m "$message" || echo "لا توجد تغييرات"
        git push origin main
        
        echo ""
        echo "✅ تم الدفع بنجاح!"
        echo "📊 شاهد حالة البناء على:"
        remote=$(git config --get remote.origin.url | sed 's/.git$//')
        echo "$remote/actions"
        ;;
    
    2)
        echo ""
        read -p "إصدار (مثل v1.0.0): " version
        
        if [[ ! $version =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "❌ صيغة الإصدار خاطئة! استخدم v1.0.0"
            exit 1
        fi
        
        read -p "وصف الإصدار: " description
        
        git tag -a "$version" -m "$description"
        git push origin "$version"
        
        echo ""
        echo "✅ تم إنشاء Release!"
        echo "📱 سيتم بناء APK تلقائياً"
        ;;
    
    3)
        remote=$(git config --get remote.origin.url | sed 's/.git$//')
        echo ""
        echo "📊 حالة البناء:"
        echo "$remote/actions"
        echo ""
        echo "الفروع المتاحة:"
        git branch -v
        ;;
    
    4)
        remote=$(git config --get remote.origin.url | sed 's/.git$//')
        echo ""
        echo "🌐 فتح صفحة GitHub Actions..."
        echo "$remote/actions"
        
        # محاولة فتح في المتصفح (اختياري)
        if command -v xdg-open &> /dev/null; then
            xdg-open "$remote/actions"
        elif command -v open &> /dev/null; then
            open "$remote/actions"
        fi
        ;;
    
    *)
        echo "❌ خيار غير صحيح!"
        exit 1
        ;;
esac

echo ""
echo "✨ تم بنجاح!"
