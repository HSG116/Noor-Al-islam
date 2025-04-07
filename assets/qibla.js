document.addEventListener("DOMContentLoaded", function () {
    const getLocationButton = document.getElementById('get-location');
    const qiblaDegreeElement = document.getElementById('qibla-degree');
    const compassArrow = document.querySelector('.compass-arrow');
    
    // إحداثيات الكعبة المشرفة
    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;
    
    // عند النقر على زر تحديد الموقع
    getLocationButton.addEventListener('click', async function() {
        // تغيير نص الزر ليظهر أنه يعمل
        getLocationButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تحديد موقعك...';
        getLocationButton.disabled = true;
        
        // التحقق من دعم المتصفح لخدمة تحديد الموقع
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // في حالة النجاح
                async function(position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    
                    try {
                        const qiblaDirection = await calculateQiblaDirection(userLat, userLng);
                        if (qiblaDirection !== null) {
                            updateQiblaUI(qiblaDirection);
                        }
                    } catch (error) {
                        console.error('خطأ أثناء حساب اتجاه القبلة:', error);
                    }
                    
                    // إعادة الزر إلى حالته الأصلية
                    getLocationButton.innerHTML = '<i class="fas fa-location-arrow"></i> تحديد موقعي';
                    getLocationButton.disabled = false;
                    
                    // تفعيل البوصلة المباشرة إذا كان الجهاز يدعمها
                    enableLiveCompass();
                },
                // في حالة الخطأ
                function(error) {
                    handleLocationError(error);
                    
                    // إعادة الزر إلى حالته الأصلية
                    getLocationButton.innerHTML = '<i class="fas fa-location-arrow"></i> تحديد موقعي';
                    getLocationButton.disabled = false;
                },
                // خيارات تحديد الموقع
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            // المتصفح لا يدعم خدمة تحديد الموقع
            showError('عذراً، متصفحك لا يدعم خدمة تحديد الموقع.');
            getLocationButton.innerHTML = '<i class="fas fa-location-arrow"></i> تحديد موقعي';
            getLocationButton.disabled = false;
        }
    });
    
    // تعديل دالة حساب اتجاه القبلة لاستخدام API
    async function calculateQiblaDirection(lat, lng) {
        try {
            // استخدام API للحصول على اتجاه القبلة
            const apiUrl = `https://api.aladhan.com/v1/qibla/${lat}/${lng}`;
            const response = await fetch(apiUrl);
    
            if (!response.ok) {
                throw new Error('فشل في جلب بيانات اتجاه القبلة من API');
            }
    
            const data = await response.json();
    
            if (data && data.data && data.data.direction) {
                return data.data.direction; // زاوية القبلة من API
            } else {
                throw new Error('البيانات المستلمة من API غير صالحة');
            }
        } catch (error) {
            console.error('خطأ أثناء جلب اتجاه القبلة:', error);
            showError('حدث خطأ أثناء حساب اتجاه القبلة. يرجى المحاولة لاحقًا.');
            return null; // إرجاع null في حالة الخطأ
        }
    }
    
    // دالة لتحديث واجهة المستخدم بزاوية القبلة
    function updateQiblaUI(angle) {
        // تقريب الزاوية إلى رقمين عشريين
        const roundedAngle = Math.round(angle * 100) / 100;
        
        // تحديث النص
        qiblaDegreeElement.textContent = `${roundedAngle} درجة`;
        
        // تدوير سهم البوصلة
        compassArrow.style.transform = `rotate(${angle}deg)`;
        
        // إضافة تأثير حركي للتدوير
        compassArrow.style.transition = 'transform 1s ease-in-out';
    }
    
    // دالة للتعامل مع أخطاء تحديد الموقع
    function handleLocationError(error) {
        let errorMessage = '';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'تم رفض الوصول إلى الموقع. يرجى السماح للموقع بالوصول إلى موقعك.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'معلومات الموقع غير متاحة.';
                break;
            case error.TIMEOUT:
                errorMessage = 'انتهت مهلة طلب الموقع.';
                break;
            case error.UNKNOWN_ERROR:
                errorMessage = 'حدث خطأ غير معروف أثناء تحديد الموقع.';
                break;
        }
        
        alert(errorMessage);
    }
    
    // دالة مساعدة لتحويل الدرجات إلى راديان
    function toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    // دالة مساعدة لتحويل الراديان إلى درجات
    function toDegrees(radians) {
        return radians * (180 / Math.PI);
    }
    
    // تفعيل البوصلة المباشرة
    function enableLiveCompass() {
        // التحقق من دعم المتصفح لأحداث توجيه الجهاز
        if (window.DeviceOrientationEvent) {
            // طلب الإذن في أجهزة iOS
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            // إضافة مستمع لأحداث توجيه الجهاز
                            window.addEventListener('deviceorientation', handleDeviceOrientation, true);
                            showSuccess('تم تفعيل البوصلة المباشرة');
                        } else {
                            showError('تم رفض الإذن لاستخدام البوصلة');
                        }
                    })
                    .catch(console.error);
            } else {
                // للأجهزة الأخرى التي لا تتطلب إذنًا
                window.addEventListener('deviceorientation', handleDeviceOrientation, true);
            }
        } else {
            showError('عذراً، جهازك لا يدعم البوصلة المباشرة');
        }
    }
    
    // معالجة أحداث توجيه الجهاز بدقة عالية
    function handleDeviceOrientation(event) {
        let compassHeading;
        let alpha = event.alpha; // الدوران حول المحور Z (من 0 إلى 360)
        let beta = event.beta;   // الدوران حول المحور X (من -180 إلى 180)
        let gamma = event.gamma; // الدوران حول المحور Y (من -90 إلى 90)
        
        // الحصول على اتجاه البوصلة
        if (event.webkitCompassHeading) {
            // للأجهزة التي تدعم iOS
            compassHeading = event.webkitCompassHeading;
        } else if (typeof alpha === 'number') {
            // للأجهزة التي تدعم Android
            
            // تحويل alpha إلى اتجاه البوصلة (الشمال = 0)
            compassHeading = 360 - alpha;
            
            // تصحيح الاتجاه بناءً على وضعية الجهاز
            if (typeof beta === 'number' && typeof gamma === 'number') {
                // تصحيح الاتجاه عندما يكون الجهاز في وضع أفقي
                if (Math.abs(gamma) > 45) {
                    // تعديل الاتجاه عندما يكون الجهاز على جانبه
                    compassHeading = adjustHeadingForDeviceOrientation(compassHeading, beta, gamma);
                }
            }
        } else {
            // الجهاز لا يدعم قراءة البوصلة
            showError('جهازك لا يدعم البوصلة بشكل كامل');
            return;
        }
        
        // الحصول على زاوية القبلة المحفوظة
        const qiblaAngleText = qiblaDegreeElement.textContent;
        const qiblaAngle = parseFloat(qiblaAngleText);
        
        if (!isNaN(qiblaAngle)) {
            // تعديل سهم البوصلة ليشير إلى القبلة بناءً على اتجاه الجهاز
            const rotation = qiblaAngle - compassHeading;
            
            // تنعيم حركة السهم باستخدام متوسط متحرك
            smoothRotation(rotation);
            
            // إضافة مؤشر الشمال
            updateNorthIndicator(compassHeading);
        }
    }
    
    // متغير لتخزين قيم الدوران السابقة للتنعيم
    const rotationHistory = [];
    const MAX_HISTORY = 5; // عدد القيم المستخدمة للتنعيم
    
    // دالة لتنعيم حركة السهم
    function smoothRotation(newRotation) {
        // إضافة القيمة الجديدة إلى التاريخ
        rotationHistory.push(newRotation);
        
        // الاحتفاظ فقط بآخر MAX_HISTORY قيم
        if (rotationHistory.length > MAX_HISTORY) {
            rotationHistory.shift();
        }
        
        // حساب متوسط القيم
        const sum = rotationHistory.reduce((a, b) => a + b, 0);
        const avgRotation = sum / rotationHistory.length;
        
        // تطبيق الدوران المتوسط
        compassArrow.style.transform = `rotate(${avgRotation}deg)`;
    }
    
    // دالة لتصحيح اتجاه البوصلة بناءً على وضعية الجهاز
    function adjustHeadingForDeviceOrientation(heading, beta, gamma) {
        // تصحيح الاتجاه عندما يكون الجهاز على جانبه
        let adjustedHeading = heading;
        
        // تعديل بناءً على زاوية gamma (الدوران حول المحور Y)
        if (gamma > 45) {
            // الجهاز مائل إلى اليمين
            adjustedHeading = (heading + 90) % 360;
        } else if (gamma < -45) {
            // الجهاز مائل إلى اليسار
            adjustedHeading = (heading + 270) % 360;
        }
        
        // تعديل إضافي بناءً على زاوية beta (الدوران حول المحور X)
        if (Math.abs(beta) > 90) {
            // الجهاز مقلوب
            adjustedHeading = (adjustedHeading + 180) % 360;
        }
        
        return adjustedHeading;
    }
    
    // تحديث مؤشر الشمال
    function updateNorthIndicator(compassHeading) {
        // يمكن إضافة مؤشر للشمال هنا إذا لزم الأمر
    }
    
    // إظهار رسالة نجاح
    function showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        // إضافة العنصر إلى الصفحة
        const qiblaFinder = document.querySelector('.qibla-finder');
        qiblaFinder.appendChild(successElement);
        
        // إزالة العنصر بعد 3 ثوانٍ
        setTimeout(() => {
            successElement.remove();
        }, 3000);
    }
    
    // إظهار رسالة خطأ
    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // إضافة العنصر إلى الصفحة
        const qiblaFinder = document.querySelector('.qibla-finder');
        qiblaFinder.appendChild(errorElement);
        
        // إزالة العنصر بعد 3 ثوانٍ
        setTimeout(() => {
            errorElement.remove();
        }, 3000);
    }
});
