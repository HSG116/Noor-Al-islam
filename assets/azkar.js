document.addEventListener("DOMContentLoaded", function () {
    // عناصر واجهة المستخدم
    const azkarSearchInput = document.getElementById('azkar-search-input');
    const azkarCategorySelect = document.getElementById('azkar-category-select');
    const azkarButtons = document.querySelectorAll('.azkar-btn');
    const azkarContent = document.getElementById('azkar-content');
    
    // متغيرات عامة
    let allAzkar = {};
    let currentCategory = 'morning';
    let searchQuery = '';
    
    // تهيئة القسم
    function init() {
        // تحميل الأذكار من API
        fetchAzkarCategories();
        
        // إضافة أحداث النقر
        setupEventListeners();
        
        // عرض أذكار الصباح افتراضيًا
        loadDefaultAzkar();
    }
    
    // إعداد أحداث النقر
    function setupEventListeners() {
        // حدث البحث
        azkarSearchInput.addEventListener('input', function() {
            searchQuery = this.value.trim();
            filterAzkar();
        });
        
        // حدث تغيير التصنيف
        azkarCategorySelect.addEventListener('change', function() {
            if (this.value) {
                fetchAzkarByCategory(this.value);
                
                // إزالة التحديد من الأزرار
                azkarButtons.forEach(btn => btn.classList.remove('active'));
            }
        });
        
        // أزرار الأذكار
        azkarButtons.forEach(button => {
            button.addEventListener('click', function() {
                // تحديث الفئة النشطة
                azkarButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // تحديث التصنيف الحالي
                currentCategory = this.dataset.type;
                
                // إعادة تعيين التصنيف المنسدل
                azkarCategorySelect.value = '';
                
                // عرض الأذكار
                displayDefaultAzkar(currentCategory);
            });
        });
    }
    
    // تعديل دالة جلب تصنيفات الأذكار
    async function fetchAzkarCategories() {
        try {
            // استخدام البيانات المحلية بدلاً من API
            const categories = [
                { ID: 'morning', TITLE: 'أذكار الصباح' },
                { ID: 'evening', TITLE: 'أذكار المساء' },
                { ID: 'sleep', TITLE: 'أذكار النوم' },
                { ID: 'duas', TITLE: 'أدعية مختارة' }
            ];
            
            populateCategoriesDropdown(categories);
        } catch (error) {
            console.error('خطأ في تحميل التصنيفات:', error);
            showError('تعذر تحميل التصنيفات');
        }
    }
    
    // إضافة التصنيفات إلى القائمة المنسدلة
    function populateCategoriesDropdown(categories) {
        // إفراغ القائمة المنسدلة
        azkarCategorySelect.innerHTML = '<option value="">اختر تصنيف الأذكار...</option>';
        
        // إضافة التصنيفات
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.ID;
            option.textContent = category.TITLE;
            azkarCategorySelect.appendChild(option);
        });
    }
    
    // جلب الأذكار حسب التصنيف
    async function fetchAzkarByCategory(categoryId) {
        try {
            showLoading(true);
            
            // جلب البيانات من API
            const response = await fetch(`https://www.hisnmuslim.com/api/ar/${categoryId}.json`);
            
            if (!response.ok) {
                throw new Error('فشل في الاتصال بخدمة الأذكار');
            }
            
            const data = await response.json();
            
            if (data && data[categoryId] && Array.isArray(data[categoryId])) {
                // عرض الأذكار
                displayAzkar(data[categoryId]);
            } else {
                throw new Error('تنسيق البيانات غير صحيح');
            }
        } catch (error) {
            console.error('خطأ في جلب الأذكار:', error);
            showError('تعذر تحميل الأذكار. يرجى المحاولة مرة أخرى لاحقًا.');
        } finally {
            showLoading(false);
        }
    }
    
    // تحسين دالة عرض الأذكار
    function displayAzkar(azkar) {
        try {
            if (!Array.isArray(azkar) || azkar.length === 0) {
                azkarContent.innerHTML = '<div class="no-results">لا توجد أذكار متاحة</div>';
                return;
            }

            const html = azkar.map(zikr => `
                <div class="azkar-item animate-fade-in">
                    <div class="azkar-text">${zikr.ARABIC_TEXT || zikr}</div>
                    ${zikr.REPEAT_COUNT ? `
                        <div class="azkar-info">
                            <span class="azkar-count">التكرار: ${zikr.REPEAT_COUNT}</span>
                            ${zikr.REFERENCE ? `<span class="azkar-source">${zikr.REFERENCE}</span>` : ''}
                        </div>
                    ` : ''}
                </div>
            `).join('');

            azkarContent.innerHTML = html;
        } catch (error) {
            console.error('خطأ في عرض الأذكار:', error);
            showError('حدث خطأ أثناء عرض الأذكار');
        }
    }
    
    // تحسين دالة البحث
    function filterAzkar() {
        try {
            if (!searchQuery) {
                displayDefaultAzkar(currentCategory);
                return;
            }

            const azkarItems = document.querySelectorAll('.azkar-item');
            let foundItems = 0;

            azkarItems.forEach(item => {
                const text = item.querySelector('.azkar-text').textContent.toLowerCase();
                const isMatch = text.includes(searchQuery.toLowerCase());
                
                item.style.display = isMatch ? 'block' : 'none';
                if (isMatch) foundItems++;
            });

            if (foundItems === 0) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = 'لم يتم العثور على نتائج للبحث';
                azkarContent.appendChild(noResults);
            }
        } catch (error) {
            console.error('خطأ في البحث:', error);
            showError('حدث خطأ أثناء البحث');
        }
    }
    
    // تعديل دالة تحميل الأذكار الافتراضية
    function loadDefaultAzkar() {
        try {
            // تحديد الزر الأول كنشط
            const firstButton = azkarButtons[0];
            if (firstButton) {
                firstButton.classList.add('active');
                currentCategory = firstButton.dataset.type || 'morning';
            }
            
            // عرض الأذكار
            displayDefaultAzkar(currentCategory);
        } catch (error) {
            console.error('خطأ في تحميل الأذكار:', error);
            showError('تعذر تحميل الأذكار الافتراضية');
        }
    }
    
    // عرض الأذكار الافتراضية
    function displayDefaultAzkar(type) {
        // الأذكار الافتراضية
        const defaultAzkar = {
            morning: [
                "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.",
                "اللهم إني أسألك خير هذا اليوم فتحه، ونصره، ونوره، وبركته، وهداه، وأعوذ بك من شر ما فيه وشر ما بعده.",
                "اللهم أنت ربي، لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليّ، وأبوء بذنبي فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.",
                "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.",
                "اللهم بك أصبحنا، وبك نحيا، وبك نموت، وإليك النشور.",
                "اللهم إني أصبحت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك أنك أنت الله، لا إله إلا أنت، وحدك لا شريك لك، وأن محمداً عبدك ورسولك (ثلاث مرات).",
                "اللهم إني أعوذ بك من الكفر والفقر، وأعوذ بك من عذاب القبر، لا إله إلا أنت.",
                "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت.",
                "رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً ورسولاً (ثلاث مرات).",
                "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم (ثلاث مرات).",
                "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم (سبع مرات).",
                "اللهم إني أسألك العفو والعافية في الدنيا والآخرة.",
                "اللهم إني أسألك خير هذا اليوم وخير ما فيه، وأعوذ بك من شر هذا اليوم وشر ما فيه."
            ],
            evening: [
                "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير.",
                "اللهم إني أسألك خير هذه الليلة فتحها، ونصرها، ونورها، وبركتها، وهداها، وأعوذ بك من شر ما فيها وشر ما بعدها.",
                "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليّ، وأبوء بذنبي فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.",
                "اللهم بك أمسينا، وبك نحيا، وبك نموت، وإليك المصير.",
                "اللهم إني أمسيت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك أنك أنت الله، لا إله إلا أنت، وحدك لا شريك لك، وأن محمداً عبدك ورسولك (ثلاث مرات).",
                "سبحان الله وبحمده (مائة مرة).",
                "اللهم اجعل لي في قلبي نوراً، وفي لساني نوراً، وفي سمعي نوراً، وفي بصري نوراً، ومن فوقي نوراً، ومن تحتي نوراً، وعن يميني نوراً، وعن شمالي نوراً، ومن أمامي نوراً، ومن خلفي نوراً، واجعل لي نوراً.",
                "اللهم فاطر السماوات والأرض، عالم الغيب والشهادة، رب كل شيء ومليكه، أشهد أن لا إله إلا أنت، أعوذ بك من شر نفسي ومن شر الشيطان وشركه.",
                "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم (سبع مرات)."
            ],
            sleep: [
                "باسمك ربي وضعت جنبي، وبك أرفعه، فإن أمسكت نفسي فارحمها، وإن أرسلتها فاحفظها بما تحفظ به عبادك الصالحين.",
                "اللهم قني عذابك يوم تبعث عبادك.",
                "اللهم باسمك أموت وأحيا.",
                "اللهم إني أسلمت نفسي إليك، ووجهت وجهي إليك، وفوضت أمري إليك، وألجأت ظهري إليك، رغبةً ورهبةً إليك، لا ملجأ ولا منجى منك إلا إليك.",
                "اللهم اغفر لي ذنبي، واستر عورتي، وأمن روعتي، واحفظني من بين يدي ومن خلفي، وعن يميني وعن شمالي، وأعوذ بعظمتك أن أغتال من تحتي.",
                "سبحان الله (33 مرة)، الحمد لله (33 مرة)، الله أكبر (34 مرة)."
            ],
            duas: [
                "اللهم اجعل القرآن ربيع قلبي، ونور صدري، وجلاء حزني، وذهاب همي.",
                "اللهم إني أسألك من الخير كله عاجله وآجله، ما علمت منه وما لم أعلم.",
                "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل، والبخل والجبن، وضلع الدين وغلبة الرجال.",
                "اللهم إني أعوذ بك من زوال نعمتك، وتحول عافيتك، وفجاءة نقمتك، وجميع سخطك.",
                "اللهم اغفر لي، واهدني، وارزقني، وعافني.",
                "اللهم أصلح لي ديني الذي هو عصمة أمري، وأصلح لي دنياي التي فيها معاشي، وأصلح لي آخرتي التي فيها معادي.",
                "اللهم أعني على ذكرك وشكرك وحسن عبادتك.",
                "اللهم إني أسألك الجنة وما قرب إليها من قول أو عمل، وأعوذ بك من النار وما قرب إليها من قول أو عمل.",
                "اللهم ارزقني حبك، وحب من يحبك، وحب عمل يقربني إلى حبك.",
                "اللهم صل وسلم وبارك على سيدنا محمد وعلى آله وصحبه أجمعين."
            ]
        };
        
        // إذا كان هناك استعلام بحث
        if (searchQuery) {
            // تصفية الأذكار حسب البحث
            const filteredAzkar = defaultAzkar[type].filter(zikr => 
                zikr.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (filteredAzkar.length === 0) {
                azkarContent.innerHTML = '<div class="no-results">لم يتم العثور على أذكار مطابقة للبحث</div>';
                return;
            }
            
            // عرض الأذكار المصفاة
            azkarContent.innerHTML = filteredAzkar.map(zikr => `
                <div class="azkar-item">
                    <div class="azkar-text">${zikr}</div>
                </div>
            `).join('');
        } else {
            // عرض جميع الأذكار
            azkarContent.innerHTML = defaultAzkar[type].map(zikr => `
                <div class="azkar-item">
                    <div class="azkar-text">${zikr}</div>
                </div>
            `).join('');
        }
    }
    
    // تحسين دالة إظهار الخطأ
    function showError(message) {
        azkarContent.innerHTML = `
            <div class="error-message animate-fade-in">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
                <button onclick="location.reload()" class="retry-btn">
                    <i class="fas fa-redo"></i> إعادة المحاولة
                </button>
            </div>
        `;
    }
    
    // تحسين دالة إظهار التحميل
    function showLoading(show) {
        if (show) {
            azkarContent.innerHTML = `
                <div class="loading-spinner animate-fade-in">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>جاري التحميل...</span>
                </div>
            `;
        }
    }
    
    // بدء التشغيل
    init();
});
