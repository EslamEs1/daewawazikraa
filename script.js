document.addEventListener("DOMContentLoaded", function () {
    const navButtons = document.querySelectorAll(".nav-btn");
    const prayerCards = document.querySelectorAll(".prayer-card");
    if (navButtons.length > 0 && prayerCards.length > 0) {
        navButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const targetPrayer = this.getAttribute("data-prayer");
                navButtons.forEach((btn) => btn.classList.remove("active"));
                prayerCards.forEach((card) => card.classList.remove("active"));
                this.classList.add("active");
                const targetCard = document.getElementById(targetPrayer);
                if (targetCard) {
                    targetCard.classList.add("active");
                }
            });
        });
        let currentPrayerIndex = 0;
        setInterval(() => {
            currentPrayerIndex = (currentPrayerIndex + 1) % prayerCards.length;
            navButtons.forEach((btn) => btn.classList.remove("active"));
            prayerCards.forEach((card) => card.classList.remove("active"));
            if (navButtons[currentPrayerIndex] && prayerCards[currentPrayerIndex]) {
                navButtons[currentPrayerIndex].classList.add("active");
                prayerCards[currentPrayerIndex].classList.add("active");
            }
        }, 5000);
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

    // Load shared data from server
    async function loadSharedData() {
        try {
            const response = await fetch('api.php?action=getData');
            const data = await response.json();
            if (data && !data.error) {
                sharedData = data;
                console.log('Loaded shared data:', sharedData);
                console.log('Read surahs count:', (sharedData.quran.readSurahs || []).length);
                updateAllCounters();
                // Update surah buttons after loading data
                generateSurahButtons();
            } else {
                console.log('Error loading data:', data);
            }
        } catch (error) {
            console.log('Error loading shared data:', error);
        }
    }

    // Update tasbih counter on server
    async function updateTasbihCounter(type) {
        try {
            const response = await fetch('api.php?action=updateTasbih', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: type })
            });
            const result = await response.json();
            if (result.success) {
                sharedData = result.data;
                updateAllCounters();
            } else {
                console.log('Error updating tasbih:', result);
            }
        } catch (error) {
            console.log('Error updating tasbih counter:', error);
        }
    }

    // Update all counters display
    function updateAllCounters() {
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
        
        // Update surah buttons to reflect current read status
        generateSurahButtons();
    }

    // Initialize tasbih buttons with shared data
    const tasbihButtons = {
        'do3aa': 'output-area',
        'tasbeh': 'output-area1',
        'hamd': 'output-area2',
        'takbeer': 'output-area3'
    };

    Object.entries(tasbihButtons).forEach(([buttonId, outputId]) => {
        const button = document.getElementById(buttonId);
        const counter = document.getElementById(outputId);

        if (button && counter) {
            button.addEventListener('click', function(e) {
                e.preventDefault();

                // Update local display immediately for better UX
                let currentCount = parseInt(counter.textContent) || 0;
                currentCount++;
                counter.textContent = currentCount;

                // Visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);

                counter.style.transform = 'scale(1.2)';
                counter.style.color = '#ff6b6b';
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                    counter.style.color = '#ffd700';
                }, 200);

                // Update on server
                updateTasbihCounter(buttonId);
            });
        }
    });

    // Load shared data when page loads
    setTimeout(() => {
        loadSharedData();
    }, 100);

    // Refresh shared data every 30 seconds
    setInterval(loadSharedData, 30000);
    
    // Debug: Log shared data every 10 seconds
    setInterval(() => {
        console.log('Current shared data:', sharedData);
    }, 10000);
    
    // Initialize surah buttons after a short delay to ensure DOM is ready
    setTimeout(() => {
        generateSurahButtons();
    }, 500);

    // Update Quran data on server
    async function updateQuranData() {
        try {
            const response = await fetch('api.php?action=updateQuran', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    quranData: {
                        totalReadings: sharedData.quran.totalReadings,
                        completedKhatmat: sharedData.quran.completedKhatmat,
                        readSurahs: sharedData.quran.readSurahs
                    }
                })
            });
            const result = await response.json();
            if (result.success) {
                sharedData = result.data;
                updateAllCounters();
            }
        } catch (error) {
            console.log('Error updating Quran data:', error);
        }
    }
    const surahNames = [
        "الفاتحة",
        "البقرة",
        "آل عمران",
        "النساء",
        "المائدة",
        "الأنعام",
        "الأعراف",
        "الأنفال",
        "التوبة",
        "يونس",
        "هود",
        "يوسف",
        "الرعد",
        "إبراهيم",
        "الحجر",
        "النحل",
        "الإسراء",
        "الكهف",
        "مريم",
        "طه",
        "الأنبياء",
        "الحج",
        "المؤمنون",
        "النور",
        "الفرقان",
        "الشعراء",
        "النمل",
        "القصص",
        "العنكبوت",
        "الروم",
        "لقمان",
        "السجدة",
        "الأحزاب",
        "سبأ",
        "فاطر",
        "يس",
        "الصافات",
        "ص",
        "الزمر",
        "غافر",
        "فصلت",
        "الشورى",
        "الزخرف",
        "الدخان",
        "الجاثية",
        "الأحقاف",
        "محمد",
        "الفتح",
        "الحجرات",
        "ق",
        "الذاريات",
        "الطور",
        "النجم",
        "القمر",
        "الرحمن",
        "الواقعة",
        "الحديد",
        "المجادلة",
        "الحشر",
        "الممتحنة",
        "الصف",
        "الجمعة",
        "المنافقون",
        "التغابن",
        "الطلاق",
        "التحريم",
        "الملك",
        "القلم",
        "الحاقة",
        "المعارج",
        "نوح",
        "الجن",
        "المزمل",
        "المدثر",
        "القيامة",
        "الإنسان",
        "المرسلات",
        "النبأ",
        "النازعات",
        "عبس",
        "التكوير",
        "الانفطار",
        "المطففين",
        "الانشقاق",
        "البروج",
        "الطارق",
        "الأعلى",
        "الغاشية",
        "الفجر",
        "البلد",
        "الشمس",
        "الليل",
        "الضحى",
        "الشرح",
        "التين",
        "العلق",
        "القدر",
        "البينة",
        "الزلزلة",
        "العاديات",
        "القارعة",
        "التكاثر",
        "العصر",
        "الهمزة",
        "الفيل",
        "قريش",
        "الماعون",
        "الكوثر",
        "الكافرون",
        "النصر",
        "المسد",
        "الإخلاص",
        "الفلق",
        "الناس",
    ];
    function updateCounters() {
        // This function is now handled by updateAllCounters()
        updateAllCounters();
    }
    function generateSurahButtons() {
        const surahGrid = document.getElementById("surahGrid");
        if (!surahGrid) {
            console.log('Surah grid not found');
            return;
        }
        
        // Clear existing buttons
        surahGrid.innerHTML = "";
        
        // Get current read surahs
        const readSurahs = sharedData.quran.readSurahs || [];
        console.log('Generating surah buttons with read surahs:', readSurahs);
        console.log('Total surahs to generate:', surahNames.length);
        
        surahNames.forEach((name, index) => {
            const surahBtn = document.createElement("button");
            surahBtn.className = "surah-btn";
            surahBtn.textContent = name;
            surahBtn.dataset.surah = index + 1;
            
            // Check if this surah is read
            if (readSurahs.includes(index + 1)) {
                surahBtn.classList.add("read");
                surahBtn.textContent = name + " ✓";
                console.log(`Surah ${name} (${index + 1}) marked as read`);
            }
            surahBtn.addEventListener("click", function () {
                if (!(sharedData.quran.readSurahs || []).includes(index + 1)) {
                    // Update local data immediately
                    if (!sharedData.quran.readSurahs) sharedData.quran.readSurahs = [];
                    sharedData.quran.readSurahs.push(index + 1);
                    sharedData.quran.totalReadings++;
                    
                    this.classList.add("read");
                    this.textContent = name + " ✓";
                    
                    if (sharedData.quran.readSurahs.length >= 114) {
                        sharedData.quran.completedKhatmat++;
                        showNotification("🎉 تم إتمام ختمة قرآن كاملة! مبروك!");
                        sharedData.quran.readSurahs = [];
                        document.querySelectorAll(".surah-btn").forEach((btn) => {
                            btn.classList.remove("read");
                            btn.textContent = surahNames[parseInt(btn.dataset.surah) - 1];
                        });
                    }
                    
                    // Update display
                    updateAllCounters();
                    
                    // Visual feedback
                    this.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        this.style.transform = "scale(1)";
                    }, 100);
                    
                    // Update on server
                    updateQuranData();
                    showNotification(`تم قراءة سورة ${name} بنجاح! 📖`);
                }
            });
            surahGrid.appendChild(surahBtn);
        });
    }
    const shareProgressBtn = document.getElementById("shareProgress");
    if (shareProgressBtn) {
        shareProgressBtn.addEventListener("click", function () {
            const shareText = `أهديت ${sharedData.quran.totalReadings || 0} قراءة قرآن لـ يوسف أحمد. شارك معي في الصدقة الجارية!`;
            if (navigator.share) {
                navigator.share({ title: "صدقة جارية", text: shareText, url: window.location.href });
            } else {
                navigator.clipboard.writeText(shareText + "\n" + window.location.href);
                alert("تم نسخ الرابط للحافظة");
            }
        });
    }
    const completeKhatmaBtn = document.getElementById("completeKhatma");
    if (completeKhatmaBtn) {
        completeKhatmaBtn.addEventListener("click", function () {
            if ((sharedData.quran.readSurahs || []).length >= 114) {
                sharedData.quran.completedKhatmat++;
                showNotification("🎉 تم إتمام ختمة قرآن كاملة! مبروك!");
                sharedData.quran.readSurahs = [];
                document.querySelectorAll(".surah-btn").forEach((btn) => {
                    btn.classList.remove("read");
                    btn.textContent = surahNames[parseInt(btn.dataset.surah) - 1];
                });
                updateAllCounters();
                updateQuranData();
            }
        });
    }
    // Update interaction counter on server
    async function updateInteractionCounter(type) {
        try {
            const response = await fetch('api.php?action=updateInteraction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: type })
            });
            const result = await response.json();
            if (result.success) {
                sharedData = result.data;
                updateAllCounters();
            }
        } catch (error) {
            console.log('Error updating interaction counter:', error);
        }
    }

    const giftSurahBtn = document.getElementById("giftSurah");
    if (giftSurahBtn) {
        giftSurahBtn.addEventListener("click", function () {
            // Update local display immediately
            sharedData.interactions.surahGifts++;
            updateAllCounters();
            
            // Visual feedback
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 100);
            
            // Update on server
            updateInteractionCounter('surahGifts');
            showNotification("تم إهداء سورة بنجاح! 🌟");
        });
    }

    const prayNowBtn = document.getElementById("prayNow");
    if (prayNowBtn) {
        prayNowBtn.addEventListener("click", function () {
            // Update local display immediately
            sharedData.interactions.prayers++;
            updateAllCounters();
            
            // Visual feedback
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 100);
            
            // Update on server
            updateInteractionCounter('prayers');
            showNotification("تم الدعاء بنجاح! 🙏");
        });
    }

    const readJuzBtn = document.getElementById("readJuz");
    if (readJuzBtn) {
        readJuzBtn.addEventListener("click", function () {
            // Update local display immediately
            sharedData.interactions.juzReads++;
            updateAllCounters();
            
            // Visual feedback
            this.style.transform = "scale(0.95)";
            setTimeout(() => {
                this.style.transform = "scale(1)";
            }, 100);
            
            // Update on server
            updateInteractionCounter('juzReads');
            showNotification("تم قراءة جزء بنجاح! 📖");
        });
    }
    const hesnButtons = {
        func5: "حصن المسلم من أذكار الكتاب والسنة (5) الدعاء لمن لبس ثوبا جديدا",
        func6: "حصن المسلم من أذكار الكتاب والسنة (6) ما يقول إذا وضع ثوبه",
        func11: "حصن المسلم من أذكار الكتاب والسنة (11) الذكر عند الخروج من المنزل",
        func12: "حصن المسلم من أذكار الكتاب والسنة (12) الذكر عند دخول المنزل",
        func14: "حصن المسلم من أذكار الكتاب والسنة (14) دعاء دخول المسجد",
        func15: "حصن المسلم من أذكار الكتاب والسنة (15) دعاء الخروج من المسجد",
        func16: "حصن المسلم من أذكار الكتاب والسنة (16) أذكار الذان",
        func18: "حصن المسلم من أذكار الكتاب والسنة (18) دعاء الركوع",
        func19: "حصن المسلم من أذكار الكتاب والسنة (19) دعاء الرفع من الركوع",
        func20: "حصن المسلم من أذكار الكتاب والسنة (20) دعاء السجود",
        func21: "حصن المسلم من أذكار الكتاب والسنة (21) دعاء الجلسة بين السجدتين",
        func22: "حصن المسلم من أذكار الكتاب والسنة (22) دعاء سجود التلاوة",
        func23: "حصن المسلم من أذكار الكتاب والسنة (23) التشهد",
        func25: "حصن المسلم من أذكار الكتاب والسنة (25) الدعاء بعد التشهد الأخير قبل السلام",
        func26: "حصن المسلم من أذكار الكتاب والسنة (26) الأذكار بعد السلام من الصلاة",
        func27: "حصن المسلم من أذكار الكتاب والسنة (27) دعاء صلاة الاستخارة",
        func28: "حصن المسلم من أذكار الكتاب والسنة (28) أذكار الصباح والمساء",
        func29: "حصن المسلم من أذكار الكتاب والسنة (29) أذكار النوم",
        func30: "حصن المسلم من أذكار الكتاب والسنة (30) الدعاء إذا تقلب ليلا",
        func34: "حصن المسلم من أذكار الكتاب والسنة (34) الذكر عقب السلام من الوتر",
        func35: "حصن المسلم من أذكار الكتاب والسنة (35) دعاء الهم والحزن",
        func36: "حصن المسلم من أذكار الكتاب والسنة (36) دعاء الكرب",
        func37: "حصن المسلم من أذكار الكتاب والسنة (37) دعاء لقا العدو و ذي السلطان",
        func38: "حصن المسلم من أذكار الكتاب والسنة (38) دعاء من خاف ظلم السلطان",
        func39: "حصن المسلم من أذكار الكتاب والسنة (39) الدعاء على العدو",
        func40: "حصن المسلم من أذكار الكتاب والسنة (40) ما يقول من خاف قوما",
        func41: "حصن المسلم من أذكار الكتاب والسنة (41) دعاء من أصابه شك في الإيمان",
        func42: "حصن المسلم من أذكار الكتاب والسنة (42) دعاء قضا الدين",
        func44: "حصن المسلم من أذكار الكتاب والسنة (44) دعاء من استصعب عليه أمر",
        func45: "حصن المسلم من أذكار الكتاب والسنة (45) ما يقول ويفعل من أذنب ذنبا",
        func46: "حصن المسلم من أذكار الكتاب والسنة (46) دعاء طرد الشيطان و وساوسه",
        func47: "حصن المسلم من أذكار الكتاب والسنة (47) الدعاء حينما يقع ما لا يرضاه أو غلب على أمره",
        func48: "حصن المسلم من أذكار الكتاب والسنة (48) تهنئة المولود له وجوابه",
        func49: "حصن المسلم من أذكار الكتاب والسنة (49) ما يعوذ به الأولاد",
        func50: "حصن المسلم من أذكار الكتاب والسنة (50) الدعاء للمريض في عيادته",
        func51: "حصن المسلم من أذكار الكتاب والسنة (51) فضل عيادة المريض",
        func53: "حصن المسلم من أذكار الكتاب والسنة (53) تلقين المحتضر",
        func54: "حصن المسلم من أذكار الكتاب والسنة (54) دعاء من أصيب بمصيبة",
        func55: "حصن المسلم من أذكار الكتاب والسنة (55) الدعاء عند إغماض الميت",
        func56: "حصن المسلم من أذكار الكتاب والسنة (56) الدعاء للميت في الصلاة عليه",
        func57: "حصن المسلم من أذكار الكتاب والسنة (57) الدعاء للفرط في الصلاة عليه",
        func58: "حصن المسلم من أذكار الكتاب والسنة (58) دعاء التعزية",
        func59: "حصن المسلم من أذكار الكتاب والسنة (59) الدعاء عند إدخال الميت القبر",
        func60: "حصن المسلم من أذكار الكتاب والسنة (60) الدعاء بعد دفن الميت",
        func108: "حصن المسلم من أذكار الكتاب والسنة (108) فضل الصلاة على النبي صلى الله عليه و سلم",
        func109: "حصن المسلم من أذكار الكتاب والسنة (109) إفشا السلام",
        func110: "حصن المسلم من أذكار الكتاب والسنة (110) كيف يرد السلام على الكافر إذا سلم",
        func112: "حصن المسلم من أذكار الكتاب والسنة (112) دعاء نباح الكلاب بالليل",
        func113: "حصن المسلم من أذكار الكتاب والسنة (113) الدعاء لمن سببته",
        func114: "حصن المسلم من أذكار الكتاب والسنة (114) ما يقول المسلم إذا مدح المسلم",
        func115: "حصن المسلم من أذكار الكتاب والسنة (115) ما يقول المسلم إذا زكي",
        func116: "حصن المسلم من أذكار الكتاب والسنة (116) كيف يلبي المحرم في الحج أو العمرة",
        func117: "حصن المسلم من أذكار الكتاب والسنة (117) التكبير إذا أتى الركن الأسود",
        func118: "حصن المسلم من أذكار الكتاب والسنة (118) الدعاء بين الركن اليماني والحجر الأسود",
        func120: "حصن المسلم من أذكار الكتاب والسنة (120) الدعاء يوم عرفة (عرفه)",
        func121: "حصن المسلم من أذكار الكتاب والسنة (121) الذكر عند المشعر الحرام",
        func122: "حصن المسلم من أذكار الكتاب والسنة (122) التكبير عند رمي الجمار مع كل حصاة",
        func123: "حصن المسلم من أذكار الكتاب والسنة (123) دعاء التعجب والأمر السار",
        func124: "حصن المسلم من أذكار الكتاب والسنة (124) ما يفعل من أتاه أمر يسره",
        func125: "حصن المسلم من أذكار الكتاب والسنة (125) ما يقول من أحس وجعا في جسده",
        func127: "حصن المسلم من أذكار الكتاب والسنة (127) ما يقال عند الفزع",
        func128: "حصن المسلم من أذكار الكتاب والسنة (128) ما يقول عند الذبح أو النحر",
        func129: "حصن المسلم من أذكار الكتاب والسنة (129) ما يقول لرد كيد مردة الشياطين",
        func130: "حصن المسلم من أذكار الكتاب والسنة (130) الاستغفار و التوبة",
        func131: "حصن المسلم من أذكار الكتاب والسنة (131) فضل التسبيح و التحميد و التهليل و التكبير",
        func132: "حصن المسلم من أذكار الكتاب والسنة (132) كيف كان النبي يسبح",
        func133: "حصن المسلم من أذكار الكتاب والسنة (133) من أنواع الخير والداب الجامعة",
    };
    const hesnAudioFiles = {
        func5: "audios/حصن المسلم من أذكار الكتاب والسنة (5) الدعاء لمن لبس ثوبا جديدا.mp3",
        func6: "audios/حصن المسلم من أذكار الكتاب والسنة (6) ما يقول إذا وضع ثوبه.mp3",
        func11: "audios/حصن المسلم من أذكار الكتاب والسنة (11) الذكر عند الخروج من المنزل.mp3",
        func12: "audios/حصن المسلم من أذكار الكتاب والسنة (12) الذكر عند دخول المنزل.mp3",
        func14: "audios/حصن المسلم من أذكار الكتاب والسنة (14) دعاء دخول المسجد.mp3",
        func15: "audios/حصن المسلم من أذكار الكتاب والسنة (15) دعاء الخروج من المسجد.mp3",
        func16: "audios/حصن المسلم من أذكار الكتاب والسنة (16) أذكار الذان.mp3",
        func18: "audios/حصن المسلم من أذكار الكتاب والسنة (18) دعاء الركوع.mp3",
        func19: "audios/حصن المسلم من أذكار الكتاب والسنة (19) دعاء الرفع من الركوع.mp3",
        func20: "audios/حصن المسلم من أذكار الكتاب والسنة (20) دعاء السجود.mp3",
        func21: "audios/حصن المسلم من أذكار الكتاب والسنة (21) دعاء الجلسة بين السجدتين.mp3",
        func22: "audios/حصن المسلم من أذكار الكتاب والسنة (22) دعاء سجود التلاوة.mp3",
        func23: "audios/حصن المسلم من أذكار الكتاب والسنة (23) التشهد.mp3",
        func25: "audios/حصن المسلم من أذكار الكتاب والسنة (25) الدعاء بعد التشهد الأخير قبل السلام.mp3",
        func26: "audios/حصن المسلم من أذكار الكتاب والسنة (26) الأذكار بعد السلام من الصلاة.mp3",
        func27: "audios/حصن المسلم من أذكار الكتاب والسنة (27) دعاء صلاة الاستخارة.mp3",
        func28: "audios/حصن المسلم من أذكار الكتاب والسنة (28) أذكار الصباح والمساء.mp3",
        func29: "audios/حصن المسلم من أذكار الكتاب والسنة (29) أذكار النوم.mp3",
        func30: "audios/حصن المسلم من أذكار الكتاب والسنة (30) الدعاء إذا تقلب ليلا.mp3",
        func34: "audios/حصن المسلم من أذكار الكتاب والسنة (34) الذكر عقب السلام من الوتر.mp3",
        func35: "audios/حصن المسلم من أذكار الكتاب والسنة (35) دعاء الهم والحزن.mp3",
        func36: "audios/حصن المسلم من أذكار الكتاب والسنة (36) دعاء الكرب.mp3",
        func37: "audios/حصن المسلم من أذكار الكتاب والسنة (37) دعاء لقا العدو و ذي السلطان.mp3",
        func38: "audios/حصن المسلم من أذكار الكتاب والسنة (38) دعاء من خاف ظلم السلطان.mp3",
        func39: "audios/حصن المسلم من أذكار الكتاب والسنة (39) الدعاء على العدو.mp3",
        func40: "audios/حصن المسلم من أذكار الكتاب والسنة (40) ما يقول من خاف قوما.mp3",
        func41: "audios/حصن المسلم من أذكار الكتاب والسنة (41) دعاء من أصابه شك في الإيمان.mp3",
        func42: "audios/حصن المسلم من أذكار الكتاب والسنة (42) دعاء قضا الدين.mp3",
        func44: "audios/حصن المسلم من أذكار الكتاب والسنة (44) دعاء من استصعب عليه أمر.mp3",
        func45: "audios/حصن المسلم من أذكار الكتاب والسنة (45) ما يقول ويفعل من أذنب ذنبا.mp3",
        func46: "audios/حصن المسلم من أذكار الكتاب والسنة (46) دعاء طرد الشيطان و وساوسه.mp3",
        func47: "audios/حصن المسلم من أذكار الكتاب والسنة (47) الدعاء حينما يقع ما لا يرضاه أو غلب على أمره.mp3",
        func48: "audios/حصن المسلم من أذكار الكتاب والسنة (48) تهنئة المولود له وجوابه.mp3",
        func49: "audios/حصن المسلم من أذكار الكتاب والسنة (49) ما يعوذ به الأولاد.mp3",
        func50: "audios/حصن المسلم من أذكار الكتاب والسنة (50) الدعاء للمريض في عيادته.mp3",
        func51: "audios/حصن المسلم من أذكار الكتاب والسنة (51) فضل عيادة المريض.mp3",
        func53: "audios/حصن المسلم من أذكار الكتاب والسنة (53) تلقين المحتضر.mp3",
        func54: "حصن المسلم من أذكار الكتاب والسنة (54) دعاء من أصيب بمصيبة.mp3",
        func55: "audios/حصن المسلم من أذكار الكتاب والسنة (55) الدعاء عند إغماض الميت.mp3",
        func56: "audios/حصن المسلم من أذكار الكتاب والسنة (56) الدعاء للميت في الصلاة عليه.mp3",
        func57: "audios/حصن المسلم من أذكار الكتاب والسنة (57) الدعاء للفرط في الصلاة عليه.mp3",
        func58: "audios/حصن المسلم من أذكار الكتاب والسنة (58) دعاء التعزية.mp3",
        func59: "audios/حصن المسلم من أذكار الكتاب والسنة (59) الدعاء عند إدخال الميت القبر.mp3",
        func60: "audios/حصن المسلم من أذكار الكتاب والسنة (60) الدعاء بعد دفن الميت.mp3",
        func108: "audios/حصن المسلم من أذكار الكتاب والسنة (108) فضل الصلاة على النبي صلى الله عليه و سلم.mp3",
        func109: "audios/حصن المسلم من أذكار الكتاب والسنة (109) إفشا السلام.mp3",
        func110: "audios/حصن المسلم من أذكار الكتاب والسنة (110) كيف يرد السلام على الكافر إذا سلم.mp3",
        func112: "audios/حصن المسلم من أذكار الكتاب والسنة (112) دعاء نباح الكلاب بالليل.mp3",
        func113: "audios/حصن المسلم من أذكار الكتاب والسنة (113) الدعاء لمن سببته.mp3",
        func114: "audios/حصن المسلم من أذكار الكتاب والسنة (114) ما يقول المسلم إذا مدح المسلم.mp3",
        func115: "audios/حصن المسلم من أذكار الكتاب والسنة (115) ما يقول المسلم إذا زكي.mp3",
        func116: "audios/حصن المسلم من أذكار الكتاب والسنة (116) كيف يلبي المحرم في الحج أو العمرة.mp3",
        func117: "audios/حصن المسلم من أذكار الكتاب والسنة (117) التكبير إذا أتى الركن الأسود.mp3",
        func118: "audios/حصن المسلم من أذكار الكتاب والسنة (118) الدعاء بين الركن اليماني والحجر الأسود.mp3",
        func120: "audios/حصن المسلم من أذكار الكتاب والسنة (120) الدعاء يوم عرفة (عرفه).mp3",
        func121: "audios/حصن المسلم من أذكار الكتاب والسنة (121) الذكر عند المشعر الحرام.mp3",
        func122: "audios/حصن المسلم من أذكار الكتاب والسنة (122) التكبير عند رمي الجمار مع كل حصاة.mp3",
        func123: "audios/حصن المسلم من أذكار الكتاب والسنة (123) دعاء التعجب والأمر السار.mp3",
        func124: "audios/حصن المسلم من أذكار الكتاب والسنة (124) ما يفعل من أتاه أمر يسره.mp3",
        func125: "audios/حصن المسلم من أذكار الكتاب والسنة (125) ما يقول من أحس وجعا في جسده.mp3",
        func127: "audios/حصن المسلم من أذكار الكتاب والسنة (127) ما يقال عند الفزع.mp3",
        func128: "audios/حصن المسلم من أذكار الكتاب والسنة (128) ما يقول عند الذبح أو النحر.mp3",
        func129: "audios/حصن المسلم من أذكار الكتاب والسنة (129) ما يقول لرد كيد مردة الشياطين.mp3",
        func130: "audios/حصن المسلم من أذكار الكتاب والسنة (130) الاستغفار و التوبة.mp3",
        func131: "audios/حصن المسلم من أذكار الكتاب والسنة (131) فضل التسبيح و التحميد و التهليل و التكبير.mp3",
        func132: "audios/حصن المسلم من أذكار الكتاب والسنة (132) كيف كان النبي يسبح.mp3",
        func133: "audios/حصن المسلم من أذكار الكتاب والسنة (133) من أنواع الخير والداب الجامعة.mp3",
    };
    Object.entries(hesnButtons).forEach(([buttonId, title]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                const playerNameElement = document.getElementById("playerName");
                if (playerNameElement) {
                    playerNameElement.textContent = title;
                }
                this.style.transform = "scale(0.95)";
                setTimeout(() => {
                    this.style.transform = "scale(1)";
                }, 100);
                document.querySelectorAll(".hesn-btn").forEach((btn) => {
                    btn.classList.remove("active");
                });
                this.classList.add("active");
                const audioPlayer = document.getElementById("musicPlayer");
                const audioFile = hesnAudioFiles[buttonId];
                if (audioPlayer && audioFile) {
                    const existingSpinner = audioPlayer.parentNode.querySelector(".loading-spinner");
                    if (existingSpinner) {
                        existingSpinner.remove();
                    }
                    audioPlayer.style.opacity = "0.5";
                    const loadingSpinner = document.createElement("div");
                    loadingSpinner.className = "loading-spinner";
                    loadingSpinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    loadingSpinner.style.cssText = "position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffd700; font-size: 20px;";
                    audioPlayer.parentNode.style.position = "relative";
                    audioPlayer.parentNode.appendChild(loadingSpinner);
                    audioPlayer.removeEventListener("canplaythrough", audioPlayer.canplaythroughHandler);
                    audioPlayer.removeEventListener("error", audioPlayer.errorHandler);
                    audioPlayer.canplaythroughHandler = function () {
                        audioPlayer.style.opacity = "1";
                        loadingSpinner.remove();
                        audioPlayer.play().catch((e) => console.log("Play failed:", e));
                    };
                    audioPlayer.errorHandler = function (e) {
                        audioPlayer.style.opacity = "1";
                        loadingSpinner.remove();
                        alert("عذراً، لا يمكن تحميل الملف الصوتي");
                    };
                    audioPlayer.addEventListener("canplaythrough", audioPlayer.canplaythroughHandler);
                    audioPlayer.addEventListener("error", audioPlayer.errorHandler);
                    audioPlayer.src = audioFile;
                    audioPlayer.load();
                } else {
                    alert("عذراً، لا يوجد ملف صوتي لهذا الدعاء");
                }
            });
        }
    });
    document.querySelectorAll(".hesn-btn").forEach((button) => {
        const buttonId = button.id;
        if (!hesnAudioFiles[buttonId]) {
            button.style.opacity = "0.5";
            button.style.cursor = "not-allowed";
            button.title = "لا يوجد ملف صوتي لهذا الدعاء";
            button.disabled = !0;
        }
    });
    window.searchHadith = function () {
        const searchTerm = document.getElementById("hadithSearch").value;
        if (searchTerm.trim() !== "") {
            const searchUrl = `https://sunnah.one/?s=${encodeURIComponent(searchTerm)}`;
            window.open(searchUrl, "_blank");
        } else {
            alert("يرجى إدخال نص للبحث");
        }
    };
    const hadithSearchInput = document.getElementById("hadithSearch");
    if (hadithSearchInput) {
        hadithSearchInput.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
            searchHadith();
            }
        });
    }
    function showNotification(message) {
        const notification = document.createElement("div");
        notification.className = "notification";
        notification.textContent = message;
        notification.style.cssText = `
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
        setTimeout(() => {
            notification.style.animation = "slideOut 0.5s ease";
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
    const style = document.createElement("style");
    style.textContent = `
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
    // Initialize with shared data
    loadSharedData();
    generateSurahButtons();
});
function initScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate");
                const animatedChildren = entry.target.querySelectorAll(".animated");
                animatedChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add("animate");
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        section.classList.add("scroll-animate");
        observer.observe(section);
    });
    const animatedElements = document.querySelectorAll(".adhkar-card, .tasbih-card, .library-card, .video-card, .hesn-btn, .surah-btn, .interaction-btn");
    animatedElements.forEach((element) => {
        element.classList.add("scroll-animate");
        observer.observe(element);
    });
}
function initHoverEffects() {
    const deceasedPhotos = document.querySelectorAll(".deceased-photo");
    deceasedPhotos.forEach((photo) => {
        photo.addEventListener("mouseenter", () => {
            photo.style.animation = "float 2s ease-in-out infinite";
        });
        photo.addEventListener("mouseleave", () => {
            photo.style.animation = "";
        });
    });
    const memorialPhoto = document.querySelector(".memorial-photo");
    if (memorialPhoto) {
        memorialPhoto.addEventListener("mouseenter", () => {
            memorialPhoto.style.animation = "glow 2s ease-in-out infinite";
        });
        memorialPhoto.addEventListener("mouseleave", () => {
            memorialPhoto.style.animation = "";
        });
    }
    const buttons = document.querySelectorAll(".tasbih-btn, .hesn-btn, .surah-btn, .interaction-btn");
    buttons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
            button.style.animation = "pulse 0.6s ease-in-out";
        });
        button.addEventListener("mouseleave", () => {
            button.style.animation = "";
        });
    });
}
function initLoadingAnimations() {
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
        if (!img.complete) {
            img.classList.add("loading");
            img.addEventListener("load", () => {
                img.classList.remove("loading");
            });
        }
    });
}
function initParallaxEffect() {
    const heroSection = document.querySelector(".hero-section");
    if (heroSection) {
        window.addEventListener("scroll", () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
}
function initTypingEffect() {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = "";
        heroTitle.style.borderRight = "2px solid white";
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                heroTitle.style.borderRight = "none";
            }
        };
        setTimeout(typeWriter, 1000);
    }
}
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
}
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
document.addEventListener("DOMContentLoaded", function () {
    initScrollAnimations();
    initHoverEffects();
    initLoadingAnimations();
    initParallaxEffect();
    initTypingEffect();
    initSmoothScroll();
    initAnniversaryCountdown();
    const animatedElements = document.querySelectorAll(".section-title, .section-description, .card-icon");
    animatedElements.forEach((element) => {
        element.classList.add("animated", "fadeInUp");
    });
    const gridItems = document.querySelectorAll(".surah-grid .surah-btn, .hesn-buttons-container .hesn-btn");
    gridItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
    });
});
