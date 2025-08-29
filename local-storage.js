// Local Storage System for Memorial Page
class LocalSharedData {
    constructor() {
        this.storageKey = 'memorial_shared_data';
        this.initData();
    }

    initData() {
        const existingData = localStorage.getItem(this.storageKey);
        if (!existingData) {
            const defaultData = {
                tasbih: {
                    do3aa: 0,
                    tasbeh: 0,
                    hamd: 0,
                    takbeer: 0
                },
                interactions: {
                    surahGifts: 0,
                    prayers: 0,
                    juzReads: 0
                },
                quran: {
                    totalReadings: 0,
                    completedKhatmat: 0,
                    readSurahs: []
                },
                lastUpdate: new Date().toISOString()
            };
            this.saveData(defaultData);
            console.log('تم إنشاء بيانات افتراضية جديدة');
        } else {
            console.log('تم العثور على بيانات محفوظة مسبقاً');
        }
    }

    getData() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            console.log('تم تحميل البيانات من التخزين المحلي');
            return JSON.parse(data);
        } else {
            console.log('لم يتم العثور على بيانات في التخزين المحلي');
            return null;
        }
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        console.log('تم حفظ البيانات في التخزين المحلي');
    }

    updateData(newData) {
        newData.lastUpdate = new Date().toISOString();
        this.saveData(newData);
        
        // Trigger custom event for other tabs/windows
        window.dispatchEvent(new CustomEvent('sharedDataUpdated', {
            detail: newData
        }));
        
        return newData;
    }

    updateTasbih(type) {
        const data = this.getData();
        if (data && data.tasbih[type] !== undefined) {
            data.tasbih[type]++;
            const updatedData = this.updateData(data);
            this.showSaveNotification("تم حفظ التسبيح بنجاح");
            return updatedData;
        }
        return null;
    }

    updateInteraction(type) {
        const data = this.getData();
        if (data && data.interactions[type] !== undefined) {
            data.interactions[type]++;
            const updatedData = this.updateData(data);
            this.showSaveNotification("تم حفظ التفاعل بنجاح");
            return updatedData;
        }
        return null;
    }

    updateQuran(quranData) {
        const data = this.getData();
        if (data) {
            if (quranData.totalReadings !== undefined) {
                data.quran.totalReadings = quranData.totalReadings;
            }
            if (quranData.completedKhatmat !== undefined) {
                data.quran.completedKhatmat = quranData.completedKhatmat;
            }
            if (quranData.readSurahs !== undefined) {
                data.quran.readSurahs = quranData.readSurahs;
            }
            const updatedData = this.updateData(data);
            this.showSaveNotification("تم حفظ تقدم القرآن بنجاح");
            return updatedData;
        }
        return null;
    }
    
    showSaveNotification(message) {
        // إنشاء عنصر الإشعار
        const notification = document.createElement("div");
        notification.className = "save-notification";
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: bold;
            animation: slideInUp 0.3s ease;
        `;
        
        // إضافة الرسوم المتحركة
        const style = document.createElement("style");
        if (!document.querySelector('style#save-notification-style')) {
            style.id = "save-notification-style";
            style.textContent = `
                @keyframes slideInUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideOutDown {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد فترة
        setTimeout(() => {
            notification.style.animation = "slideOutDown 0.3s ease";
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// إنشاء نسخة عالمية
const sharedDataManager = new LocalSharedData();

// الاستماع للتحديثات من علامات تبويب أخرى
window.addEventListener('sharedDataUpdated', function(event) {
    console.log('تم تحديث البيانات من علامة تبويب أخرى:', event.detail);
    // يمكن تحديث واجهة المستخدم هنا إذا لزم الأمر
});

// تصدير للاستخدام في النص البرمجي الرئيسي
window.sharedDataManager = sharedDataManager; 