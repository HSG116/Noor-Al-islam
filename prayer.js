document.addEventListener("DOMContentLoaded", function () {
    // عناصر واجهة المستخدم
    const countrySelect = document.getElementById('country-select');
    const citySelect = document.getElementById('city-select');
    const updateButton = document.getElementById('update-prayer-times');
    
    // عناصر عرض أوقات الصلاة
    const prayerTimeElements = {
        fajr: document.getElementById('fajr-time'),
        sunrise: document.getElementById('sunrise-time'),
        dhuhr: document.getElementById('dhuhr-time'),
        asr: document.getElementById('asr-time'),
        maghrib: document.getElementById('maghrib-time'),
        isha: document.getElementById('isha-time')
    };
    
    // عناصر عرض الصلاة القادمة
    const nextPrayerNameElement = document.getElementById('next-prayer-name');
    const remainingTimeElement = document.getElementById('remaining-time');
    
    // قائمة المدن حسب البلد
    const citiesByCountry = {
        'SA': [
            { value: 'Riyadh', text: 'الرياض' },
            { value: 'Jeddah', text: 'جدة' },
            { value: 'Mecca', text: 'مكة المكرمة' },
            { value: 'Medina', text: 'المدينة المنورة' },
            { value: 'Dammam', text: 'الدمام' },
            { value: 'Taif', text: 'الطائف' },
            { value: 'Tabuk', text: 'تبوك' },
            { value: 'Abha', text: 'أبها' }
        ],
        'EG': [
            { value: 'Cairo', text: 'القاهرة' },
            { value: 'Alexandria', text: 'الإسكندرية' },
            { value: 'Giza', text: 'الجيزة' },
            { value: 'Luxor', text: 'الأقصر' },
            { value: 'Aswan', text: 'أسوان' },
            { value: 'Sharm El-Sheikh', text: 'شرم الشيخ' },
            { value: 'Hurghada', text: 'الغردقة' }
        ],
        'AE': [
            { value: 'Dubai', text: 'دبي' },
            { value: 'Abu Dhabi', text: 'أبو ظبي' },
            { value: 'Sharjah', text: 'الشارقة' },
            { value: 'Ajman', text: 'عجمان' },
            { value: 'Fujairah', text: 'الفجيرة' },
            { value: 'Ras Al Khaimah', text: 'رأس الخيمة' }
        ],
        'KW': [
            { value: 'Kuwait City', text: 'مدينة الكويت' },
            { value: 'Al Ahmadi', text: 'الأحمدي' },
            { value: 'Hawalli', text: 'حولي' },
            { value: 'Salmiya', text: 'السالمية' }
        ],
        'QA': [
            { value: 'Doha', text: 'الدوحة' },
            { value: 'Al Rayyan', text: 'الريان' },
            { value: 'Al Wakrah', text: 'الوكرة' },
            { value: 'Al Khor', text: 'الخور' }
        ],
        'BH': [
            { value: 'Manama', text: 'المنامة' },
            { value: 'Riffa', text: 'الرفاع' },
            { value: 'Muharraq', text: 'المحرق' }
        ],
        'OM': [
            { value: 'Muscat', text: 'مسقط' },
            { value: 'Salalah', text: 'صلالة' },
            { value: 'Sohar', text: 'صحار' },
            { value: 'Nizwa', text: 'نزوى' }
        ],
        'JO': [
            { value: 'Amman', text: 'عمان' },
            { value: 'Zarqa', text: 'الزرقاء' },
            { value: 'Irbid', text: 'إربد' },
            { value: 'Aqaba', text: 'العقبة' }
        ],
        'PS': [
            { value: 'Jerusalem', text: 'القدس' },
            { value: 'Gaza', text: 'غزة' },
            { value: 'Ramallah', text: 'رام الله' },
            { value: 'Hebron', text: 'الخليل' },
            { value: 'Nablus', text: 'نابلس' }
        ],
        'LB': [
            { value: 'Beirut', text: 'بيروت' },
            { value: 'Tripoli', text: 'طرابلس' },
            { value: 'Sidon', text: 'صيدا' },
            { value: 'Tyre', text: 'صور' }
        ],
        'SY': [
            { value: 'Damascus', text: 'دمشق' },
            { value: 'Aleppo', text: 'حلب' },
            { value: 'Homs', text: 'حمص' },
            { value: 'Latakia', text: 'اللاذقية' }
        ],
        'IQ': [
            { value: 'Baghdad', text: 'بغداد' },
            { value: 'Basra', text: 'البصرة' },
            { value: 'Mosul', text: 'الموصل' },
            { value: 'Erbil', text: 'أربيل' },
            { value: 'Najaf', text: 'النجف' }
        ],
        'YE': [
            { value: 'Sanaa', text: 'صنعاء' },
            { value: 'Aden', text: 'عدن' },
            { value: 'Taiz', text: 'تعز' },
            { value: 'Hodeidah', text: 'الحديدة' }
        ],
        'MA': [
            { value: 'Rabat', text: 'الرباط' },
            { value: 'Casablanca', text: 'الدار البيضاء' },
            { value: 'Marrakesh', text: 'مراكش' },
            { value: 'Fes', text: 'فاس' },
            { value: 'Tangier', text: 'طنجة' }
        ],
        'DZ': [
            { value: 'Algiers', text: 'الجزائر' },
            { value: 'Oran', text: 'وهران' },
            { value: 'Constantine', text: 'قسنطينة' },
            { value: 'Annaba', text: 'عنابة' }
        ],
        'TN': [
            { value: 'Tunis', text: 'تونس' },
            { value: 'Sfax', text: 'صفاقس' },
            { value: 'Sousse', text: 'سوسة' },
            { value: 'Kairouan', text: 'القيروان' }
        ],
        'LY': [
            { value: 'Tripoli', text: 'طرابلس' },
            { value: 'Benghazi', text: 'بنغازي' },
            { value: 'Misrata', text: 'مصراتة' },
            { value: 'Tobruk', text: 'طبرق' }
        ]
    };

    // تحديث قائمة المدن عند تغيير البلد
    countrySelect.addEventListener('change', function() {
        const country = this.value;
        const cities = citiesByCountry[country] || [];
        
        // إفراغ قائمة المدن
        citySelect.innerHTML = '';
        
        // إضافة المدن الجديدة
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city.value;
            option.textContent = city.text;
            citySelect.appendChild(option);
        });
        
        // تحديث أوقات الصلاة تلقائيًا عند تغيير البلد
        if (cities.length > 0) {
            fetchPrayerTimes(country, cities[0].value);
        }
    });

    // تحديث أوقات الصلاة عند تغيير المدينة
    citySelect.addEventListener('change', function() {
        const country = countrySelect.value;
        const city = this.value;
        fetchPrayerTimes(country, city);
    });

    // تحديث أوقات الصلاة عند النقر على زر التحديث
    updateButton.addEventListener('click', function() {
        showLoading(true);
        fetchPrayerTimes(countrySelect.value, citySelect.value);
    });

    // دالة لإظهار أو إخفاء مؤشر التحميل
    function showLoading(show) {
        updateButton.disabled = show;
        updateButton.innerHTML = show ? '<i class="fas fa-spinner fa-spin"></i> جاري التحديث...' : '<i class="fas fa-sync-alt"></i> تحديث';
        
        if (show) {
            Object.values(prayerTimeElements).forEach(element => {
                element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            });
        }
    }

    // دالة لجلب أوقات الصلاة من API
    async function fetchPrayerTimes(country, city) {
        try {
            showLoading(true);

0            // الحصول على إحداثيات المدينة
            const coordinates = getCityCoordinates(city);
            
            if (!coordinates) {
                throw new Error('لم يتم العثور على إحداثيات المدينة');
            }

            // بناء رابط API الجديد
            const apiUrl = `https://api.pray.zone/v2/times/today.json?city=${encodeURIComponent(city)}&latitude=${coordinates.lat}&longitude=${coordinates.lng}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('فشل في الاتصال بخدمة أوقات الصلاة');
            }

            const data = await response.json();

            if (data.status === 'OK' && data.results && data.results.datetime && data.results.datetime[0]) {
                const times = data.results.datetime[0].times;
                const date = data.results.datetime[0].date;

                // تحديث أوقات الصلاة في الصفحة
                prayerTimeElements.fajr.textContent = formatTime(times.Fajr);
                prayerTimeElements.sunrise.textContent = formatTime(times.Sunrise);
                prayerTimeElements.dhuhr.textContent = formatTime(times.Dhuhr);
                prayerTimeElements.asr.textContent = formatTime(times.Asr);
                prayerTimeElements.maghrib.textContent = formatTime(times.Maghrib);
                prayerTimeElements.isha.textContent = formatTime(times.Isha);

                // تحديث الصلاة القادمة
                updateNextPrayer({
                    fajr: formatTime(times.Fajr),
                    sunrise: formatTime(times.Sunrise),
                    dhuhr: formatTime(times.Dhuhr),
                    asr: formatTime(times.Asr),
                    maghrib: formatTime(times.Maghrib),
                    isha: formatTime(times.Isha)
                });

                // حفظ البيانات في التخزين المحلي
                saveToLocalStorage(country, city, {
                    fajr: formatTime(times.Fajr),
                    sunrise: formatTime(times.Sunrise),
                    dhuhr: formatTime(times.Dhuhr),
                    asr: formatTime(times.Asr),
                    maghrib: formatTime(times.Maghrib),
                    isha: formatTime(times.Isha),
                    date: date.gregorian
                });

            } else {
                throw new Error('البيانات غير صحيحة');
            }
        } catch (error) {
            console.error('خطأ في جلب أوقات الصلاة:', error);
            
            // استخدام البيانات المخزنة محليًا في حالة الفشل
            const savedData = getFromLocalStorage(country, city);
            if (savedData) {
                updatePrayerTimesUI(savedData);
                updateNextPrayer(savedData);
                showNotification('تم استخدام البيانات المخزنة محليًا', 'warning');
            } else {
                useFallbackData(city);
                showNotification('تعذر الاتصال بخدمة أوقات الصلاة', 'error');
            }
        } finally {
            showLoading(false);
        }
    }

    // إضافة دالة للحصول على إحداثيات المدن
    function getCityCoordinates(city) {
        const coordinates = {
            'Cairo': { lat: 30.0444, lng: 31.2357 },
            'Riyadh': { lat: 24.7136, lng: 46.6753 },
            'Mecca': { lat: 21.4225, lng: 39.8262 },
            'Medina': { lat: 24.5247, lng: 39.5692 },
            'Dubai': { lat: 25.2048, lng: 55.2708 },
            'Abu Dhabi': { lat: 24.4539, lng: 54.3773 },
            'Jeddah': { lat: 21.4858, lng: 39.1925 },
            'Damascus': { lat: 33.5138, lng: 36.2765 },
            'Baghdad': { lat: 33.3152, lng: 44.3661 },
            'Amman': { lat: 31.9454, lng: 35.9284 }
            // يمكن إضافة المزيد من المدن حسب الحاجة
        };

        return coordinates[city];
    }
    
    // دالة لتنسيق الوقت
    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`;
    }
    
    // دالة لتحديث معلومات التاريخ
    function updateDateInfo(date) {
        // يمكن إضافة عنصر لعرض التاريخ الهجري والميلادي
        const dateInfoElement = document.createElement('div');
        dateInfoElement.className = 'date-info';
        dateInfoElement.innerHTML = `
            <div class="hijri-date">${date.hijri.day} ${date.hijri.month.ar} ${date.hijri.year}</div>
            <div class="gregorian-date">${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}</div>
        `;
        
        // يمكن إضافة هذا العنصر إلى الصفحة حسب الحاجة
    }
    
    // دالة لإظهار إشعار
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إخفاء الإشعار بعد 5 ثوانٍ
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }
    
    // دالة لحفظ البيانات في التخزين المحلي
    function saveToLocalStorage(country, city, data) {
        const key = `prayerTimes_${country}_${city}`;
        const storageData = {
            ...data,
            timestamp: new Date().getTime(),
            dateString: new Date().toDateString()
        };
        localStorage.setItem(key, JSON.stringify(storageData));
    }
    
    // دالة لاسترجاع البيانات من التخزين المحلي
    function getFromLocalStorage(country, city) {
        const key = `prayerTimes_${country}_${city}`;
        const data = localStorage.getItem(key);
        
        if (data) {
            const parsedData = JSON.parse(data);
            // التحقق من أن البيانات لنفس اليوم
            if (parsedData.dateString === new Date().toDateString()) {
                return parsedData;
            }
        }
        
        return null;
    }
    
    // دالة لاستخدام البيانات الاحتياطية في حالة فشل API
    function useFallbackData(city) {
        // بيانات احتياطية للمدن الرئيسية
        const fallbackTimes = {
            'Riyadh': {
                fajr: '04:35',
                sunrise: '06:04',
                dhuhr: '12:12',
                asr: '15:37',
                maghrib: '18:20',
                isha: '19:50'
            },
            'Jeddah': {
                fajr: '04:52',
                sunrise: '06:18',
                dhuhr: '12:25',
                asr: '15:45',
                maghrib: '18:32',
                isha: '20:02'
            },
            'Mecca': {
                fajr: '04:50',
                sunrise: '06:15',
                dhuhr: '12:23',
                asr: '15:43',
                maghrib: '18:30',
                isha: '20:00'
            },
            'Cairo': {
                fajr: '04:15',
                sunrise: '05:45',
                dhuhr: '12:05',
                asr: '15:25',
                maghrib: '18:15',
                isha: '19:45'
            },
            'Dubai': {
                fajr: '04:25',
                sunrise: '05:55',
                dhuhr: '12:15',
                asr: '15:35',
                maghrib: '18:25',
                isha: '19:55'
            }
        };
        
        // استخدام أوقات الرياض كافتراضي إذا لم تكن المدينة موجودة
        const times = fallbackTimes[city] || fallbackTimes['Riyadh'];
        updatePrayerTimesUI(times);
        updateNextPrayer(times);
    }
    
    // دالة لتحديث واجهة المستخدم بأوقات الصلاة
    function updatePrayerTimesUI(times) {
        prayerTimeElements.fajr.textContent = times.fajr;
        prayerTimeElements.sunrise.textContent = times.sunrise;
        prayerTimeElements.dhuhr.textContent = times.dhuhr;
        prayerTimeElements.asr.textContent = times.asr;
        prayerTimeElements.maghrib.textContent = times.maghrib;
        prayerTimeElements.isha.textContent = times.isha;
    }

    // دالة لتحديث الصلاة القادمة
    function updateNextPrayer(times) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute; // الوقت الحالي بالدقائق

        // تحويل أوقات الصلاة إلى دقائق
        const prayerTimesInMinutes = {
            fajr: convertToMinutes(times.fajr),
            sunrise: convertToMinutes(times.sunrise),
            dhuhr: convertToMinutes(times.dhuhr),
            asr: convertToMinutes(times.asr),
            maghrib: convertToMinutes(times.maghrib),
            isha: convertToMinutes(times.isha)
        };

        // تحديد الصلاة القادمة
        let nextPrayer = '';
        let remainingTime = 0;

        if (currentTime < prayerTimesInMinutes.fajr) {
            nextPrayer = 'الفجر';
            remainingTime = prayerTimesInMinutes.fajr - currentTime;
        } else if (currentTime < prayerTimesInMinutes.sunrise) {
            nextPrayer = 'الشروق';
            remainingTime = prayerTimesInMinutes.sunrise - currentTime;
        } else if (currentTime < prayerTimesInMinutes.dhuhr) {
            nextPrayer = 'الظهر';
            remainingTime = prayerTimesInMinutes.dhuhr - currentTime;
        } else if (currentTime < prayerTimesInMinutes.asr) {
            nextPrayer = 'العصر';
            remainingTime = prayerTimesInMinutes.asr - currentTime;
        } else if (currentTime < prayerTimesInMinutes.maghrib) {
            nextPrayer = 'المغرب';
            remainingTime = prayerTimesInMinutes.maghrib - currentTime;
        } else if (currentTime < prayerTimesInMinutes.isha) {
            nextPrayer = 'العشاء';
            remainingTime = prayerTimesInMinutes.isha - currentTime;
        } else {
            // إذا كان الوقت بعد العشاء، فالصلاة القادمة هي الفجر في اليوم التالي
            nextPrayer = 'الفجر';
            remainingTime = (24 * 60 - currentTime) + prayerTimesInMinutes.fajr;
        }

        // تحويل الوقت المتبقي إلى ساعات ودقائق
        const hours = Math.floor(remainingTime / 60);
        const minutes = remainingTime % 60;
        const remainingTimeFormatted = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        // تحديث العناصر في الصفحة
        nextPrayerNameElement.textContent = nextPrayer;
        remainingTimeElement.textContent = remainingTimeFormatted;
        
        // إضافة تأثير نبض للصلاة القادمة
        nextPrayerNameElement.classList.add('pulse');
        setTimeout(() => {
            nextPrayerNameElement.classList.remove('pulse');
        }, 1000);
    }

    // دالة مساعدة لتحويل الوقت من صيغة "HH:MM" إلى دقائق
    function convertToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // تحديث أوقات الصلاة عند تحميل الصفحة
    fetchPrayerTimes('SA', 'Riyadh');

    // تحديث الوقت المتبقي كل دقيقة
    setInterval(function() {
        const country = countrySelect.value;
        const city = citySelect.value;
        // تحديث الصلاة القادمة فقط بدون إعادة جلب البيانات
        const savedData = getFromLocalStorage(country, city);
        if (savedData) {
            updateNextPrayer(savedData);
        }
    }, 60000);
    
    // إضافة أحداث النقر على بطاقات الصلاة
    Object.entries(prayerTimeElements).forEach(([prayer, element]) => {
        element.parentElement.addEventListener('click', function() {
            // يمكن إضافة وظائف إضافية عند النقر على بطاقة الصلاة
            // مثل إظهار معلومات إضافية أو تفعيل التنبيهات
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
        });
    });
    
    // إضافة CSS للتأثيرات الحركية
    const style = document.createElement('style');
    style.textContent = `
        .prayer-card.clicked {
            transform: scale(0.95);
            transition: transform 0.3s;
        }
        
        .prayer-time.updated {
            animation: highlight 1s ease;
        }
        
        #next-prayer-name.pulse {
            animation: pulse 1s ease;
        }
        
        @keyframes highlight {
            0% { color: var(--text-color); }
            50% { color: var(--accent-color); }
            100% { color: var(--text-color); }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            z-index: 1000;
            transition: opacity 0.5s, transform 0.5s;
            animation: slideIn 0.5s forwards;
        }
        
        .notification.hide {
            opacity: 0;
            transform: translateX(100%);
        }
        
        .notification.error {
            background: rgba(231, 76, 60, 0.9);
        }
        
        .notification.warning {
            background: rgba(243, 156, 18, 0.9);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
