// Local Storage System for Memorial Page
class LocalSharedData {
    constructor() {
        this.storageKey = 'memorial_shared_data';
        this.offlineKey = 'memorial_offline_data';
        this.isOnline = navigator.onLine;
        this.setupOnlineOfflineListeners();
        this.initData();
    }

    // إعداد مستمعي الاتصال وانقطاع الاتصال
    setupOnlineOfflineListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('أصبح المتصفح متصلاً بالإنترنت');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('أصبح المتصفح غير متصل بالإنترنت');
            this.showOfflineNotification();
        });

        // استمع للرسائل من service worker
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'MEMORIAL_DATA_STORED') {
                    console.log('تم تخزين البيانات في service worker:', event.data.timestamp);
                }
            });
        }
    }

    // تهيئة البيانات
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
            
            // تحقق من وجود بيانات غير متزامنة
            this.syncOfflineData();
        }
    }

    // الحصول على البيانات
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

    // حفظ البيانات
    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        console.log('تم حفظ البيانات في التخزين المحلي');
        
        // حفظ البيانات في service worker للعمل بدون اتصال
        this.saveToServiceWorker(data);
    }

    // حفظ البيانات في service worker
    saveToServiceWorker(data) {
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CACHE_MEMORIAL_DATA',
                payload: data
            });
        }
    }

    // تحديث البيانات
    updateData(newData) {
        newData.lastUpdate = new Date().toISOString();
        this.saveData(newData);
        
        // إذا كان المتصفح غير متصل بالإنترنت، احفظ البيانات للمزامنة لاحقاً
        if (!this.isOnline) {
            this.saveOfflineData(newData);
        }
        
        // إرسال حدث للنوافذ الأخرى
        window.dispatchEvent(new CustomEvent('sharedDataUpdated', {
            detail: newData
        }));
        
        return newData;
    }

    // حفظ البيانات للمزامنة لاحقاً عندما يكون المتصفح غير متصل
    saveOfflineData(data) {
        localStorage.setItem(this.offlineKey, JSON.stringify({
            data: data,
            timestamp: new Date().toISOString()
        }));
        console.log('تم حفظ البيانات للمزامنة لاحقاً');
    }

    // مزامنة البيانات غير المتصلة عندما يعود الاتصال
    syncOfflineData() {
        const offlineData = localStorage.getItem(this.offlineKey);
        if (offlineData) {
            try {
                const parsedData = JSON.parse(offlineData);
                console.log('تتم مزامنة البيانات المحفوظة بدون اتصال...');
                
                // تحديث البيانات المحلية
                this.saveData(parsedData.data);
                
                // حذف البيانات غير المتصلة بعد المزامنة
                localStorage.removeItem(this.offlineKey);
                
                // عرض إشعار بنجاح المزامنة
                this.showSyncNotification();
                
                // طلب مزامنة background إذا كان مدعوماً
                this.requestBackgroundSync();
            } catch (error) {
                console.error('خطأ في مزامنة البيانات غير المتصلة:', error);
            }
        }
    }

    // طلب مزامنة في الخلفية
    requestBackgroundSync() {
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            navigator.serviceWorker.ready.then(registration => {
                registration.sync.register('sync-memorial-data')
                    .then(() => console.log('تم تسجيل مزامنة الخلفية'))
                    .catch(err => console.error('فشل تسجيل مزامنة الخلفية:', err));
            });
        }
    }

    // تحديث عداد التسبيح
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

    // تحديث عداد التفاعل
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

    // تحديث بيانات القرآن
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
    
    // عرض إشعار الحفظ
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
        this.addAnimationStyles();
        
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
    
    // عرض إشعار عدم الاتصال
    showOfflineNotification() {
        // إنشاء عنصر الإشعار
        const notification = document.createElement("div");
        notification.className = "offline-notification";
        notification.innerHTML = `
            <i class="fas fa-wifi" style="margin-right: 10px;"></i>
            أنت الآن في وضع عدم الاتصال. سيتم حفظ تقدمك محلياً.
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: bold;
            animation: slideInDown 0.3s ease;
        `;
        
        // إضافة الرسوم المتحركة
        this.addAnimationStyles();
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد فترة
        setTimeout(() => {
            notification.style.animation = "slideOutUp 0.3s ease";
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // عرض إشعار المزامنة
    showSyncNotification() {
        // إنشاء عنصر الإشعار
        const notification = document.createElement("div");
        notification.className = "sync-notification";
        notification.innerHTML = `
            <i class="fas fa-sync" style="margin-right: 10px;"></i>
            تمت مزامنة بياناتك بنجاح
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: bold;
            animation: slideInDown 0.3s ease;
        `;
        
        // إضافة الرسوم المتحركة
        this.addAnimationStyles();
        
        // إضافة الإشعار إلى الصفحة
        document.body.appendChild(notification);
        
        // إزالة الإشعار بعد فترة
        setTimeout(() => {
            notification.style.animation = "slideOutUp 0.3s ease";
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // إضافة أنماط الرسوم المتحركة
    addAnimationStyles() {
        if (!document.querySelector('style#notification-animations')) {
            const style = document.createElement("style");
            style.id = "notification-animations";
            style.textContent = `
                @keyframes slideInUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideOutDown {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(100%); opacity: 0; }
                }
                @keyframes slideInDown {
                    from { transform: translateY(-100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes slideOutUp {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(-100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
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