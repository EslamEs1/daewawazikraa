// Digital Tasbih Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Prayers and Memories Navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    const prayerCards = document.querySelectorAll('.prayer-card');
    
    if (navButtons.length > 0 && prayerCards.length > 0) {
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetPrayer = this.getAttribute('data-prayer');
                
                // Remove active class from all buttons and cards
                navButtons.forEach(btn => btn.classList.remove('active'));
                prayerCards.forEach(card => card.classList.remove('active'));
                
                // Add active class to clicked button and target card
                this.classList.add('active');
                const targetCard = document.getElementById(targetPrayer);
                if (targetCard) {
                    targetCard.classList.add('active');
                }
            });
        });
        
        // Auto-rotate prayers every 5 seconds
        let currentPrayerIndex = 0;
        setInterval(() => {
            currentPrayerIndex = (currentPrayerIndex + 1) % prayerCards.length;
            
            // Remove active class from all buttons and cards
            navButtons.forEach(btn => btn.classList.remove('active'));
            prayerCards.forEach(card => card.classList.remove('active'));
            
            // Add active class to current prayer
            if (navButtons[currentPrayerIndex] && prayerCards[currentPrayerIndex]) {
                navButtons[currentPrayerIndex].classList.add('active');
                prayerCards[currentPrayerIndex].classList.add('active');
            }
        }, 5000);
    }

    // Tasbih counters
    const tasbihButtons = {
        'do3aa': 'output-area',
        'tasbeh': 'output-area1',
        'hamd': 'output-area2',
        'takbeer': 'output-area3'
    };

    // Initialize counters from localStorage or set to 0
    Object.values(tasbihButtons).forEach(outputId => {
        const counter = document.getElementById(outputId);
        if (counter) {
            const savedCount = localStorage.getItem(outputId) || 0;
            counter.textContent = savedCount;
        }
    });

    // Add click event listeners to tasbih buttons
    Object.entries(tasbihButtons).forEach(([buttonId, outputId]) => {
        const button = document.getElementById(buttonId);
        const counter = document.getElementById(outputId);
        
        if (button && counter) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get current count
                let currentCount = parseInt(counter.textContent);
                
                // Increment count
                currentCount++;
                
                // Update display
                counter.textContent = currentCount;
                
                // Save to localStorage
                localStorage.setItem(outputId, currentCount);
                
                // Add visual feedback
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 100);
                
                // Add counter animation
                counter.style.transform = 'scale(1.2)';
                counter.style.color = '#ff6b6b';
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                    counter.style.color = '#ffd700';
                }, 200);
            });
        }
    });

    // Quran Reading System
    let totalReadings = parseInt(localStorage.getItem('totalReadings')) || 0;
    let completedKhatmat = parseInt(localStorage.getItem('completedKhatmat')) || 0;
    let readSurahs = JSON.parse(localStorage.getItem('readSurahs')) || [];

    // Surah names array
    const surahNames = [
        'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
        'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
        'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
        'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
        'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق',
        'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة',
        'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
        'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
        'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد',
        'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
        'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر',
        'المسد', 'الإخلاص', 'الفلق', 'الناس'
    ];

    // Update counter displays
    function updateCounters() {
        const totalReadingsElement = document.getElementById('totalReadings');
        const completedKhatmatElement = document.getElementById('completedKhatmat');
        const currentProgressElement = document.getElementById('currentProgress');
        const totalReadingsMiniElement = document.getElementById('totalReadingsMini');
        const completedKhatmatMiniElement = document.getElementById('completedKhatmatMini');
        
        if (totalReadingsElement) totalReadingsElement.textContent = totalReadings;
        if (completedKhatmatElement) completedKhatmatElement.textContent = completedKhatmat;
        if (currentProgressElement) currentProgressElement.textContent = readSurahs.length;
        if (totalReadingsMiniElement) totalReadingsMiniElement.textContent = totalReadings;
        if (completedKhatmatMiniElement) completedKhatmatMiniElement.textContent = completedKhatmat;
        
        const progressPercentage = Math.round((readSurahs.length / 114) * 100);
        const progressFillElement = document.getElementById('quranProgress');
        const progressPercentageElement = document.getElementById('progressPercentage');
        const progressDetailsElement = document.getElementById('progressDetails');
        
        if (progressFillElement) progressFillElement.style.width = progressPercentage + '%';
        if (progressPercentageElement) progressPercentageElement.textContent = progressPercentage + '%';
        if (progressDetailsElement) progressDetailsElement.textContent = `(${readSurahs.length} من 114 سورة)`;
    }

    // Generate surah buttons
    function generateSurahButtons() {
        const surahGrid = document.getElementById('surahGrid');
        if (!surahGrid) return;
        
        surahGrid.innerHTML = '';
        
        surahNames.forEach((name, index) => {
            const surahBtn = document.createElement('button');
            surahBtn.className = 'surah-btn';
            surahBtn.textContent = name;
            surahBtn.dataset.surah = index + 1;
            
            if (readSurahs.includes(index + 1)) {
                surahBtn.classList.add('read');
                surahBtn.textContent = name + ' ✓';
            }
            
            surahBtn.addEventListener('click', function() {
                if (!readSurahs.includes(index + 1)) {
                    readSurahs.push(index + 1);
                    this.classList.add('read');
                    this.textContent = name + ' ✓';
                    
                    totalReadings++;
                    
                    // Check if all surahs are read (complete khatma)
                    if (readSurahs.length >= 114) {
                        completedKhatmat++;
                        showNotification('🎉 تم إتمام ختمة قرآن كاملة! مبروك!');
                        
                        // Reset for new khatma
                        readSurahs = [];
                        
                        // Reset all buttons
                        document.querySelectorAll('.surah-btn').forEach(btn => {
                            btn.classList.remove('read');
                            btn.textContent = surahNames[parseInt(btn.dataset.surah) - 1];
                        });
                    }
                    
                    localStorage.setItem('totalReadings', totalReadings);
                    localStorage.setItem('completedKhatmat', completedKhatmat);
                    localStorage.setItem('readSurahs', JSON.stringify(readSurahs));
                    
                    updateCounters();
                    
                    // Add visual feedback
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1)';
                    }, 100);
                    
                    showNotification(`تم قراءة سورة ${name} بنجاح! 📖`);
                }
            });
            
            surahGrid.appendChild(surahBtn);
        });
    }

    // Share progress functionality
    const shareProgressBtn = document.getElementById('shareProgress');
    if (shareProgressBtn) {
        shareProgressBtn.addEventListener('click', function() {
            const shareText = `أهديت ${totalReadings} قراءة قرآن لـ يوسف أحمد. شارك معي في الصدقة الجارية!`;
            if (navigator.share) {
                navigator.share({
                    title: 'صدقة جارية',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback for browsers that don't support Web Share API
                navigator.clipboard.writeText(shareText + '\n' + window.location.href);
                alert('تم نسخ الرابط للحافظة');
            }
        });
    }

    // Complete khatma functionality
    const completeKhatmaBtn = document.getElementById('completeKhatma');
    if (completeKhatmaBtn) {
        completeKhatmaBtn.addEventListener('click', function() {
            if (readSurahs.length >= 114) {
                completedKhatmat++;
                showNotification('🎉 تم إتمام ختمة قرآن كاملة! مبروك!');
                
                // Reset for new khatma
                readSurahs = [];
                
                // Reset all buttons
                document.querySelectorAll('.surah-btn').forEach(btn => {
                    btn.classList.remove('read');
                    btn.textContent = surahNames[parseInt(btn.dataset.surah) - 1];
                });
                
                localStorage.setItem('completedKhatmat', completedKhatmat);
                localStorage.setItem('readSurahs', JSON.stringify(readSurahs));
                
                updateCounters();
            }
        });
    }

    // Interaction Buttons Functionality
    let surahGifts = parseInt(localStorage.getItem('surahGifts')) || 0;
    let prayers = parseInt(localStorage.getItem('prayers')) || 0;
    let juzReads = parseInt(localStorage.getItem('juzReads')) || 0;

    function updateInteractionCounters() {
        const surahCounter = document.getElementById('surahCounter');
        const prayerCounter = document.getElementById('prayerCounter');
        const juzCounter = document.getElementById('juzCounter');
        const totalGifts = document.getElementById('totalGifts');
        const totalPrayers = document.getElementById('totalPrayers');
        const totalReads = document.getElementById('totalReads');
        
        if (surahCounter) surahCounter.textContent = surahGifts;
        if (prayerCounter) prayerCounter.textContent = prayers;
        if (juzCounter) juzCounter.textContent = juzReads;
        if (totalGifts) totalGifts.textContent = surahGifts;
        if (totalPrayers) totalPrayers.textContent = prayers;
        if (totalReads) totalReads.textContent = juzReads;
    }

    // Gift surah functionality
    const giftSurahBtn = document.getElementById('giftSurah');
    if (giftSurahBtn) {
        giftSurahBtn.addEventListener('click', function() {
            surahGifts++;
            localStorage.setItem('surahGifts', surahGifts);
            updateInteractionCounters();
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            showNotification('تم إهداء سورة بنجاح! 🌟');
        });
    }

    // Pray now functionality
    const prayNowBtn = document.getElementById('prayNow');
    if (prayNowBtn) {
        prayNowBtn.addEventListener('click', function() {
            prayers++;
            localStorage.setItem('prayers', prayers);
            updateInteractionCounters();
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            showNotification('تم الدعاء بنجاح! 🙏');
        });
    }

    // Read juz functionality
    const readJuzBtn = document.getElementById('readJuz');
    if (readJuzBtn) {
        readJuzBtn.addEventListener('click', function() {
            juzReads++;
            localStorage.setItem('juzReads', juzReads);
            updateInteractionCounters();
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            showNotification('تم قراءة جزء بنجاح! 📖');
        });
    }

    // Hesn Al-Muslim functionality
    const hesnButtons = {
        'func5': 'حصن المسلم من أذكار الكتاب والسنة (5) الدعاء لمن لبس ثوبا جديدا',
        'func6': 'حصن المسلم من أذكار الكتاب والسنة (6) ما يقول إذا وضع ثوبه',
        'func11': 'حصن المسلم من أذكار الكتاب والسنة (11) الذكر عند الخروج من المنزل',
        'func12': 'حصن المسلم من أذكار الكتاب والسنة (12) الذكر عند دخول المنزل',
        'func14': 'حصن المسلم من أذكار الكتاب والسنة (14) دعاء دخول المسجد',
        'func15': 'حصن المسلم من أذكار الكتاب والسنة (15) دعاء الخروج من المسجد',
        'func16': 'حصن المسلم من أذكار الكتاب والسنة (16) أذكار الذان',
        'func18': 'حصن المسلم من أذكار الكتاب والسنة (18) دعاء الركوع',
        'func19': 'حصن المسلم من أذكار الكتاب والسنة (19) دعاء الرفع من الركوع',
        'func20': 'حصن المسلم من أذكار الكتاب والسنة (20) دعاء السجود',
        'func21': 'حصن المسلم من أذكار الكتاب والسنة (21) دعاء الجلسة بين السجدتين',
        'func22': 'حصن المسلم من أذكار الكتاب والسنة (22) دعاء سجود التلاوة',
        'func23': 'حصن المسلم من أذكار الكتاب والسنة (23) التشهد',
        'func25': 'حصن المسلم من أذكار الكتاب والسنة (25) الدعاء بعد التشهد الأخير قبل السلام',
        'func26': 'حصن المسلم من أذكار الكتاب والسنة (26) الأذكار بعد السلام من الصلاة',
        'func27': 'حصن المسلم من أذكار الكتاب والسنة (27) دعاء صلاة الاستخارة',
        'func28': 'حصن المسلم من أذكار الكتاب والسنة (28) أذكار الصباح والمساء',
        'func29': 'حصن المسلم من أذكار الكتاب والسنة (29) أذكار النوم',
        'func30': 'حصن المسلم من أذكار الكتاب والسنة (30) الدعاء إذا تقلب ليلا',
        'func34': 'حصن المسلم من أذكار الكتاب والسنة (34) الذكر عقب السلام من الوتر',
        'func35': 'حصن المسلم من أذكار الكتاب والسنة (35) دعاء الهم والحزن',
        'func36': 'حصن المسلم من أذكار الكتاب والسنة (36) دعاء الكرب',
        'func37': 'حصن المسلم من أذكار الكتاب والسنة (37) دعاء لقا العدو و ذي السلطان',
        'func38': 'حصن المسلم من أذكار الكتاب والسنة (38) دعاء من خاف ظلم السلطان',
        'func39': 'حصن المسلم من أذكار الكتاب والسنة (39) الدعاء على العدو',
        'func40': 'حصن المسلم من أذكار الكتاب والسنة (40) ما يقول من خاف قوما',
        'func41': 'حصن المسلم من أذكار الكتاب والسنة (41) دعاء من أصابه شك في الإيمان',
        'func42': 'حصن المسلم من أذكار الكتاب والسنة (42) دعاء قضا الدين',
        'func44': 'حصن المسلم من أذكار الكتاب والسنة (44) دعاء من استصعب عليه أمر',
        'func45': 'حصن المسلم من أذكار الكتاب والسنة (45) ما يقول ويفعل من أذنب ذنبا',
        'func46': 'حصن المسلم من أذكار الكتاب والسنة (46) دعاء طرد الشيطان و وساوسه',
        'func47': 'حصن المسلم من أذكار الكتاب والسنة (47) الدعاء حينما يقع ما لا يرضاه أو غلب على أمره',
        'func48': 'حصن المسلم من أذكار الكتاب والسنة (48) تهنئة المولود له وجوابه',
        'func49': 'حصن المسلم من أذكار الكتاب والسنة (49) ما يعوذ به الأولاد',
        'func50': 'حصن المسلم من أذكار الكتاب والسنة (50) الدعاء للمريض في عيادته',
        'func51': 'حصن المسلم من أذكار الكتاب والسنة (51) فضل عيادة المريض',
        'func53': 'حصن المسلم من أذكار الكتاب والسنة (53) تلقين المحتضر',
        'func54': 'حصن المسلم من أذكار الكتاب والسنة (54) دعاء من أصيب بمصيبة',
        'func55': 'حصن المسلم من أذكار الكتاب والسنة (55) الدعاء عند إغماض الميت',
        'func56': 'حصن المسلم من أذكار الكتاب والسنة (56) الدعاء للميت في الصلاة عليه',
        'func57': 'حصن المسلم من أذكار الكتاب والسنة (57) الدعاء للفرط في الصلاة عليه',
        'func58': 'حصن المسلم من أذكار الكتاب والسنة (58) دعاء التعزية',
        'func59': 'حصن المسلم من أذكار الكتاب والسنة (59) الدعاء عند إدخال الميت القبر',
        'func60': 'حصن المسلم من أذكار الكتاب والسنة (60) الدعاء بعد دفن الميت',
        'func108': 'حصن المسلم من أذكار الكتاب والسنة (108) فضل الصلاة على النبي صلى الله عليه و سلم',
        'func109': 'حصن المسلم من أذكار الكتاب والسنة (109) إفشا السلام',
        'func110': 'حصن المسلم من أذكار الكتاب والسنة (110) كيف يرد السلام على الكافر إذا سلم',
        'func112': 'حصن المسلم من أذكار الكتاب والسنة (112) دعاء نباح الكلاب بالليل',
        'func113': 'حصن المسلم من أذكار الكتاب والسنة (113) الدعاء لمن سببته',
        'func114': 'حصن المسلم من أذكار الكتاب والسنة (114) ما يقول المسلم إذا مدح المسلم',
        'func115': 'حصن المسلم من أذكار الكتاب والسنة (115) ما يقول المسلم إذا زكي',
        'func116': 'حصن المسلم من أذكار الكتاب والسنة (116) كيف يلبي المحرم في الحج أو العمرة',
        'func117': 'حصن المسلم من أذكار الكتاب والسنة (117) التكبير إذا أتى الركن الأسود',
        'func118': 'حصن المسلم من أذكار الكتاب والسنة (118) الدعاء بين الركن اليماني والحجر الأسود',
        'func120': 'حصن المسلم من أذكار الكتاب والسنة (120) الدعاء يوم عرفة (عرفه)',
        'func121': 'حصن المسلم من أذكار الكتاب والسنة (121) الذكر عند المشعر الحرام',
        'func122': 'حصن المسلم من أذكار الكتاب والسنة (122) التكبير عند رمي الجمار مع كل حصاة',
        'func123': 'حصن المسلم من أذكار الكتاب والسنة (123) دعاء التعجب والأمر السار',
        'func124': 'حصن المسلم من أذكار الكتاب والسنة (124) ما يفعل من أتاه أمر يسره',
        'func125': 'حصن المسلم من أذكار الكتاب والسنة (125) ما يقول من أحس وجعا في جسده',
        'func127': 'حصن المسلم من أذكار الكتاب والسنة (127) ما يقال عند الفزع',
        'func128': 'حصن المسلم من أذكار الكتاب والسنة (128) ما يقول عند الذبح أو النحر',
        'func129': 'حصن المسلم من أذكار الكتاب والسنة (129) ما يقول لرد كيد مردة الشياطين',
        'func130': 'حصن المسلم من أذكار الكتاب والسنة (130) الاستغفار و التوبة',
        'func131': 'حصن المسلم من أذكار الكتاب والسنة (131) فضل التسبيح و التحميد و التهليل و التكبير',
        'func132': 'حصن المسلم من أذكار الكتاب والسنة (132) كيف كان النبي يسبح',
        'func133': 'حصن المسلم من أذكار الكتاب والسنة (133) من أنواع الخير والداب الجامعة'
    };

    // Audio file mapping for Hesn Al-Muslim
    const hesnAudioFiles = {
        'func5': 'audios/حصن المسلم من أذكار الكتاب والسنة (5) الدعاء لمن لبس ثوبا جديدا.mp3',
        'func6': 'audios/حصن المسلم من أذكار الكتاب والسنة (6) ما يقول إذا وضع ثوبه.mp3',
        'func11': 'audios/حصن المسلم من أذكار الكتاب والسنة (11) الذكر عند الخروج من المنزل.mp3',
        'func12': 'audios/حصن المسلم من أذكار الكتاب والسنة (12) الذكر عند دخول المنزل.mp3',
        'func14': 'audios/حصن المسلم من أذكار الكتاب والسنة (14) دعاء دخول المسجد.mp3',
        'func15': 'audios/حصن المسلم من أذكار الكتاب والسنة (15) دعاء الخروج من المسجد.mp3',
        'func16': 'audios/حصن المسلم من أذكار الكتاب والسنة (16) أذكار الذان.mp3',
        'func18': 'audios/حصن المسلم من أذكار الكتاب والسنة (18) دعاء الركوع.mp3',
        'func19': 'audios/حصن المسلم من أذكار الكتاب والسنة (19) دعاء الرفع من الركوع.mp3',
        'func20': 'audios/حصن المسلم من أذكار الكتاب والسنة (20) دعاء السجود.mp3',
        'func21': 'audios/حصن المسلم من أذكار الكتاب والسنة (21) دعاء الجلسة بين السجدتين.mp3',
        'func22': 'audios/حصن المسلم من أذكار الكتاب والسنة (22) دعاء سجود التلاوة.mp3',
        'func23': 'audios/حصن المسلم من أذكار الكتاب والسنة (23) التشهد.mp3',
        'func25': 'audios/حصن المسلم من أذكار الكتاب والسنة (25) الدعاء بعد التشهد الأخير قبل السلام.mp3',
        'func26': 'audios/حصن المسلم من أذكار الكتاب والسنة (26) الأذكار بعد السلام من الصلاة.mp3',
        'func27': 'audios/حصن المسلم من أذكار الكتاب والسنة (27) دعاء صلاة الاستخارة.mp3',
        'func28': 'audios/حصن المسلم من أذكار الكتاب والسنة (28) أذكار الصباح والمساء.mp3',
        'func29': 'audios/حصن المسلم من أذكار الكتاب والسنة (29) أذكار النوم.mp3',
        'func30': 'audios/حصن المسلم من أذكار الكتاب والسنة (30) الدعاء إذا تقلب ليلا.mp3',
        'func34': 'audios/حصن المسلم من أذكار الكتاب والسنة (34) الذكر عقب السلام من الوتر.mp3',
        'func35': 'audios/حصن المسلم من أذكار الكتاب والسنة (35) دعاء الهم والحزن.mp3',
        'func36': 'audios/حصن المسلم من أذكار الكتاب والسنة (36) دعاء الكرب.mp3',
        'func37': 'audios/حصن المسلم من أذكار الكتاب والسنة (37) دعاء لقا العدو و ذي السلطان.mp3',
        'func38': 'audios/حصن المسلم من أذكار الكتاب والسنة (38) دعاء من خاف ظلم السلطان.mp3',
        'func39': 'audios/حصن المسلم من أذكار الكتاب والسنة (39) الدعاء على العدو.mp3',
        'func40': 'audios/حصن المسلم من أذكار الكتاب والسنة (40) ما يقول من خاف قوما.mp3',
        'func41': 'audios/حصن المسلم من أذكار الكتاب والسنة (41) دعاء من أصابه شك في الإيمان.mp3',
        'func42': 'audios/حصن المسلم من أذكار الكتاب والسنة (42) دعاء قضا الدين.mp3',
        'func44': 'audios/حصن المسلم من أذكار الكتاب والسنة (44) دعاء من استصعب عليه أمر.mp3',
        'func45': 'audios/حصن المسلم من أذكار الكتاب والسنة (45) ما يقول ويفعل من أذنب ذنبا.mp3',
        'func46': 'audios/حصن المسلم من أذكار الكتاب والسنة (46) دعاء طرد الشيطان و وساوسه.mp3',
        'func47': 'audios/حصن المسلم من أذكار الكتاب والسنة (47) الدعاء حينما يقع ما لا يرضاه أو غلب على أمره.mp3',
        'func48': 'audios/حصن المسلم من أذكار الكتاب والسنة (48) تهنئة المولود له وجوابه.mp3',
        'func49': 'audios/حصن المسلم من أذكار الكتاب والسنة (49) ما يعوذ به الأولاد.mp3',
        'func50': 'audios/حصن المسلم من أذكار الكتاب والسنة (50) الدعاء للمريض في عيادته.mp3',
        'func51': 'audios/حصن المسلم من أذكار الكتاب والسنة (51) فضل عيادة المريض.mp3',
        'func53': 'audios/حصن المسلم من أذكار الكتاب والسنة (53) تلقين المحتضر.mp3',
        'func54': 'حصن المسلم من أذكار الكتاب والسنة (54) دعاء من أصيب بمصيبة.mp3',
        'func55': 'audios/حصن المسلم من أذكار الكتاب والسنة (55) الدعاء عند إغماض الميت.mp3',
        'func56': 'audios/حصن المسلم من أذكار الكتاب والسنة (56) الدعاء للميت في الصلاة عليه.mp3',
        'func57': 'audios/حصن المسلم من أذكار الكتاب والسنة (57) الدعاء للفرط في الصلاة عليه.mp3',
        'func58': 'audios/حصن المسلم من أذكار الكتاب والسنة (58) دعاء التعزية.mp3',
        'func59': 'audios/حصن المسلم من أذكار الكتاب والسنة (59) الدعاء عند إدخال الميت القبر.mp3',
        'func60': 'audios/حصن المسلم من أذكار الكتاب والسنة (60) الدعاء بعد دفن الميت.mp3',
        'func108': 'audios/حصن المسلم من أذكار الكتاب والسنة (108) فضل الصلاة على النبي صلى الله عليه و سلم.mp3',
        'func109': 'audios/حصن المسلم من أذكار الكتاب والسنة (109) إفشا السلام.mp3',
        'func110': 'audios/حصن المسلم من أذكار الكتاب والسنة (110) كيف يرد السلام على الكافر إذا سلم.mp3',
        'func112': 'audios/حصن المسلم من أذكار الكتاب والسنة (112) دعاء نباح الكلاب بالليل.mp3',
        'func113': 'audios/حصن المسلم من أذكار الكتاب والسنة (113) الدعاء لمن سببته.mp3',
        'func114': 'audios/حصن المسلم من أذكار الكتاب والسنة (114) ما يقول المسلم إذا مدح المسلم.mp3',
        'func115': 'audios/حصن المسلم من أذكار الكتاب والسنة (115) ما يقول المسلم إذا زكي.mp3',
        'func116': 'audios/حصن المسلم من أذكار الكتاب والسنة (116) كيف يلبي المحرم في الحج أو العمرة.mp3',
        'func117': 'audios/حصن المسلم من أذكار الكتاب والسنة (117) التكبير إذا أتى الركن الأسود.mp3',
        'func118': 'audios/حصن المسلم من أذكار الكتاب والسنة (118) الدعاء بين الركن اليماني والحجر الأسود.mp3',
        'func120': 'audios/حصن المسلم من أذكار الكتاب والسنة (120) الدعاء يوم عرفة (عرفه).mp3',
        'func121': 'audios/حصن المسلم من أذكار الكتاب والسنة (121) الذكر عند المشعر الحرام.mp3',
        'func122': 'audios/حصن المسلم من أذكار الكتاب والسنة (122) التكبير عند رمي الجمار مع كل حصاة.mp3',
        'func123': 'audios/حصن المسلم من أذكار الكتاب والسنة (123) دعاء التعجب والأمر السار.mp3',
        'func124': 'audios/حصن المسلم من أذكار الكتاب والسنة (124) ما يفعل من أتاه أمر يسره.mp3',
        'func125': 'audios/حصن المسلم من أذكار الكتاب والسنة (125) ما يقول من أحس وجعا في جسده.mp3',
        'func127': 'audios/حصن المسلم من أذكار الكتاب والسنة (127) ما يقال عند الفزع.mp3',
        'func128': 'audios/حصن المسلم من أذكار الكتاب والسنة (128) ما يقول عند الذبح أو النحر.mp3',
        'func129': 'audios/حصن المسلم من أذكار الكتاب والسنة (129) ما يقول لرد كيد مردة الشياطين.mp3',
        'func130': 'audios/حصن المسلم من أذكار الكتاب والسنة (130) الاستغفار و التوبة.mp3',
        'func131': 'audios/حصن المسلم من أذكار الكتاب والسنة (131) فضل التسبيح و التحميد و التهليل و التكبير.mp3',
        'func132': 'audios/حصن المسلم من أذكار الكتاب والسنة (132) كيف كان النبي يسبح.mp3',
        'func133': 'audios/حصن المسلم من أذكار الكتاب والسنة (133) من أنواع الخير والداب الجامعة.mp3'
    };

    // Add click event listeners to hesn buttons
    Object.entries(hesnButtons).forEach(([buttonId, title]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Update player name
                const playerNameElement = document.getElementById('playerName');
                if (playerNameElement) {
                    playerNameElement.textContent = title;
                }
                
                // Add visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 100);
                
                // Add active state
                document.querySelectorAll('.hesn-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                
                // Load and play actual audio file
                const audioPlayer = document.getElementById('musicPlayer');
                const audioFile = hesnAudioFiles[buttonId];
                
                if (audioPlayer && audioFile) {
                    // Remove any existing loading spinner
                    const existingSpinner = audioPlayer.parentNode.querySelector('.loading-spinner');
                    if (existingSpinner) {
                        existingSpinner.remove();
                    }
                    
                    audioPlayer.style.opacity = '0.5';
                    
                    // Create loading spinner
                    const loadingSpinner = document.createElement('div');
                    loadingSpinner.className = 'loading-spinner';
                    loadingSpinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    loadingSpinner.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #ffd700; font-size: 20px;';
                    audioPlayer.parentNode.style.position = 'relative';
                    audioPlayer.parentNode.appendChild(loadingSpinner);
                    
                    // Remove existing event listeners
                    audioPlayer.removeEventListener('canplaythrough', audioPlayer.canplaythroughHandler);
                    audioPlayer.removeEventListener('error', audioPlayer.errorHandler);
                    
                    // Set up new event listeners
                    audioPlayer.canplaythroughHandler = function() {
                        audioPlayer.style.opacity = '1';
                        loadingSpinner.remove();
                        audioPlayer.play().catch(e => console.log('Play failed:', e));
                    };
                    
                    audioPlayer.errorHandler = function(e) {
                        audioPlayer.style.opacity = '1';
                        loadingSpinner.remove();
                        alert('عذراً، لا يمكن تحميل الملف الصوتي');
                    };
                    
                    audioPlayer.addEventListener('canplaythrough', audioPlayer.canplaythroughHandler);
                    audioPlayer.addEventListener('error', audioPlayer.errorHandler);
                    
                    // Set the audio source
                    audioPlayer.src = audioFile;
                    audioPlayer.load();
                } else {
                    alert('عذراً، لا يوجد ملف صوتي لهذا الدعاء');
                }
            });
        }
    });

    // Disable buttons that don't have audio files
    document.querySelectorAll('.hesn-btn').forEach(button => {
        const buttonId = button.id;
        if (!hesnAudioFiles[buttonId]) {
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
            button.title = 'لا يوجد ملف صوتي لهذا الدعاء';
            button.disabled = true;
        }
    });

    // Hadith search functionality
    window.searchHadith = function() {
        const searchTerm = document.getElementById('hadithSearch').value;
        if (searchTerm.trim() !== '') {
            const searchUrl = `https://sunnah.one/?s=${encodeURIComponent(searchTerm)}`;
            window.open(searchUrl, '_blank');
        } else {
            alert('يرجى إدخال نص للبحث');
        }
    };

    // Add enter key support for hadith search
    const hadithSearchInput = document.getElementById('hadithSearch');
    if (hadithSearchInput) {
        hadithSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchHadith();
            }
        });
    }

    // Notification system
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
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
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Add CSS animations
    const style = document.createElement('style');
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

    // Initialize all functionality
    updateCounters();
    generateSurahButtons();
    updateInteractionCounters();
});
