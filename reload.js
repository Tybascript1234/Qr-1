// وظيفة لإعادة تحميل الصفحة
function reloadPage() {
    location.reload();
}

// إيقاف التمرير على مستوى الموقع
function disableScroll() {
    document.body.style.overflow = 'hidden';
}

// تفعيل التمرير
function enableScroll() {
    document.body.style.overflow = 'auto';
}

// وظيفة لإخفاء الديف
function hideDiv() {
    const div = document.getElementById('Reload-logo');
    if (div) {
        div.style.opacity = '0'; // تغيير الشفافية لجعل الديف غير مرئي
        setTimeout(() => {
            div.style.display = 'none'; // تغيير العرض بعد أن يكون الديف غير مرئي
            enableScroll(); // تفعيل التمرير بعد إخفاء الديف
        }, 500); // التأخير لمزامنة وقت الانتقال
    }
}

// اختبار سرعة الإنترنت
function getInternetSpeed(callback) {
    const startTime = new Date().getTime();
    const download = new Image();
    download.onload = () => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // الزمن المستغرق بالثواني
        const bitsLoaded = 50000 * 8; // حجم الصورة بالبتات
        const speedBps = bitsLoaded / duration; // سرعة الإنترنت بالبت في الثانية
        const speedKbps = speedBps / 1024; // تحويل إلى كيلوبت في الثانية
        callback(speedKbps);
    };
    download.onerror = () => {
        callback(0); // في حالة حدوث خطأ في تحميل الصورة
    };
    download.src = "https://www.google.com/images/phd/px.gif?random=" + Math.random();
}

// وظيفة لإظهار الديف وتشغيل شريط التحميل
function showDiv(speed) {
    const div = document.getElementById('Reload-logo');
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');
    if (div && progressBar && statusText) {
        disableScroll(); // إيقاف التمرير عند إظهار الديف
        div.style.display = 'flex';
        div.style.opacity = '1';

        statusText.innerText = "Loading... Please wait."; // نص توضيحي أثناء التحميل

        let progress = 0;
        const intervalTime = speed > 1000 ? 50 : 200; // سرعة الزيادة تعتمد على سرعة الإنترنت
        const interval = setInterval(() => {
            if (progress < 90) { // السماح بالوصول إلى 90% فقط
                progress += 10; // زيادة التقدم بنسبة 10٪
            } else if (document.readyState === 'complete') {
                // اكتمال التحميل
                progress = 100;
                clearInterval(interval);
                setTimeout(hideDiv, 500); // إخفاء الديف بعد اكتمال شريط التحميل بفترة قصيرة
            }
            progressBar.style.width = progress + '%';
        }, intervalTime);
    }
}

// التحقق من حالة الإنترنت
function checkInternetAndLoad() {
    getInternetSpeed((speed) => {
        showDiv(speed);
    });
}

// إظهار الديف عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    const div = document.getElementById('Reload-logo');
    const statusText = document.getElementById('status-text');
    const progressBar = document.getElementById('progress-bar');
    if (navigator.onLine) {
        checkInternetAndLoad();
    } else if (div && statusText && progressBar) {
        disableScroll();
        div.style.display = 'flex';
        div.style.opacity = '1';
        statusText.innerText = "Internet disconnected.";
        progressBar.style.width = '0%';
    }
});

// التعامل مع قطع الاتصال
window.addEventListener('offline', () => {
    const div = document.getElementById('Reload-logo');
    const statusText = document.getElementById('status-text');
    if (div && statusText) {
        disableScroll();
        div.style.display = 'flex';
        div.style.opacity = '1';
        statusText.innerText = "Internet disconnected.";
        document.getElementById('progress-bar').style.width = '0%';
    }
});

// التعامل مع عودة الاتصال
window.addEventListener('online', () => {
    checkInternetAndLoad();
});

// اكتمال شريط التحميل عند تحميل جميع الموارد
window.addEventListener('load', () => {
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = '100%';
        setTimeout(hideDiv, 500); // إخفاء الديف بعد اكتمال شريط التحميل بفترة قصيرة
    }
});



// ------------------------------------------------

// ------------------------------------------------

function openInternetSettings() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        // فتح إعدادات Wi-Fi على أجهزة أندرويد
        try {
            window.location.href = "intent:#Intent;action=android.settings.WIFI_SETTINGS;end";
        } catch (e) {
            alert("لم يتم التعرف على إعدادات الإنترنت الخاصة بجهاز أندرويد.");
        }
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        // لا يمكن فتح إعدادات Wi-Fi مباشرة في iOS
        alert("لا يمكن فتح شبكات Wi-Fi مباشرة على iOS من المتصفح. يرجى فتح إعدادات الإنترنت يدويًا.");
    } else if (/windows nt/i.test(userAgent)) {
        // فتح إعدادات الشبكة على نظام تشغيل Windows
        window.open('ms-settings:network-wifi', '_blank');
    } else if (/mac os x/i.test(userAgent)) {
        // macOS لا يدعم فتح إعدادات الشبكة مباشرة
        alert("لا يمكن فتح شبكات Wi-Fi مباشرة على macOS. يرجى فتح إعدادات الإنترنت يدويًا.");
    } else {
        // نظام التشغيل غير معروف أو غير مدعوم
        alert("نظام التشغيل غير مدعوم.");
    }
}


// -------------------------------------------------

// وظيفة لإعادة تحميل الصفحة
function reloadPage() {
    location.reload();
}



// repply

window.addEventListener("load", function () {
    setTimeout(() => {
        // تأكد من أنه لا توجد رسائل JavaScript قبل تنفيذ الموجة
        if (!window.alertOpen) {
            initializeWaveButtons();
        }
    }, 100); // تأخير بسيط للتأكد من تحميل العناصر

    function initializeWaveButtons() {
        const elements = document.querySelectorAll('.wave-button');

        elements.forEach(element => {
            let isRippleActive = false;

            function createRipple(e) {
                if (isRippleActive) return;

                isRippleActive = true;

                const ripple = document.createElement('span');
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);

                let x, y;
                if (e.clientX && e.clientY) {
                    x = e.clientX - rect.left - size / 2;
                    y = e.clientY - rect.top - size / 2;
                } else if (e.touches && e.touches[0]) {
                    x = e.touches[0].clientX - rect.left - size / 2;
                    y = e.touches[0].clientY - rect.top - size / 2;
                }

                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                ripple.classList.add('ripple');

                element.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                    isRippleActive = false;
                }, 600);
            }

            element.addEventListener('mousedown', createRipple);
            element.addEventListener('touchstart', createRipple);
        });
    }
});
