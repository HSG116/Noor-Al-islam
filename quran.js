document.addEventListener("DOMContentLoaded", function () {
    // عناصر القرآن الكريم
    const surahSearch = document.getElementById('surah-search');
    const surahSelect = document.getElementById('surah-select');
    const quranText = document.getElementById('quran-text');
    const pageInfo = document.getElementById('page-info');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const reciterSelect = document.getElementById('reciter-select');
    const quranAudio = document.getElementById('quran-audio');
    
    // متغيرات عامة
    let currentSurah = 1;
    let currentPage = 1;
    let totalPages = 1;
    let quranData = null;
    let surahs = [];
    
    // قائمة السور الكاملة
    const surahNames = [
        {number: 1, name: "الفاتحة", ayahs: 7},
        {number: 2, name: "البقرة", ayahs: 286},
        {number: 3, name: "آل عمران", ayahs: 200},
        {number: 4, name: "النساء", ayahs: 176},
        {number: 5, name: "المائدة", ayahs: 120},
        {number: 6, name: "الأنعام", ayahs: 165},
        {number: 7, name: "الأعراف", ayahs: 206},
        {number: 8, name: "الأنفال", ayahs: 75},
        {number: 9, name: "التوبة", ayahs: 129},
        {number: 10, name: "يونس", ayahs: 109},
        {number: 11, name: "هود", ayahs: 123},
        {number: 12, name: "يوسف", ayahs: 111},
        {number: 13, name: "الرعد", ayahs: 43},
        {number: 14, name: "إبراهيم", ayahs: 52},
        {number: 15, name: "الحجر", ayahs: 99},
        {number: 16, name: "النحل", ayahs: 128},
        {number: 17, name: "الإسراء", ayahs: 111},
        {number: 18, name: "الكهف", ayahs: 110},
        {number: 19, name: "مريم", ayahs: 98},
        {number: 20, name: "طه", ayahs: 135},
        {number: 21, name: "الأنبياء", ayahs: 112},
        {number: 22, name: "الحج", ayahs: 78},
        {number: 23, name: "المؤمنون", ayahs: 118},
        {number: 24, name: "النور", ayahs: 64},
        {number: 25, name: "الفرقان", ayahs: 77},
        {number: 26, name: "الشعراء", ayahs: 227},
        {number: 27, name: "النمل", ayahs: 93},
        {number: 28, name: "القصص", ayahs: 88},
        {number: 29, name: "العنكبوت", ayahs: 69},
        {number: 30, name: "الروم", ayahs: 60},
        {number: 31, name: "لقمان", ayahs: 34},
        {number: 32, name: "السجدة", ayahs: 30},
        {number: 33, name: "الأحزاب", ayahs: 73},
        {number: 34, name: "سبأ", ayahs: 54},
        {number: 35, name: "فاطر", ayahs: 45},
        {number: 36, name: "يس", ayahs: 83},
        {number: 37, name: "الصافات", ayahs: 182},
        {number: 38, name: "ص", ayahs: 88},
        {number: 39, name: "الزمر", ayahs: 75},
        {number: 40, name: "غافر", ayahs: 85},
        {number: 41, name: "فصلت", ayahs: 54},
        {number: 42, name: "الشورى", ayahs: 53},
        {number: 43, name: "الزخرف", ayahs: 89},
        {number: 44, name: "الدخان", ayahs: 59},
        {number: 45, name: "الجاثية", ayahs: 37},
        {number: 46, name: "الأحقاف", ayahs: 35},
        {number: 47, name: "محمد", ayahs: 38},
        {number: 48, name: "الفتح", ayahs: 29},
        {number: 49, name: "الحجرات", ayahs: 18},
        {number: 50, name: "ق", ayahs: 45},
        {number: 51, name: "الذاريات", ayahs: 60},
        {number: 52, name: "الطور", ayahs: 49},
        {number: 53, name: "النجم", ayahs: 62},
        {number: 54, name: "القمر", ayahs: 55},
        {number: 55, name: "الرحمن", ayahs: 78},
        {number: 56, name: "الواقعة", ayahs: 96},
        {number: 57, name: "الحديد", ayahs: 29},
        {number: 58, name: "المجادلة", ayahs: 22},
        {number: 59, name: "الحشر", ayahs: 24},
        {number: 60, name: "الممتحنة", ayahs: 13},
        {number: 61, name: "الصف", ayahs: 14},
        {number: 62, name: "الجمعة", ayahs: 11},
        {number: 63, name: "المنافقون", ayahs: 11},
        {number: 64, name: "التغابن", ayahs: 18},
        {number: 65, name: "الطلاق", ayahs: 12},
        {number: 66, name: "التحريم", ayahs: 12},
        {number: 67, name: "الملك", ayahs: 30},
        {number: 68, name: "القلم", ayahs: 52},
        {number: 69, name: "الحاقة", ayahs: 52},
        {number: 70, name: "المعارج", ayahs: 44},
        {number: 71, name: "نوح", ayahs: 28},
        {number: 72, name: "الجن", ayahs: 28},
        {number: 73, name: "المزمل", ayahs: 20},
        {number: 74, name: "المدثر", ayahs: 56},
        {number: 75, name: "القيامة", ayahs: 40},
        {number: 76, name: "الإنسان", ayahs: 31},
        {number: 77, name: "المرسلات", ayahs: 50},
        {number: 78, name: "النبأ", ayahs: 40},
        {number: 79, name: "النازعات", ayahs: 46},
        {number: 80, name: "عبس", ayahs: 42},
        {number: 81, name: "التكوير", ayahs: 29},
        {number: 82, name: "الانفطار", ayahs: 19},
        {number: 83, name: "المطففين", ayahs: 36},
        {number: 84, name: "الانشقاق", ayahs: 25},
        {number: 85, name: "البروج", ayahs: 22},
        {number: 86, name: "الطارق", ayahs: 17},
        {number: 87, name: "الأعلى", ayahs: 19},
        {number: 88, name: "الغاشية", ayahs: 26},
        {number: 89, name: "الفجر", ayahs: 30},
        {number: 90, name: "البلد", ayahs: 20},
        {number: 91, name: "الشمس", ayahs: 15},
        {number: 92, name: "الليل", ayahs: 21},
        {number: 93, name: "الضحى", ayahs: 11},
        {number: 94, name: "الشرح", ayahs: 8},
        {number: 95, name: "التين", ayahs: 8},
        {number: 96, name: "العلق", ayahs: 19},
        {number: 97, name: "القدر", ayahs: 5},
        {number: 98, name: "البينة", ayahs: 8},
        {number: 99, name: "الزلزلة", ayahs: 8},
        {number: 100, name: "العاديات", ayahs: 11},
        {number: 101, name: "القارعة", ayahs: 11},
        {number: 102, name: "التكاثر", ayahs: 8},
        {number: 103, name: "العصر", ayahs: 3},
        {number: 104, name: "الهمزة", ayahs: 9},
        {number: 105, name: "الفيل", ayahs: 5},
        {number: 106, name: "قريش", ayahs: 4},
        {number: 107, name: "الماعون", ayahs: 7},
        {number: 108, name: "الكوثر", ayahs: 3},
        {number: 109, name: "الكافرون", ayahs: 6},
        {number: 110, name: "النصر", ayahs: 3},
        {number: 111, name: "المسد", ayahs: 5},
        {number: 112, name: "الإخلاص", ayahs: 4},
        {number: 113, name: "الفلق", ayahs: 5},
        {number: 114, name: "الناس", ayahs: 6}
    ];
    
    // إضافة السور إلى قائمة الاختيار
    function populateSurahSelect() {
        surahSelect.innerHTML = '<option value="">اختر سورة...</option>';
        
        surahNames.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.name}`;
            surahSelect.appendChild(option);
        });
    }
    
    // جلب بيانات السورة من API
    async function fetchSurah(surahNumber) {
        try {
            showLoading(true);
            const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.asad`);
            const data = await response.json();
            
            if (data.code === 200) {
                quranData = data.data;
                totalPages = Math.ceil(quranData.ayahs.length / 10); // 10 آيات في كل صفحة
                currentPage = 1;
                displayQuranPage();
                
                // تحديث معلومات الصوت
                updateAudioSource(surahNumber);
            } else {
                showError("حدث خطأ في جلب بيانات السورة");
            }
        } catch (error) {
            console.error("خطأ في جلب بيانات السورة:", error);
            showError("تعذر الاتصال بخدمة القرآن الكريم");
        } finally {
            showLoading(false);
        }
    }
    
    // عرض صفحة من القرآن
    function displayQuranPage() {
        if (!quranData) return;
        
        const startIdx = (currentPage - 1) * 10;
        const endIdx = Math.min(startIdx + 10, quranData.ayahs.length);
        
        let html = '';
        
        // إضافة اسم السورة فقط
        if (currentPage === 1) {
            html += `<div class="surah-header">سورة ${quranData.name}</div>`;
        }
        
        // إضافة الآيات
        for (let i = startIdx; i < endIdx; i++) {
            const ayah = quranData.ayahs[i];
            html += `<p>${ayah.text} ﴿${ayah.numberInSurah}﴾</p>`;
        }
        
        quranText.innerHTML = html;
        pageInfo.textContent = `الصفحة ${currentPage} من ${totalPages}`;
        
        // تحديث حالة أزرار التنقل
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }
    
    // تحديث مصدر الصوت
    async function updateAudioSource(surahNumber) {
        try {
            const reciterId = reciterSelect.value;
            
            // تحديث واجهة المستخدم
            quranAudio.src = '';
            quranAudio.load();
            
            // جلب بيانات التلاوة من API
            const response = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciterId}/${surahNumber}`);
            
            if (!response.ok) {
                throw new Error('فشل في الاتصال بخدمة التلاوة');
            }
            
            const data = await response.json();
            
            if (data && data.audio_file && data.audio_file.audio_url) {
                // تحديث مصدر الصوت
                quranAudio.src = data.audio_file.audio_url;
                quranAudio.load();
            } else {
                throw new Error('تنسيق البيانات غير صحيح');
            }
        } catch (error) {
            console.error('خطأ في جلب التلاوة:', error);
            // استخدام المصدر البديل في حالة الفشل
            useFallbackAudioSource(surahNumber);
        }
    }
    
    // استخدام مصدر صوت بديل في حالة فشل API
    function useFallbackAudioSource(surahNumber) {
        const reciter = reciterSelect.value;
        let reciterId = '';
        
        switch (reciter) {
            case '7':
                reciterId = 'Alafasy';
                break;
            case '3':
                reciterId = 'Abdurrahmaan_As-Sudais';
                break;
            case '9':
                reciterId = 'Minshawy_Murattal';
                break;
            case '5':
                reciterId = 'Husary';
                break;
            default:
                reciterId = 'Alafasy';
        }
        
        // تنسيق رقم السورة بحيث يكون ثلاثة أرقام (مثلاً: 001، 012، 114)
        const formattedSurahNumber = surahNumber.toString().padStart(3, '0');
        
        // تحديث مصدر الصوت
        quranAudio.src = `https://download.quranicaudio.com/quran/${reciterId}/${formattedSurahNumber}.mp3`;
        quranAudio.load();
    }
    
    // البحث عن سورة
    function searchSurah(query) {
        if (!query) return;
        
        query = query.trim().toLowerCase();
        
        // البحث في أسماء السور
        const foundSurah = surahNames.find(surah => 
            surah.name.toLowerCase().includes(query) || 
            surah.number.toString() === query
        );
        
        if (foundSurah) {
            surahSelect.value = foundSurah.number;
            fetchSurah(foundSurah.number);
        } else {
            showError("لم يتم العثور على السورة");
        }
    }
    
    // إظهار رسالة خطأ
    function showError(message) {
        quranText.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
    }
    
    // إظهار مؤشر التحميل
    function showLoading(show) {
        if (show) {
            quranText.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري التحميل...</div>';
        }
    }
    
    // إعداد أحداث النقر
    function setupEventListeners() {
        // حدث تغيير السورة
        surahSelect.addEventListener('change', function() {
            const surahNumber = this.value;
            if (surahNumber) {
                fetchSurah(surahNumber);
            }
        });
        
        // حدث البحث
        surahSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchSurah(this.value);
            }
        });
        
        // أزرار التنقل بين الصفحات
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayQuranPage();
            }
        });
        
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                displayQuranPage();
            }
        });
        
        // تغيير القارئ
        reciterSelect.addEventListener('change', function() {
            if (quranData) {
                updateAudioSource(quranData.number);
            }
        });
        
        // زر تشغيل السورة
        const playButton = document.getElementById('play-surah');
        if (playButton) {
            playButton.addEventListener('click', function() {
                if (quranData) {
                    quranAudio.play().catch(error => {
                        console.error('خطأ في تشغيل التلاوة:', error);
                    });
                }
            });
        }
    }
    
    // تهيئة القسم
    function init() {
        populateSurahSelect();
        setupEventListeners();
        
        // تحميل سورة الفاتحة افتراضيًا
        fetchSurah(1);
    }
    
    // بدء التشغيل
    init();
});
