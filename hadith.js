document.addEventListener("DOMContentLoaded", function () {
    // عناصر واجهة المستخدم
    const hadithSearchInput = document.getElementById('hadith-search-input');
    const hadithSearchBtn = document.getElementById('hadith-search-btn');
    const hadithCollection = document.getElementById('hadith-collection');
    const hadithContent = document.getElementById('hadith-content');
    const prevHadithPageBtn = document.getElementById('prev-hadith-page');
    const nextHadithPageBtn = document.getElementById('next-hadith-page');
    const hadithPageInfo = document.getElementById('hadith-page-info');
    
    // متغيرات عامة
    let currentPage = 1;
    let totalPages = 1;
    let currentCollection = 'abu-dawud';
    let searchQuery = '';
    let hadithsPerPage = 10;
    let allHadiths = [];
    
    // تهيئة القسم
    function init() {
        // تحميل الأحاديث عند فتح الصفحة
        fetchHadiths();
        
        // إضافة أحداث النقر
        setupEventListeners();
    }
    
    // إعداد أحداث النقر
    function setupEventListeners() {
        // حدث البحث
        hadithSearchBtn.addEventListener('click', function() {
            searchQuery = hadithSearchInput.value.trim();
            currentPage = 1;
            fetchHadiths();
        });
        
        hadithSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchQuery = hadithSearchInput.value.trim();
                currentPage = 1;
                fetchHadiths();
            }
        });
        
        // حدث تغيير مجموعة الأحاديث
        hadithCollection.addEventListener('change', function() {
            currentCollection = this.value;
            currentPage = 1;
            searchQuery = '';
            hadithSearchInput.value = '';
            fetchHadiths();
        });
        
        // أزرار التنقل بين الصفحات
        prevHadithPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayHadiths();
                updatePaginationInfo();
            }
        });
        
        nextHadithPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                displayHadiths();
                updatePaginationInfo();
            }
        });
    }
    
    // جلب الأحاديث من API
    async function fetchHadiths() {
        showLoading(true);
        
        try {
            // بناء رابط API
            let apiUrl = `https://hadis-api-id.vercel.app/hadith/${currentCollection}?page=2&limit=300`;
            
            // جلب البيانات من API
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('فشل في الاتصال بخدمة الأحاديث');
            }
            
            const data = await response.json();
            
            if (data && data.items && Array.isArray(data.items)) {
                // تخزين جميع الأحاديث
                allHadiths = data.items;
                
                // تصفية الأحاديث حسب البحث إذا كان هناك استعلام بحث
                if (searchQuery) {
                    allHadiths = allHadiths.filter(hadith => 
                        hadith.arab.includes(searchQuery) || 
                        (hadith.id && hadith.id.toString().includes(searchQuery))
                    );
                }
                
                // حساب عدد الصفحات
                totalPages = Math.ceil(allHadiths.length / hadithsPerPage);
                
                // عرض الأحاديث
                displayHadiths();
                updatePaginationInfo();
            } else {
                throw new Error('تنسيق البيانات غير صحيح');
            }
        } catch (error) {
            console.error('خطأ في جلب الأحاديث:', error);
            showError('تعذر تحميل الأحاديث. يرجى المحاولة مرة أخرى لاحقًا.');
        } finally {
            showLoading(false);
        }
    }
    
    // عرض الأحاديث في الصفحة الحالية
    function displayHadiths() {
        if (allHadiths.length === 0) {
            hadithContent.innerHTML = '<div class="no-results">لم يتم العثور على أحاديث</div>';
            return;
        }
        
        // حساب الأحاديث التي سيتم عرضها في الصفحة الحالية
        const startIdx = (currentPage - 1) * hadithsPerPage;
        const endIdx = Math.min(startIdx + hadithsPerPage, allHadiths.length);
        const currentHadiths = allHadiths.slice(startIdx, endIdx);
        
        // إنشاء HTML للأحاديث
        let html = '';
        
        currentHadiths.forEach(hadith => {
            html += `
                <div class="hadith-item">
                    <span class="hadith-number">حديث رقم ${hadith.number}</span>
                    <div class="hadith-text">${hadith.arab}</div>
                    <div class="hadith-narrator">${hadith.narrator || ''}</div>
                </div>
            `;
        });
        
        hadithContent.innerHTML = html;
        
        // تحديث حالة أزرار التنقل
        prevHadithPageBtn.disabled = currentPage === 1;
        nextHadithPageBtn.disabled = currentPage === totalPages;
    }
    
    // تحديث معلومات الصفحات
    function updatePaginationInfo() {
        hadithPageInfo.textContent = `الصفحة ${currentPage} من ${totalPages}`;
    }
    
    // إظهار رسالة خطأ
    function showError(message) {
        hadithContent.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
    }
    
    // إظهار مؤشر التحميل
    function showLoading(show) {
        if (show) {
            hadithContent.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> جاري تحميل الأحاديث...</div>';
        }
    }
    
    // بدء التشغيل
    init();
});
