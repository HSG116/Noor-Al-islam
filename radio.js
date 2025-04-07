document.addEventListener("DOMContentLoaded", function () {
    // عناصر واجهة المستخدم
    const radioSearchInput = document.getElementById('radio-search-input');
    const radioStationsContainer = document.getElementById('radio-stations-container');
    const currentStationName = document.getElementById('current-station-name');
    const currentStationDesc = document.getElementById('current-station-desc');
    const radioPlayBtn = document.getElementById('radio-play-btn');
    const radioStopBtn = document.getElementById('radio-stop-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const radioAudio = document.getElementById('radio-audio');
    
    // متغيرات عامة
    let allStations = [];
    let currentStation = null;
    let isPlaying = false;
    let searchQuery = '';
    
    // تهيئة القسم
    function init() {
        // تحميل الإذاعات من API
        fetchRadioStations();
        
        // إضافة أحداث النقر
        setupEventListeners();
    }
    
    // إعداد أحداث النقر
    function setupEventListeners() {
        // حدث البحث
        radioSearchInput.addEventListener('input', function() {
            searchQuery = this.value.trim();
            filterStations();
        });
        
        // زر التشغيل
        radioPlayBtn.addEventListener('click', function() {
            if (currentStation) {
                playStation();
            }
        });
        
        // زر الإيقاف
        radioStopBtn.addEventListener('click', function() {
            stopStation();
        });
        
        // التحكم في مستوى الصوت
        volumeSlider.addEventListener('input', function() {
            radioAudio.volume = this.value / 100;
        });
        
        // أحداث الصوت
        radioAudio.addEventListener('play', function() {
            isPlaying = true;
            updatePlayerUI();
        });
        
        radioAudio.addEventListener('pause', function() {
            isPlaying = false;
            updatePlayerUI();
        });
        
        radioAudio.addEventListener('error', function() {
            showError('تعذر تشغيل الإذاعة. يرجى المحاولة مرة أخرى لاحقًا.');
            stopStation();
        });
    }
    
    // جلب الإذاعات من API
    async function fetchRadioStations() {
        try {
            showLoading(true);
            
            // استخدام API أكثر موثوقية للإذاعات الإسلامية
            const response = await fetch('https://api.mp3quran.net/radios/radio_arabic.json');
            
            if (!response.ok) {
                throw new Error('فشل في الاتصال بخدمة الإذاعات');
            }
            
            const data = await response.json();
            
            if (data && Array.isArray(data.radios)) {
                // تخزين جميع الإذاعات
                allStations = data.radios.map((radio, index) => ({
                    id: index + 1,
                    name: radio.name,
                    description: radio.description || 'إذاعة إسلامية',
                    radio_url: radio.radio_url
                }));
                
                // عرض الإذاعات
                displayStations(allStations);
            } else {
                // استخدام قائمة احتياطية من الإذاعات في حالة فشل API
                useFallbackRadioStations();
            }
        } catch (error) {
            console.error('خطأ في جلب الإذاعات:', error);
            // استخدام قائمة احتياطية من الإذاعات في حالة فشل API
            useFallbackRadioStations();
        } finally {
            showLoading(false);
        }
    }
    
    // استخدام قائمة احتياطية من الإذاعات
    function useFallbackRadioStations() {
        // قائمة احتياطية من الإذاعات الإسلامية
        const fallbackStations = [
            {
                id: 1,
                name: 'إذاعة القرآن الكريم من مكة',
                description: 'بث مباشر من المسجد الحرام',
                radio_url: 'https://stream.radiojar.com/0tpy1h0kxtzuv'
            },
            {
                id: 2,
                name: 'إذاعة القرآن الكريم من المدينة',
                description: 'بث مباشر من المسجد النبوي',
                radio_url: 'https://stream.radiojar.com/4wqre23fytzuv'
            },
            {
                id: 3,
                name: 'إذاعة القرآن الكريم السعودية',
                description: 'إذاعة القرآن الكريم من المملكة العربية السعودية',
                radio_url: 'https://stream.radiojar.com/0tpy1h0kxtzuv'
            },
            {
                id: 4,
                name: 'إذاعة القرآن الكريم المصرية',
                description: 'إذاعة القرآن الكريم من جمهورية مصر العربية',
                radio_url: 'https://stream.radiojar.com/8s5u5tpdtwzuv'
            },
            {
                id: 5,
                name: 'إذاعة تلاوات خاشعة',
                description: 'تلاوات متنوعة لكبار القراء',
                radio_url: 'https://server03.quran.com.kw:7000/stream'
            }
        ];
        
        // تخزين الإذاعات الاحتياطية
        allStations = fallbackStations;
        
        // عرض الإذاعات
        displayStations(allStations);
        
        // إظهار رسالة تنبيه
        showError('تم استخدام قائمة احتياطية من الإذاعات بسبب تعذر الاتصال بالخادم');
    }
    
    // عرض الإذاعات
    function displayStations(stations) {
        if (stations.length === 0) {
            radioStationsContainer.innerHTML = '<div class="no-results">لم يتم العثور على إذاعات</div>';
            return;
        }
        
        // إنشاء HTML للإذاعات
        let html = '';
        
        stations.forEach(station => {
            html += `
                <div class="radio-station" data-url="${station.radio_url}" data-id="${station.id}">
                    <div class="station-logo">
                        <i class="fas fa-broadcast-tower"></i>
                    </div>
                    <div class="station-name">${station.name}</div>
                    <div class="station-desc">${station.description || 'إذاعة إسلامية'}</div>
                </div>
            `;
        });
        
        radioStationsContainer.innerHTML = html;
        
        // إضافة أحداث النقر للإذاعات
        const stationElements = document.querySelectorAll('.radio-station');
        stationElements.forEach(element => {
            element.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع الإذاعات
                stationElements.forEach(el => el.classList.remove('active'));
                
                // إضافة الفئة النشطة للإذاعة المحددة
                this.classList.add('active');
                
                // تحديث الإذاعة الحالية
                const stationId = this.dataset.id;
                currentStation = allStations.find(station => station.id.toString() === stationId);
                
                // تحديث واجهة المستخدم
                updateStationInfo();
                
                // تمكين زر التشغيل
                radioPlayBtn.disabled = false;
                radioStopBtn.disabled = false;
                
                // تشغيل الإذاعة تلقائيًا
                playStation();
            });
        });
    }
    
    // تصفية الإذاعات حسب البحث
    function filterStations() {
        if (!searchQuery) {
            displayStations(allStations);
            return;
        }
        
        // تصفية الإذاعات حسب البحث
        const filteredStations = allStations.filter(station => 
            station.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (station.description && station.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        
        // عرض الإذاعات المصفاة
        displayStations(filteredStations);
    }
    
    // تشغيل الإذاعة
    function playStation() {
        if (!currentStation) return;
        
        // تعيين مصدر الصوت
        radioAudio.src = currentStation.radio_url;
        
        // تعيين مستوى الصوت
        radioAudio.volume = volumeSlider.value / 100;
        
        // تشغيل الصوت
        radioAudio.play()
            .catch(error => {
                console.error('خطأ في تشغيل الإذاعة:', error);
                showError('تعذر تشغيل الإذاعة. يرجى المحاولة مرة أخرى لاحقًا.');
            });
    }
    
    // إيقاف الإذاعة
    function stopStation() {
        radioAudio.pause();
        radioAudio.src = '';
        isPlaying = false;
        updatePlayerUI();
    }
    
    // تحديث معلومات الإذاعة
    function updateStationInfo() {
        if (currentStation) {
            currentStationName.textContent = currentStation.name;
            currentStationDesc.textContent = currentStation.description || 'إذاعة إسلامية';
        } else {
            currentStationName.textContent = 'لم يتم اختيار محطة';
            currentStationDesc.textContent = '';
        }
    }
    
    // تحديث واجهة المستخدم للمشغل
    function updatePlayerUI() {
        if (isPlaying) {
            radioPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
            radioPlayBtn.title = 'إيقاف مؤقت';
        } else {
            radioPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
            radioPlayBtn.title = 'تشغيل';
        }
    }
    
    // إظهار رسالة خطأ
    function showError(message) {
        radioStationsContainer.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
    }
    
    // إظهار مؤشر التحميل
    function showLoading(show) {
        if (show) {
            radioStationsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل الإذاعات...</div>';
        }
    }
    
    // بدء التشغيل
    init();
});
