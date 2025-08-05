// Local Storage System for Testing
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
            localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
        }
    }

    getData() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    updateData(newData) {
        newData.lastUpdate = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(newData));
        
        // Trigger custom event for other tabs/windows
        window.dispatchEvent(new CustomEvent('sharedDataUpdated', {
            detail: newData
        }));
    }

    updateTasbih(type) {
        const data = this.getData();
        if (data && data.tasbih[type] !== undefined) {
            data.tasbih[type]++;
            this.updateData(data);
            return data;
        }
        return null;
    }

    updateInteraction(type) {
        const data = this.getData();
        if (data && data.interactions[type] !== undefined) {
            data.interactions[type]++;
            this.updateData(data);
            return data;
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
            this.updateData(data);
            return data;
        }
        return null;
    }
}

// Global instance
const sharedDataManager = new LocalSharedData();

// Listen for updates from other tabs
window.addEventListener('sharedDataUpdated', function(event) {
    console.log('Data updated from another tab:', event.detail);
    // Update UI here if needed
});

// Export for use in main script
window.sharedDataManager = sharedDataManager; 