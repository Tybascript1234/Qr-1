const createdTexts = new Set(); // لتخزين النصوص التي تم إنشاؤها بالفعل
const deletedTexts = new Set(); // لتخزين النصوص التي تم حذفها

// دالة لإنشاء div جديد مع النص والأزرار
function createDiv(text, containerId, showDeleteButton = false) {
    const container = document.getElementById(containerId);

    // تحقق مما إذا كان النص قد تم إنشاؤه مسبقًا
    if (createdTexts.has(text)) {
        return; // الخروج إذا كان النص موجودًا بالفعل
    }
    
    createdTexts.add(text); // إضافة النص إلى المجموعة لمنع التكرار

    // إنشاء حاوية div جديدة
    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';

    // إنشاء فقرة للنص
    const textPara = document.createElement('p');
    textPara.textContent = text;
    textContainer.appendChild(textPara);

    // زر النسخ
    const copyButton = document.createElement('button');
    copyButton.className = 'containersk-button cvme';
    copyButton.innerHTML = '<ion-icon name="copy-outline"></ion-icon>';
    copyButton.setAttribute('data-tooltip', 'نسخ النص');
    copyButton.onclick = () => {
        navigator.clipboard.writeText(textPara.textContent).then(() => {
            copyButton.innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
            setTimeout(() => {
                copyButton.innerHTML = '<ion-icon name="copy-outline"></ion-icon>';
            }, 1000);
        }).catch(err => {
            console.error('فشل النسخ: ', err);
        });
    };
    textContainer.appendChild(copyButton);

    // زر المشاركة
    const shareButton = document.createElement('button');
    shareButton.className = 'containersk-button cvme';
    shareButton.innerHTML = '<ion-icon name="arrow-redo-outline"></ion-icon>';
    shareButton.setAttribute('data-tooltip', 'مشاركة النص');
    shareButton.onclick = async () => {
        if (navigator.share) {
            try {
                await navigator.share({ text: textPara.textContent });
            } catch (err) {
                console.error('فشلت عملية المشاركة:', err);
            }
        } else {
            console.warn('المشاركة غير مدعومة في هذا المتصفح.');
        }
    };
    textContainer.appendChild(shareButton);

    // زر التحميل
    const downloadButton = document.createElement('button');
    downloadButton.className = 'containersk-button cvme';
    downloadButton.innerHTML = '<ion-icon name="download-outline"></ion-icon>';
    downloadButton.setAttribute('data-tooltip', 'تحميل النص');
    downloadButton.onclick = () => {
        if (confirm("هل ترغب في تحميل النص؟")) { // تأكيد التحميل
            const blob = new Blob([textPara.textContent], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'text.txt';
            link.click();
            alert('تم تحميل النص بنجاح!'); // هذه الرسالة ستبقى
        }
    };
    textContainer.appendChild(downloadButton);

    // زر الاستماع
    const listenButton = document.createElement('button');
    listenButton.className = 'containersk-button cvme';
    listenButton.innerHTML = '<ion-icon name="volume-high-outline"></ion-icon>';
    listenButton.setAttribute('data-tooltip', 'الاستماع إلى النص');

    let currentSpeech = null; // متغير لتخزين الصوت الحالي

    listenButton.addEventListener("click", playText);
    listenButton.addEventListener("touchend", playText); // دعم للأجهزة المحمولة

    function playText() {
        if ('speechSynthesis' in window) {
            // إيقاف الصوت السابق إذا كان قيد التشغيل
            if (currentSpeech) {
                window.speechSynthesis.cancel();
                currentSpeech = null; // إعادة تعيين الصوت الحالي
                listenButton.innerHTML = '<ion-icon name="volume-high-outline"></ion-icon>';
                return;
            }

            // إعداد صوت جديد
            currentSpeech = new SpeechSynthesisUtterance(textPara.textContent);
            currentSpeech.lang = 'ar-SA';
            currentSpeech.volume = 1;
            currentSpeech.rate = 1;
            currentSpeech.pitch = 1;

            // تحديد صوت عربي إن وجد
            const voices = window.speechSynthesis.getVoices();
            const arabicVoice = voices.find(voice => voice.lang === 'ar-SA');
            if (arabicVoice) {
                currentSpeech.voice = arabicVoice;
            }

            // عند انتهاء الصوت يتم إعادة تعيين currentSpeech
            currentSpeech.onend = () => {
                console.log('تم الانتهاء من الكلام.');
                listenButton.innerHTML = '<ion-icon name="volume-high-outline"></ion-icon>';
                currentSpeech = null;
            };

            // بدء تشغيل الصوت وتغيير أيقونة الزر
            window.speechSynthesis.speak(currentSpeech);
            listenButton.innerHTML = '<ion-icon name="stop-outline"></ion-icon>';
        } else {
            console.warn('خاصية تحويل النص إلى كلام غير مدعومة في هذا المتصفح.');
        }
    }

    document.addEventListener('mousedown', (event) => {
        if (!listenButton.contains(event.target) && currentSpeech) {
            window.speechSynthesis.cancel();
            listenButton.innerHTML = '<ion-icon name="volume-high-outline"></ion-icon>';
            currentSpeech = null;
        }
    });

    textContainer.appendChild(listenButton);

    // زر الحذف يظهر فقط إذا كان showDeleteButton صحيحًا
    if (showDeleteButton) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'containersk-button cvme';
        deleteButton.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
        deleteButton.setAttribute('data-tooltip', 'حذف النص');
        deleteButton.onclick = () => {
            if (confirm("هل أنت متأكد أنك تريد حذف هذا النص؟")) { // تأكيد الحذف
                container.removeChild(textContainer);
                createdTexts.delete(text); // إزالة النص من المجموعة عند الحذف
                deletedTexts.add(text); // إضافة النص إلى المجموعة المحذوفة
                saveTextsToLocalStorage(); // تحديث التخزين المحلي
                alert('تم حذف النص بنجاح!'); // هذه الرسالة ستبقى
            }
        };
        textContainer.appendChild(deleteButton);
    }

    container.appendChild(textContainer);
}

// دالة لتبديل الرؤية ولون الزر
function toggleDivs(showFirst) {
    const containersk = document.getElementById('containersk');
    const containerSecond = document.getElementById('container-second');
    const toggleBtn1 = document.getElementById('toggleBtn1');
    const toggleBtn2 = document.getElementById('toggleBtn2');

    if (showFirst) {
        containersk.classList.remove('hidden');
        containerSecond.classList.add('hidden');
        toggleBtn1.style.backgroundColor = '#ecf0f6'; 
        toggleBtn1.style.borderColor = '#0000'; 
        toggleBtn2.style.backgroundColor = ''; 
        toggleBtn2.style.borderColor = ''; 
    } else {
        containersk.classList.add('hidden');
        containerSecond.classList.remove('hidden');
        toggleBtn1.style.backgroundColor = ''; 
        toggleBtn1.style.borderColor = ''; 
        toggleBtn2.style.backgroundColor = '#ecf0f6'; 
        toggleBtn2.style.borderColor = '#0000'; 
    }
}

// دالة لإنشاء divs لحاوية معينة
function createDivsForContainer(texts, containerId, showDeleteButton = false) {
    texts.forEach(text => createDiv(text, containerId, showDeleteButton));
}

// عند تحميل محتوى DOM
document.addEventListener('DOMContentLoaded', () => {
    // إنشاء divs لكل من الحاويات
    createDivsForContainer(textsArray1, 'containersk', false); // عدم عرض زر الحذف للنصوص الموجودة مسبقًا
    createDivsForContainer(textsArray2, 'container-second', false); // عدم عرض زر الحذف للنصوص الجديدة

    // إعداد مستمعي الأحداث لأزرار التبديل
    const setupToggleListeners = () => {
        document.getElementById('toggleBtn1').addEventListener('click', () => toggleDivs(true));
        document.getElementById('toggleBtn2').addEventListener('click', () => toggleDivs(false));
    };

    // إعداد مستمعي التبديل
    setupToggleListeners();

    // إعداد مستمع الحدث لزر إضافة النص
    document.getElementById('addTextButton').addEventListener('click', () => {
        const newText = prompt("أدخل النص الذي ترغب في إضافته:");
        if (newText) {
            // إنشاء div جديد في containersk بدون زر الحذف
            createDiv(newText, 'containersk', true); // تمرير true لإظهار زر الحذف
            
            // إنشاء div جديد في container-second بدون زر الحذف
            createDiv(newText, 'container-second', false); // زر الحذف لا يظهر هنا

            // حفظ النصوص في localStorage
            saveTextsToLocalStorage();
        }
    });

    // تحميل النصوص المحفوظة من localStorage
    loadTextsFromLocalStorage();
});

// دالة لحفظ النصوص في localStorage
function saveTextsToLocalStorage() {
    const containerskTexts = Array.from(document.getElementById('containersk').children)
        .map(child => child.querySelector('p') ? child.querySelector('p').textContent : null)
        .filter(text => text !== null);
    const containerSecondTexts = Array.from(document.getElementById('container-second').children)
        .map(child => child.querySelector('p') ? child.querySelector('p').textContent : null)
        .filter(text => text !== null);

    localStorage.setItem('containerskTexts', JSON.stringify(containerskTexts));
    localStorage.setItem('containerSecondTexts', JSON.stringify(containerSecondTexts));
    localStorage.setItem('deletedTexts', JSON.stringify(Array.from(deletedTexts)));
}

// دالة لتحميل النصوص من localStorage
function loadTextsFromLocalStorage() {
    const containerskTexts = JSON.parse(localStorage.getItem('containerskTexts')) || [];
    const containerSecondTexts = JSON.parse(localStorage.getItem('containerSecondTexts')) || [];
    const savedDeletedTexts = JSON.parse(localStorage.getItem('deletedTexts')) || [];

    // استرجاع النصوص المحذوفة إلى المجموعة
    savedDeletedTexts.forEach(text => deletedTexts.add(text));

    // إنشاء divs لكل من الحاويات باستخدام النصوص المحفوظة
    createDivsForContainer(containerskTexts, 'containersk', true);
    createDivsForContainer(containerSecondTexts, 'container-second', false);
}
