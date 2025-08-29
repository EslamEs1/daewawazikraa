document.addEventListener("DOMContentLoaded", function() {
    console.log('DOM fully loaded - initializing script');
    
    // Define Quran surah names
    const surahNames = [
        "الفاتحة", "البقرة", "آل عمران", "النساء", "المائدة", "الأنعام", "الأعراف", "الأنفال", "التوبة", "يونس",
        "هود", "يوسف", "الرعد", "إبراهيم", "الحجر", "النحل", "الإسراء", "الكهف", "مريم", "طه",
        "الأنبياء", "الحج", "المؤمنون", "النور", "الفرقان", "الشعراء", "النمل", "القصص", "العنكبوت", "الروم",
        "لقمان", "السجدة", "الأحزاب", "سبأ", "فاطر", "يس", "الصافات", "ص", "الزمر", "غافر",
        "فصلت", "الشورى", "الزخرف", "الدخان", "الجاثية", "الأحقاف", "محمد", "الفتح", "الحجرات", "ق",
        "الذاريات", "الطور", "النجم", "القمر", "الرحمن", "الواقعة", "الحديد", "المجادلة", "الحشر", "الممتحنة",
        "الصف", "الجمعة", "المنافقون", "التغابن", "الطلاق", "التحريم", "الملك", "القلم", "الحاقة", "المعارج",
        "نوح", "الجن", "المزمل", "المدثر", "القيامة", "الإنسان", "المرسلات", "النبأ", "النازعات", "عبس",
        "التكوير", "الانفطار", "المطففين", "الانشقاق", "البروج", "الطارق", "الأعلى", "الغاشية", "الفجر", "البلد",
        "الشمس", "الليل", "الضحى", "الشرح", "التين", "العلق", "القدر", "البينة", "الزلزلة", "العاديات",
        "القارعة", "التكاثر", "العصر", "الهمزة", "الفيل", "قريش", "الماعون", "الكوثر", "الكافرون", "النصر",
        "المسد", "الإخلاص", "الفلق", "الناس"
    ];
    
    // Load hesn buttons and audio files
    let hesnButtons = {};
    let hesnAudioFiles = {};
    
    // Try to load hesn data from external files
    try {
        // Check if the files are included in the HTML
        if (typeof window.hesnButtons !== 'undefined') {
            hesnButtons = window.hesnButtons;
            console.log('Loaded hesnButtons from global variable');
        } else {
            // Load from the separate file we created
            const hesnButtonsScript = document.createElement('script');
            hesnButtonsScript.src = 'hesn_buttons.js';
            hesnButtonsScript.onload = function() {
                console.log('Loaded hesnButtons from external file');
                if (typeof window.hesnButtons !== 'undefined') {
                    hesnButtons = window.hesnButtons;
                    initHesnButtons();
                }
            };
            document.head.appendChild(hesnButtonsScript);
        }
        
        if (typeof window.hesnAudioFiles !== 'undefined') {
            hesnAudioFiles = window.hesnAudioFiles;
            console.log('Loaded hesnAudioFiles from global variable');
        } else {
            // Load from the separate file we created
            const hesnAudioFilesScript = document.createElement('script');
            hesnAudioFilesScript.src = 'hesn_audio_files.js';
            hesnAudioFilesScript.onload = function() {
                console.log('Loaded hesnAudioFiles from external file');
                if (typeof window.hesnAudioFiles !== 'undefined') {
                    hesnAudioFiles = window.hesnAudioFiles;
                    initHesnButtons();
                }
            };
            document.head.appendChild(hesnAudioFilesScript);
        }
    } catch (error) {
        console.error('Error loading hesn data:', error);
    }
    
    // Shared data structure for all visitors
    let sharedData = {
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
        }
    };

    // Update all counters display
    function updateAllCounters() {
        console.log('Updating all counters');
        
        // Update tasbih counters
        const tasbihOutputs = {
            'do3aa': 'output-area',
            'tasbeh': 'output-area1',
            'hamd': 'output-area2',
            'takbeer': 'output-area3'
        };

        Object.entries(tasbihOutputs).forEach(([type, outputId]) => {
            const counter = document.getElementById(outputId);
            if (counter) {
                counter.textContent = sharedData.tasbih[type] || 0;
                console.log(`Updated ${type} counter to ${sharedData.tasbih[type] || 0}`);
            } else {
                console.log(`Counter element ${outputId} not found`);
            }
        });

        // Update interaction counters
        const surahCounter = document.getElementById('surahCounter');
        const prayerCounter = document.getElementById('prayerCounter');
        const juzCounter = document.getElementById('juzCounter');
        const totalGifts = document.getElementById('totalGifts');
        const totalPrayers = document.getElementById('totalPrayers');
        const totalReads = document.getElementById('totalReads');

        if (surahCounter) surahCounter.textContent = sharedData.interactions.surahGifts || 0;
        if (prayerCounter) prayerCounter.textContent = sharedData.interactions.prayers || 0;
        if (juzCounter) juzCounter.textContent = sharedData.interactions.juzReads || 0;
        if (totalGifts) totalGifts.textContent = sharedData.interactions.surahGifts || 0;
        if (totalPrayers) totalPrayers.textContent = sharedData.interactions.prayers || 0;
        if (totalReads) totalReads.textContent = sharedData.interactions.juzReads || 0;

        // Update Quran counters
        const totalReadingsElement = document.getElementById('totalReadings');
        const completedKhatmatElement = document.getElementById('completedKhatmat');
        const currentProgressElement = document.getElementById('currentProgress');
        const totalReadingsMiniElement = document.getElementById('totalReadingsMini');
        const completedKhatmatMiniElement = document.getElementById('completedKhatmatMini');

        if (totalReadingsElement) totalReadingsElement.textContent = sharedData.quran.totalReadings || 0;
        if (completedKhatmatElement) completedKhatmatElement.textContent = sharedData.quran.completedKhatmat || 0;
        if (currentProgressElement) currentProgressElement.textContent = (sharedData.quran.readSurahs || []).length;
        if (totalReadingsMiniElement) totalReadingsMiniElement.textContent = sharedData.quran.totalReadings || 0;
        if (completedKhatmatMiniElement) completedKhatmatMiniElement.textContent = sharedData.quran.completedKhatmat || 0;

        // Update Quran progress
        const progressPercentage = Math.round(((sharedData.quran.readSurahs || []).length / 114) * 100);
        const progressFillElement = document.getElementById('quranProgress');
        const progressPercentageElement = document.getElementById('progressPercentage');
        const progressDetailsElement = document.getElementById('progressDetails');

        if (progressFillElement) progressFillElement.style.width = progressPercentage + '%';
        if (progressPercentageElement) progressPercentageElement.textContent = progressPercentage + '%';
        if (progressDetailsElement) progressDetailsElement.textContent = `(${(sharedData.quran.readSurahs || []).length} من 114 سورة)`;
    }

    // Initialize tasbih buttons with shared data
    const tasbihButtons = {
        'do3aa': 'output-area',
        'tasbeh': 'output-area1',
        'hamd': 'output-area2',
        'takbeer': 'output-area3'
    };

    // Load shared data from localStorage
    async function loadSharedData() {
        console.log('Loading shared data from localStorage');
        try {
            // Wait for sharedDataManager to be available
            if (typeof window.sharedDataManager === 'undefined') {
                console.log('Waiting for sharedDataManager to load...');
                setTimeout(loadSharedData, 100);
                return;
            }
            
            const loadedData = window.sharedDataManager.getData();
            if (loadedData) {
                sharedData = loadedData;
                console.log('Successfully loaded data from localStorage:', sharedData);
                showNotification("تم تحميل البيانات المحفوظة بنجاح");
            } else {
                console.log('No saved data found, using default data');
            }
            
            updateAllCounters();
            generateSurahButtons();
            
        } catch (error) {
            console.error('Error loading shared data:', error);
            generateSurahButtons();
        }
    }

    // Update tasbih counter in localStorage
    async function updateTasbihCounter(type) {
        console.log(`Updating tasbih counter for ${type}`);
        try {
            if (window.sharedDataManager) {
                const result = window.sharedDataManager.updateTasbih(type);
                if (result) {
                    sharedData = result;
                    updateAllCounters();
                    console.log(`Tasbih counter for ${type} updated successfully`);
                }
            } else {
                console.log('SharedDataManager not available');
                // Fallback: update local data only
                sharedData.tasbih[type]++;
                updateAllCounters();
            }
        } catch (error) {
            console.log('Error updating tasbih counter:', error);
        }
    }

    // Initialize with shared data
    console.log('Loading initial data');
    
    // Make sure we load the data after local-storage.js is loaded
    if (window.sharedDataManager) {
        loadSharedData();
    } else {
        // Wait for sharedDataManager to be available
        window.addEventListener('load', function() {
            setTimeout(loadSharedData, 500);
        });
    }
    
    // Generate surah buttons immediately even before loading data
    // This ensures the buttons are visible even if the data loading fails
    generateSurahButtons();
    
    // Initialize interaction buttons
    console.log('Initializing interaction buttons');
    const giftSurahBtn = document.getElementById("giftSurah");
    if (giftSurahBtn) {
        console.log('Setting up gift surah button');
        giftSurahBtn.addEventListener("click", function() {
            console.log('Gift surah button clicked');
            sharedData.interactions.surahGifts++;
            updateAllCounters();
            this.style.transform="scale(0.95)";
            setTimeout(()=>{this.style.transform="scale(1)"},100);
            updateInteractionCounter('surahGifts');
            showNotification("تم إهداء سورة بنجاح! 🌟");
        });
    } else {
        console.log('Gift surah button not found');
    }

    const prayNowBtn = document.getElementById("prayNow");
    if (prayNowBtn) {
        console.log('Setting up pray now button');
        prayNowBtn.addEventListener("click", function() {
            console.log('Pray now button clicked');
            sharedData.interactions.prayers++;
            updateAllCounters();
            this.style.transform="scale(0.95)";
            setTimeout(()=>{this.style.transform="scale(1)"},100);
            updateInteractionCounter('prayers');
            showNotification("تم الدعاء بنجاح! 🙏");
        });
    } else {
        console.log('Pray now button not found');
    }

    const readJuzBtn = document.getElementById("readJuz");
    if (readJuzBtn) {
        console.log('Setting up read juz button');
        readJuzBtn.addEventListener("click", function() {
            console.log('Read juz button clicked');
            sharedData.interactions.juzReads++;
            updateAllCounters();
            this.style.transform="scale(0.95)";
            setTimeout(()=>{this.style.transform="scale(1)"},100);
            updateInteractionCounter('juzReads');
            showNotification("تم قراءة جزء بنجاح! 📖");
        });
    } else {
        console.log('Read juz button not found');
    }

    // Initialize hesn buttons
    function initHesnButtons() {
        console.log('Initializing hesn buttons');
        Object.entries(hesnButtons).forEach(([buttonId, title]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                console.log(`Setting up hesn button: ${buttonId}`);
                button.addEventListener("click", function(e) {
                    e.preventDefault();
                    console.log(`Hesn button clicked: ${buttonId}`);
                    const playerNameElement = document.getElementById("playerName");
                    if (playerNameElement) {
                        playerNameElement.textContent = title;
                    }
                    this.style.transform="scale(0.95)";
                    setTimeout(()=>{this.style.transform="scale(1)"},100);
                    document.querySelectorAll(".hesn-btn").forEach((btn)=>{btn.classList.remove("active")});
                    this.classList.add("active");
                    const audioPlayer = document.getElementById("musicPlayer");
                    const audioFile = hesnAudioFiles[buttonId];
                    if (audioPlayer && audioFile) {
                        console.log(`Playing audio file: ${audioFile}`);
                        const existingSpinner = audioPlayer.parentNode.querySelector(".loading-spinner");
                        if (existingSpinner) {
                            existingSpinner.remove();
                        }
                        audioPlayer.style.opacity="0.5";
                        const loadingSpinner = document.createElement("div");
                        loadingSpinner.className="loading-spinner";
                        loadingSpinner.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
                        loadingSpinner.style.cssText="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffd700; font-size: 20px;";
                        audioPlayer.parentNode.style.position="relative";
                        audioPlayer.parentNode.appendChild(loadingSpinner);
                        audioPlayer.removeEventListener("canplaythrough", audioPlayer.canplaythroughHandler);
                        audioPlayer.removeEventListener("error", audioPlayer.errorHandler);
                        audioPlayer.preload="metadata";
                        audioPlayer.canplaythroughHandler=function(){audioPlayer.style.opacity="1";loadingSpinner.remove();audioPlayer.play().catch((e)=>console.log("Play failed:",e))};
                        audioPlayer.errorHandler=function(e){audioPlayer.style.opacity="1";loadingSpinner.remove();console.error("Audio error:",e);alert("عذراً، لا يمكن تحميل الملف الصوتي")};
                        audioPlayer.addEventListener("canplaythrough", audioPlayer.canplaythroughHandler);
                        audioPlayer.addEventListener("error", audioPlayer.errorHandler);
                        audioPlayer.src=audioFile;
                        audioPlayer.load();
                    } else {
                        console.log(`Audio player or file not found. Player: ${!!audioPlayer}, File: ${!!audioFile}`);
                        alert("عذراً، لا يوجد ملف صوتي لهذا الدعاء");
                    }
                });
            } else {
                console.log(`Hesn button not found: ${buttonId}`);
            }
        });
        document.querySelectorAll(".hesn-btn").forEach((button)=>{const buttonId=button.id;if(!hesnAudioFiles[buttonId]){console.log(`Disabling hesn button without audio file: ${buttonId}`);button.style.opacity="0.5";button.style.cursor="not-allowed";button.title="لا يوجد ملف صوتي لهذا الدعاء";button.disabled=!0}});
        function checkAudioFilesAvailability(){console.log('🔍 Checking audio files availability...');const totalButtons=Object.keys(hesnButtons).length;const totalAudioFiles=Object.keys(hesnAudioFiles).length;console.log(`📊 Total buttons: ${totalButtons}`);console.log(`📊 Total audio files: ${totalAudioFiles}`);Object.keys(hesnButtons).forEach(buttonId=>{if(hesnAudioFiles[buttonId]){console.log(`✅ ${buttonId}: Audio file available`)}else{console.log(`❌ ${buttonId}: No audio file`)}});Object.keys(hesnAudioFiles).forEach(audioId=>{if(!hesnButtons[audioId]){console.log(`⚠️ ${audioId}: Audio file exists but no button`)}});console.log('🔍 Audio files check completed!')}
        setTimeout(checkAudioFilesAvailability,1000)}

    // Initialize hesn buttons
    initHesnButtons();

    // Initialize tasbih buttons
    console.log('Initializing tasbih buttons');
    Object.entries(tasbihButtons).forEach(([buttonId, outputId]) => {
        const button = document.getElementById(buttonId);
        const counter = document.getElementById(outputId);
        if (button && counter) {
            console.log(`Setting up tasbih button: ${buttonId}`);
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`Tasbih button clicked: ${buttonId}`);
                let currentCount = parseInt(counter.textContent) || 0;
                currentCount++;
                counter.textContent = currentCount;
                button.style.transform='scale(0.95)';
                setTimeout(()=>{button.style.transform='scale(1)'},100);
                counter.style.transform='scale(1.2)';
                counter.style.color='#ff6b6b';
                setTimeout(()=>{counter.style.transform='scale(1)';counter.style.color='#ffd700'},200);
                updateTasbihCounter(buttonId);
            });
        } else {
            console.log(`Failed to initialize tasbih button: ${buttonId}, button exists: ${!!button}, counter exists: ${!!counter}`);
        }
    });

    // Initialize Quran data update button
    const updateQuranDataBtn = document.getElementById("updateQuranData");
    if (updateQuranDataBtn) {
        updateQuranDataBtn.addEventListener("click", function() {
            console.log('Update Quran data button clicked');
            updateQuranData();
            showNotification("تم تحديث بيانات القرآن في التخزين المؤقت بنجاح!");
        });
    } else {
        console.log('Update Quran data button not found');
    }

    // Initialize share progress button
    const shareProgressBtn = document.getElementById("shareProgress");
    if (shareProgressBtn) {
        console.log('Setting up share progress button');
        shareProgressBtn.addEventListener("click", function() {
            console.log('Share progress button clicked');
            const shareText = `أهديت ${sharedData.quran.totalReadings || 0} قراءة قرآن لـ يوسف أحمد. شارك معي في الصدقة الجارية!`;
            if (navigator.share) {
                navigator.share({title:"صدقة جارية",text:shareText,url:window.location.href})
                .then(() => {
                    showNotification("تم مشاركة البيانات بنجاح!");
                })
                .catch((error) => {
                    console.error("Error sharing data:", error);
                    alert("حدث خطأ أثناء محاولة مشاركة البيانات.");
                });
            } else {
                navigator.clipboard.writeText(shareText+"\n"+window.location.href)
                .then(() => {
                    showNotification("تم نسخ الرابط للحافظة بنجاح!");
                })
                .catch((err) => {
                    console.error("Error copying link:", err);
                    alert("حدث خطأ أثناء محاولة نسخ الرابط.");
                });
            }
        });
    } else {
        console.log('Share progress button not found');
    }

    // Initialize complete khatma button
    const completeKhatmaBtn = document.getElementById("completeKhatma");
    if (completeKhatmaBtn) {
        console.log('Setting up complete khatma button');
        completeKhatmaBtn.addEventListener("click", function() {
            console.log('Complete khatma button clicked');
            if ((sharedData.quran.readSurahs || []).length >= 114) {
                sharedData.quran.completedKhatmat++;
                showNotification("🎉 تم إتمام ختمة قرآن كاملة! مبروك!");
                sharedData.quran.readSurahs = [];
                document.querySelectorAll(".surah-btn").forEach((btn)=>{btn.classList.remove("read");btn.textContent=surahNames[parseInt(btn.dataset.surah)-1]});
                updateAllCounters();
                updateQuranData();
            } else {
                showNotification("لم يتم إتمام ختمة قرآن كاملة بعد. قم بقراءة المزيد من السور لإكمالها.");
            }
        });
    } else {
        console.log('Complete khatma button not found');
    }

    // Show notification function
    function showNotification(message) {
        console.log(`Showing notification: ${message}`);
        const notification = document.createElement("div");
        notification.className="notification";
        notification.textContent=message;
        notification.style.cssText=`
                position: fixed;
                top: 20px;
                right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
                font-weight: bold;
            animation: slideIn 0.5s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(()=>{notification.style.animation="slideOut 0.5s ease";setTimeout(()=>{notification.remove()},500)},3000)
    }

    // Add styles for notifications
    const style = document.createElement("style");
    style.textContent=`
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Check required elements
    console.log('Checking required elements');
    const requiredElements = ['prayersCarousel','musicPlayer','playerName','hadithSearch','surahGrid','giftSurah','prayNow','readJuz','do3aa','tasbeh','hamd','takbeer'];
    requiredElements.forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            console.log(`✓ ${elementId} found`);
        } else {
            console.log(`✗ ${elementId} not found`);
        }
    });

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
        });
    }

    // Before Install Prompt
    let deferredPrompt;
    let installButton;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });

    function showInstallButton() {
        if (!installButton) {
            installButton = document.createElement('button');
            installButton.className='btn btn-primary install-btn';
            installButton.innerHTML=`
            <i class="fas fa-download"></i>
            تثبيت التطبيق
        `;
            installButton.style.cssText=`
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, var(--accent-color), var(--primary-color));
            border: none;
            border-radius: var(--radius-lg);
            padding: 12px 20px;
            color: white;
            font-weight: 600;
            box-shadow: var(--shadow-lg);
            transition: var(--transition-normal);
            animation: slideInLeft 0.5s ease-out;
        `;
            installButton.addEventListener('mouseenter',()=>{installButton.style.transform='translateY(-2px)';installButton.style.boxShadow='0 15px 30px rgba(0,0,0,0.3)'});
            installButton.addEventListener('mouseleave',()=>{installButton.style.transform='translateY(0)';installButton.style.boxShadow='var(--shadow-lg)'});
            installButton.addEventListener('click', installApp);
            document.body.appendChild(installButton);
            const style=document.createElement('style');
            style.textContent=`
            @keyframes slideInLeft {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
            document.head.appendChild(style);
        }
    }

    async function installApp() {
        if (!deferredPrompt) {
            return;
        }
        deferredPrompt.prompt();
        const {outcome} = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            showInstallSuccess();
        } else {
            console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        hideInstallButton();
    }

    function showInstallSuccess() {
        const successMessage = document.createElement('div');
        successMessage.className='install-success';
        successMessage.innerHTML=`
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h4>تم التثبيت بنجاح!</h4>
            <p>يمكنك الآن الوصول للتطبيق من شاشة الهاتف الرئيسية</p>
        </div>
    `;
        successMessage.style.cssText=`
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
        background: linear-gradient(135deg, var(--success), var(--accent-color));
        border-radius: var(--radius-xl);
        padding: 2rem;
        color: white;
        text-align: center;
        box-shadow: var(--shadow-xl);
        animation: fadeInScale 0.5s ease-out;
    `;
        const style=document.createElement('style');
        style.textContent=`
        @keyframes fadeInScale {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
        document.head.appendChild(style);
        document.body.appendChild(successMessage);
        setTimeout(()=>{successMessage.remove()},3000)
    }

    function hideInstallButton() {
        if (installButton) {
            installButton.remove();
            installButton = null;
        }
    }

    window.addEventListener('appinstalled', (evt) => {
        console.log('App was installed');
        hideInstallButton();
    });

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === !0) {
        console.log('App is running in standalone mode');
        hideInstallButton();
    }

    // Anniversary Countdown
    function initAnniversaryCountdown() {
        const deathDate = new Date("2023-01-15T00:00:00");
        const currentDate = new Date();
        const timeDiff = currentDate - deathDate;
        const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
        const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
        const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const yearsElement = document.getElementById("yearsCountdown");
        const monthsElement = document.getElementById("monthsCountdown");
        const daysElement = document.getElementById("daysCountdown");
        const hoursElement = document.getElementById("hoursCountdown");
        if (yearsElement) yearsElement.textContent = years;
        if (monthsElement) monthsElement.textContent = months;
        if (daysElement) daysElement.textContent = days;
        if (hoursElement) hoursElement.textContent = hours;
        setInterval(() => {
            const currentDate = new Date();
            const timeDiff = currentDate - deathDate;
            const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25));
            const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
            const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (yearsElement) yearsElement.textContent = years;
            if (monthsElement) monthsElement.textContent = months;
            if (daysElement) daysElement.textContent = days;
            if (hoursElement) hoursElement.textContent = hours;
        }, 3600000);
    }
    initAnniversaryCountdown();
});