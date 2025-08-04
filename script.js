// Digital Tasbih Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Prayers and Memories Navigation - Add this at the beginning
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
        'hamed': 'output-area2',
        'takber': 'output-area3'
    };

    // Initialize counters from localStorage or set to 0
    Object.values(tasbihButtons).forEach(outputId => {
        const counter = document.getElementById(outputId);
        const savedCount = localStorage.getItem(outputId) || 0;
        counter.textContent = savedCount;
    });

    // Add click event listeners to tasbih buttons
    Object.entries(tasbihButtons).forEach(([buttonId, outputId]) => {
        const button = document.getElementById(buttonId);
        const counter = document.getElementById(outputId);
        
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
    });

    // Scroll Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animation
    const animateElements = document.querySelectorAll('.adhkar-card, .tasbih-card, .resource-card, .quran-content');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Audio player enhancements
    const audioPlayers = document.querySelectorAll('.custom-audio');
    audioPlayers.forEach(audio => {
        // Add custom styling for audio controls
        audio.addEventListener('loadedmetadata', function() {
            // Custom audio player styling
            this.style.width = '100%';
        });
    });

    // Add loading animation for iframe
    const quranIframe = document.querySelector('.quran-player iframe');
    if (quranIframe) {
        quranIframe.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        quranIframe.style.opacity = '0';
        quranIframe.style.transition = 'opacity 0.5s ease';
    }

    // Add hover effects for resource cards
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click sound effect for tasbih buttons
    function playClickSound() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // Add sound effect to tasbih buttons
    Object.keys(tasbihButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        button.addEventListener('click', playClickSound);
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add typing effect to hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize typing effect when page loads
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }

    // Add floating animation to memorial frame
    const memorialFrame = document.querySelector('.memorial-frame');
    if (memorialFrame) {
        setInterval(() => {
            memorialFrame.style.transform = 'rotate(-2deg) translateY(-5px)';
            setTimeout(() => {
                memorialFrame.style.transform = 'rotate(-2deg) translateY(0px)';
            }, 2000);
        }, 4000);
    }

    // Add counter reset functionality (double click)
    Object.entries(tasbihButtons).forEach(([buttonId, outputId]) => {
        const button = document.getElementById(buttonId);
        const counter = document.getElementById(outputId);
        
        let clickCount = 0;
        let clickTimer = null;
        
        button.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 1) {
                clickTimer = setTimeout(() => {
                    clickCount = 0;
                }, 300);
            } else if (clickCount === 2) {
                clearTimeout(clickTimer);
                clickCount = 0;
                
                // Reset counter
                counter.textContent = '0';
                localStorage.setItem(outputId, '0');
                
                // Show reset animation
                counter.style.transform = 'scale(1.5)';
                counter.style.color = '#ff6b6b';
                setTimeout(() => {
                    counter.style.transform = 'scale(1)';
                    counter.style.color = '#ffd700';
                }, 300);
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case '1':
                document.getElementById('do3aa').click();
                break;
            case '2':
                document.getElementById('tasbeh').click();
                break;
            case '3':
                document.getElementById('hamed').click();
                break;
            case '4':
                document.getElementById('takber').click();
                break;
            case 'r':
            case 'R':
                // Reset all counters
                Object.values(tasbihButtons).forEach(outputId => {
                    const counter = document.getElementById(outputId);
                    counter.textContent = '0';
                    localStorage.setItem(outputId, '0');
                });
                break;
        }
    });

    // Add tooltip for keyboard shortcuts
    const tasbihCards = document.querySelectorAll('.tasbih-card');
    tasbihCards.forEach((card, index) => {
        const button = card.querySelector('.tasbih-btn');
        const shortcuts = ['1', '2', '3', '4'];
        button.title = `اضغط ${shortcuts[index]} للعد السريع`;
    });

    // Add total counter display
    function updateTotalCounter() {
        let total = 0;
        Object.values(tasbihButtons).forEach(outputId => {
            total += parseInt(document.getElementById(outputId).textContent);
        });
        
        // Create or update total display
        let totalDisplay = document.getElementById('total-counter');
        if (!totalDisplay) {
            totalDisplay = document.createElement('div');
            totalDisplay.id = 'total-counter';
            totalDisplay.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 20px;
                font-size: 1.2rem;
                font-weight: bold;
                z-index: 1000;
            `;
            document.body.appendChild(totalDisplay);
        }
        totalDisplay.textContent = `المجموع: ${total}`;
    }

    // Update total counter on any tasbih click
    Object.values(tasbihButtons).forEach(outputId => {
        const counter = document.getElementById(outputId);
        const observer = new MutationObserver(updateTotalCounter);
        observer.observe(counter, { childList: true, characterData: true, subtree: true });
    });

    // Initialize total counter
    updateTotalCounter();

    // Hesn Al-Muslim functionality
    const hesnButtons = {
        'func10': 'حصن المسلم من أذكار الكتاب والسنة (10) الذكر بعد الفراغ من الوضوء',
        'func100': 'حصن المسلم من أذكار الكتاب والسنة (100) الدعاء إذا تعس المركوب',
        'func101': 'حصن المسلم من أذكار الكتاب والسنة (101) دعاء المساء للمقيم',
        'func103': 'حصن المسلم من أذكار الكتاب والسنة (103) التكبير والتسبيح في سير السفر',
        'func106': 'حصن المسلم من أذكار الكتاب والسنة (106) ذكر الرجوع من السفر',
        'func107': 'حصن المسلم من أذكار الكتاب والسنة (107) ما يقول من أتاه أمر يسره أو يكرهه',
        'func108': 'حصن المسلم من أذكار الكتاب والسنة (108) فضل الصلاة على النبي صلى الله عليه وسلم',
        'func109': 'حصن المسلم من أذكار الكتاب والسنة (109) إفشاء السلام',
        'func11': 'حصن المسلم من أذكار الكتاب والسنة (11) الذكر عند الخروج من المنزل',
        'func110': 'حصن المسلم من أذكار الكتاب والسنة (110) كيف يرد السلام على الكافر إذا سلم',
        'func112': 'حصن المسلم من أذكار الكتاب والسنة (112) دعاء نباح الكلاب بالليل',
        'func113': 'حصن المسلم من أذكار الكتاب والسنة (113) الدعاء لمن سببته',
        'func114': 'حصن المسلم من أذكار الكتاب والسنة (114) ما يقول المسلم إذا مدح المسلم',
        'func115': 'حصن المسلم من أذكار الكتاب والسنة (115) ما يقول المسلم إذا زكي',
        'func116': 'حصن المسلم من أذكار الكتاب والسنة (116) كيف يلبي المحرم في الحج أو العمرة',
        'func117': 'حصن المسلم من أذكار الكتاب والسنة (117) التكبير إذا أتى الركن الأسود',
        'func118': 'حصن المسلم من أذكار الكتاب والسنة (118) الدعاء بين الركن اليماني والحجر الأسود',
        'func12': 'حصن المسلم من أذكار الكتاب والسنة (12) الذكر عند دخول المنزل',
        'func120': 'حصن المسلم من أذكار الكتاب والسنة (120) الدعاء يوم عرفة (عرفه)',
        'func121': 'حصن المسلم من أذكار الكتاب والسنة (121) الذكر عند المشعر الحرام',
        'func122': 'حصن المسلم من أذكار الكتاب والسنة (122) التكبير عند رمي الجمار مع كل حصاة',
        'func123': 'حصن المسلم من أذكار الكتاب والسنة (123) دعاء التعجب والأمر السار',
        'func124': 'حصن المسلم من أذكار الكتاب والسنة (124) ما يفعل من أتاه أمر يسره',
        'func125': 'حصن المسلم من أذكار الكتاب والسنة (125) ما يقول من أحس وجعا في جسده',
        'func127': 'حصن المسلم من أذكار الكتاب والسنة (127) ما يقال عند الفزع',
        'func128': 'حصن المسلم من أذكار الكتاب والسنة (128) ما يقول عند الذبح أو النحر',
        'func129': 'حصن المسلم من أذكار الكتاب والسنة (129) ما يقول لرد كيد مردة الشياطين',
        'func130': 'حصن المسلم من أذكار الكتاب والسنة (130) الاستغفار والتوبة',
        'func131': 'حصن المسلم من أذكار الكتاب والسنة (131) فضل التسبيح والتحميد والتهليل والتكبير',
        'func132': 'حصن المسلم من أذكار الكتاب والسنة (132) كيف كان النبي يسبح',
        'func133': 'حصن المسلم من أذكار الكتاب والسنة (133) من أنواع الخير والدواب الجامعة',
        'func14': 'حصن المسلم من أذكار الكتاب والسنة (14) دعاء دخول المسجد',
        'func15': 'حصن المسلم من أذكار الكتاب والسنة (15) دعاء الخروج من المسجد',
        'func16': 'حصن المسلم من أذكار الكتاب والسنة (16) أذكار الأذان',
        'func17': 'حصن المسلم من أذكار الكتاب والسنة (17) دعاء الاستفتاح',
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
        'func3': 'حصن المسلم من أذكار الكتاب والسنة (3) دعاء لبس الثوب',
        'func30': 'حصن المسلم من أذكار الكتاب والسنة (30) الدعاء إذا تقلب ليلا',
        'func32': 'حصن المسلم من أذكار الكتاب والسنة (32) ما يفعل من رأى الرؤيا أو الحلم',
        'func34': 'حصن المسلم من أذكار الكتاب والسنة (34) الذكر عقب السلام من الوتر',
        'func35': 'حصن المسلم من أذكار الكتاب والسنة (35) دعاء الهم والحزن',
        'func36': 'حصن المسلم من أذكار الكتاب والسنة (36) دعاء الكرب',
        'func37': 'حصن المسلم من أذكار الكتاب والسنة (37) دعاء لقاء العدو وذي السلطان',
        'func38': 'حصن المسلم من أذكار الكتاب والسنة (38) دعاء من خاف ظلم السلطان',
        'func39': 'حصن المسلم من أذكار الكتاب والسنة (39) الدعاء على العدو',
        'func4': 'حصن المسلم من أذكار الكتاب والسنة (4) دعاء لبس الثوب الجديد',
        'func40': 'حصن المسلم من أذكار الكتاب والسنة (40) ما يقول من خاف قوما',
        'func41': 'حصن المسلم من أذكار الكتاب والسنة (41) دعاء من أصابه شك في الإيمان',
        'func42': 'حصن المسلم من أذكار الكتاب والسنة (42) دعاء قضاء الدين',
        'func44': 'حصن المسلم من أذكار الكتاب والسنة (44) دعاء من استصعب عليه أمر',
        'func45': 'حصن المسلم من أذكار الكتاب والسنة (45) ما يقول ويفعل من أذنب ذنبا',
        'func46': 'حصن المسلم من أذكار الكتاب والسنة (46) دعاء طرد الشيطان ووساوسه',
        'func47': 'حصن المسلم من أذكار الكتاب والسنة (47) الدعاء حينما يقع ما لا يرضاه أو غلب على أمره',
        'func48': 'حصن المسلم من أذكار الكتاب والسنة (48) تهنئة المولود له وجوابه',
        'func49': 'حصن المسلم من أذكار الكتاب والسنة (49) ما يعوذ به الأولاد',
        'func5': 'حصن المسلم من أذكار الكتاب والسنة (5) الدعاء لمن لبس ثوبا جديدا',
        'func50': 'حصن المسلم من أذكار الكتاب والسنة (50) الدعاء للمريض في عيادته',
        'func51': 'حصن المسلم من أذكار الكتاب والسنة (51) فضل عيادة المريض',
        'func53': 'حصن المسلم من أذكار الكتاب والسنة (53) تلقين المحتضر',
        'func54': 'حصن المسلم من أذكار الكتاب والسنة (54) دعاء من أصيب بمصيبة',
        'func55': 'حصن المسلم من أذكار الكتاب والسنة (55) الدعاء عند إغماض الميت',
        'func56': 'حصن المسلم من أذكار الكتاب والسنة (56) الدعاء للميت في الصلاة عليه',
        'func57': 'حصن المسلم من أذكار الكتاب والسنة (57) الدعاء للفرط في الصلاة عليه',
        'func58': 'حصن المسلم من أذكار الكتاب والسنة (58) دعاء التعزية',
        'func59': 'حصن المسلم من أذكار الكتاب والسنة (59) الدعاء عند إدخال الميت القبر',
        'func6': 'حصن المسلم من أذكار الكتاب والسنة (6) ما يقول إذا وضع ثوبه',
        'func60': 'حصن المسلم من أذكار الكتاب والسنة (60) الدعاء بعد دفن الميت',
        'func61': 'حصن المسلم من أذكار الكتاب والسنة (61) دعاء زيارة القبور',
        'func62': 'حصن المسلم من أذكار الكتاب والسنة (62) دعاء الريح',
        'func63': 'حصن المسلم من أذكار الكتاب والسنة (63) دعاء الرعد',
        'func64': 'حصن المسلم من أذكار الكتاب والسنة (64) من أدعية الاستسقاء',
        'func65': 'حصن المسلم من أذكار الكتاب والسنة (65) الدعاء إذا نزل المطر',
        'func66': 'حصن المسلم من أذكار الكتاب والسنة (66) الذكر بعد نزول المطر',
        'func67': 'حصن المسلم من أذكار الكتاب والسنة (67) من أدعية الاستصحاء',
        'func68': 'حصن المسلم من أذكار الكتاب والسنة (68) دعاء رؤية الهلال',
        'func69': 'حصن المسلم من أذكار الكتاب والسنة (69) الدعاء عند إفطار الصائم',
        'func7': 'حصن المسلم من أذكار الكتاب والسنة (7) دعاء دخول الخلاء',
        'func70': 'حصن المسلم من أذكار الكتاب والسنة (70) الدعاء قبل الطعام',
        'func71': 'حصن المسلم من أذكار الكتاب والسنة (71) الدعاء عند الفراغ من الطعام',
        'func72': 'حصن المسلم من أذكار الكتاب والسنة (72) دعاء الضيف لصاحب الطعام',
        'func73': 'حصن المسلم من أذكار الكتاب والسنة (73) الدعاء لمن سقاه أو إذا أراد ذلك',
        'func74': 'حصن المسلم من أذكار الكتاب والسنة (74) الدعاء إذا أفطر عند أهل بيت',
        'func75': 'حصن المسلم من أذكار الكتاب والسنة (75) دعاء الصائم إذا حضر الطعام ولم يفطر',
        'func76': 'حصن المسلم من أذكار الكتاب والسنة (76) ما يقول الصائم إذا سابه أحد',
        'func77': 'حصن المسلم من أذكار الكتاب والسنة (77) الدعاء عند رؤية باكورة الثمر',
        'func78': 'حصن المسلم من أذكار الكتاب والسنة (78) دعاء العطاس',
        'func79': 'حصن المسلم من أذكار الكتاب والسنة (79) ما يقال للكافر إذا عطس فحمد الله',
        'func8': 'حصن المسلم من أذكار الكتاب والسنة (8) دعاء الخروج من الخلاء',
        'func80': 'حصن المسلم من أذكار الكتاب والسنة (80) الدعاء للمتزوج',
        'func81': 'حصن المسلم من أذكار الكتاب والسنة (81) دعاء المتزوج وشراء الدابة',
        'func82': 'حصن المسلم من أذكار الكتاب والسنة (82) الدعاء قبل إتيان الزوجة',
        'func83': 'حصن المسلم من أذكار الكتاب والسنة (83) دعاء الغضب',
        'func84': 'حصن المسلم من أذكار الكتاب والسنة (84) دعاء من رأى مبتلى',
        'func85': 'حصن المسلم من أذكار الكتاب والسنة (85) ما يقال في المجلس',
        'func86': 'حصن المسلم من أذكار الكتاب والسنة (86) كفارة المجلس',
        'func87': 'حصن المسلم من أذكار الكتاب والسنة (87) الدعاء لمن قال غفر الله لك',
        'func88': 'حصن المسلم من أذكار الكتاب والسنة (88) الدعاء لمن صنع إليك معروفا',
        'func89': 'حصن المسلم من أذكار الكتاب والسنة (89) ما يعصم الله به من الدجال',
        'func9': 'حصن المسلم من أذكار الكتاب والسنة (9) الذكر قبل الوضوء',
        'func90': 'حصن المسلم من أذكار الكتاب والسنة (90) الدعاء لمن قال إني أحبك في الله',
        'func91': 'حصن المسلم من أذكار الكتاب والسنة (91) الدعاء لمن عرض عليك ماله',
        'func92': 'حصن المسلم من أذكار الكتاب والسنة (92) الدعاء لمن أقرض عند القضاء',
        'func93': 'حصن المسلم من أذكار الكتاب والسنة (93) دعاء الخوف من الشرك',
        'func94': 'حصن المسلم من أذكار الكتاب والسنة (94) الدعاء لمن قال بارك الله فيك',
        'func95': 'حصن المسلم من أذكار الكتاب والسنة (95) دعاء كراهية الطيرة',
        'func96': 'حصن المسلم من أذكار الكتاب والسنة (96) دعاء الركوب',
        'func97': 'حصن المسلم من أذكار الكتاب والسنة (97) دعاء السفر',
        'func98': 'حصن المسلم من أذكار الكتاب والسنة (98) دعاء دخول القرية أو البلدة',
        'func99': 'حصن المسلم من أذكار الكتاب والسنة (99) دعاء دخول السوق'
    };

    // Audio file mapping for Hesn Al-Muslim - Only files that actually exist
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
        'func54': 'audios/حصن المسلم من أذكار الكتاب والسنة (54) دعاء من أصيب بمصيبة.mp3',
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
                
                console.log('Button clicked:', buttonId, title);
                
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
                
                console.log('Audio player:', audioPlayer);
                console.log('Audio file:', audioFile);
                
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
                        console.log('Audio can play through');
                        audioPlayer.style.opacity = '1';
                        loadingSpinner.remove();
                        audioPlayer.play().catch(e => console.log('Play failed:', e));
                    };
                    
                    audioPlayer.errorHandler = function(e) {
                        console.log('Audio error:', e);
                        console.log(`Audio file not found: ${audioFile}`);
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
                    console.log('Audio player or file not found');
                    if (!audioPlayer) console.log('Audio player element not found');
                    if (!audioFile) console.log('Audio file not found for button:', buttonId);
                }
            });
        } else {
            console.log('Button not found:', buttonId);
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
    document.getElementById('hadithSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchHadith();
        }
    });

    // Add hover effects for library cards
    const libraryCards = document.querySelectorAll('.library-card');
    libraryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add loading animation for video iframes
    const videoIframes = document.querySelectorAll('.video-container iframe');
    videoIframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        iframe.style.opacity = '0';
        iframe.style.transition = 'opacity 0.5s ease';
    });

    // Add loading animation for tafsir iframe
    const tafsirIframe = document.querySelector('.tafsir-iframe');
    if (tafsirIframe) {
        tafsirIframe.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        tafsirIframe.style.opacity = '0';
        tafsirIframe.style.transition = 'opacity 0.5s ease';
    }

    // Add active state styling for hesn buttons
    const style = document.createElement('style');
    style.textContent = `
        .hesn-btn.active {
            background: rgba(255,255,255,0.3) !important;
            border-color: #ffd700 !important;
            color: #ffd700 !important;
        }
    `;
    document.head.appendChild(style);
}); 