let currentButton = null; // متغير لتتبع الزر المضغوط حاليًا
let currentDiv = null; // متغير لتتبع الديف الظاهر حاليًا

function showDiv(clickedButton) {
    // تحديد الديف المرتبط بالزر المضغوط
    let divId = 'div' + clickedButton.id.charAt(clickedButton.id.length - 1);
    let targetDiv = document.getElementById(divId);

    // إذا كان نفس الزر المضغوط مسبقًا ولم يكن الديف ظاهرًا، أظهره
    if (currentButton === clickedButton) {
        if (targetDiv.classList.contains('visible')) {
            // إذا كان الديف ظاهرًا بالفعل فلا نفعّل أي تغيير
            return;
        } else {
            targetDiv.classList.add('visible'); // إظهار الديف إذا كان مخفيًا
            loadContent(targetDiv); // بدء تحميل المحتوى عند إظهار الديف
        }
    } else {
        // إذا كان هناك زر مضغوط مسبقًا، إزالة الـ class الخاص به
        if (currentButton) {
            currentButton.classList.remove('head-click');
            currentButton.classList.add('button'); // إعادة الـ class القديم
        }

        // إذا كان هناك ديف مضغوط مسبقًا، إخفاءه
        if (currentDiv) {
            currentDiv.classList.remove('visible');
        }

        // تحديث الزر والديف الحاليين
        currentButton = clickedButton;
        currentDiv = targetDiv;

        // تعيين الـ class للزر المضغوط ليصبح 'head-click'
        currentButton.classList.remove('button'); // إزالة الـ class القديم
        currentButton.classList.add('head-click'); // إضافة الـ class الجديد

        // إضافة الكلاس 'visible' للديف
        if (currentDiv) {
            currentDiv.classList.add('visible');
            loadContent(currentDiv); // بدء تحميل المحتوى عند إظهار الديف
        }
    }
}

function loadContent(targetDiv) {
    // إنشاء ديف شريط التحميل
    let loadingDiv = targetDiv.querySelector('.loading-bar');
    let contentDiv = targetDiv.querySelector('.content');

    // محاكاة تحميل المحتوى
    let progress = 0;
    let interval = setInterval(function() {
        progress += 5; // زيادة التقدم بمقدار 5%
        loadingDiv.style.width = progress + '%'; // تحديث عرض الشريط

        // عندما يصل التقدم إلى 100%
        if (progress >= 100) {
            clearInterval(interval); // إيقاف محاكاة التحميل
            setTimeout(function() {
                loadingDiv.style.display = 'none'; // إخفاء شريط التحميل
                contentDiv.style.display = 'block'; // إظهار المحتوى
            }, 500); // الانتظار 500 ملي ثانية قبل إخفاء شريط التحميل
        }
    }, 100); // محاكاة التحميل كل 100 ملي ثانية
}

// عند تحميل الصفحة، اجعل الزر الأول والديف الأول ظاهرين
window.onload = function() {
    const firstButton = document.getElementById('button1');
    showDiv(firstButton); // عرض الزر الأول والديف المرتبط به
}









