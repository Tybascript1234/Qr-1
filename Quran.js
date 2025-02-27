document.addEventListener("DOMContentLoaded", async function () {
    const suraContainer = document.getElementById('suraContainer');
    const suraTextDiv = document.getElementById('suraText');
    const suraTextContainer = document.getElementById('suraTextContainer');
    const closeButton = document.getElementById('closeButton');
    const searchInput = document.getElementById('searchInput');
    const forwardButton = document.getElementById('forwardButton');
    const rewindButton = document.getElementById('rewindButton');
    const progressBar = document.getElementById('progressBar');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationTimeSpan = document.getElementById('durationTime');
    const repeatCountSpan = document.getElementById('repeatCount');
    const togglePlayButton = document.getElementById('togglePlayButton');
    const repeatButton = document.getElementById('repeatButton');
    const downloadButton = document.getElementById('downloadButton'); // زر التنزيل
    const selectedSuraNameSpan = document.getElementById('selectedSuraName');  // العنصر لعرض اسم السورة

    let allSurahs = [];
    let selectedAyah = null;
    let audio = null;
    let isPlaying = false;
    let previousAudioButton = null;

    repeatCountSpan.style.display = 'none'; // إخفاء عدد التكرار عند التحميل

    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        allSurahs = data.data;

        function createSurahElement(surah) {
            const wrapper = document.createElement('div');
            wrapper.className = 'sura-wrapper';
            wrapper.style.backgroundImage = `url('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-images@master/surah/${surah.number}.jpg')`;
            wrapper.setAttribute('data-number', surah.number);
    
            const typeImg = document.createElement('img');
            typeImg.className = 'sura-type-image';
            typeImg.src = surah.revelationType === 'Meccan'
                ? 'https://png.pngtree.com/png-clipart/20220605/original/pngtree-kaaba-illustration-png-image_7965087.png'
                : 'https://png.pngtree.com/png-vector/20230620/ourmid/pngtree-madina-vector-png-image_7297129.png';
    
            const suraNameDiv = document.createElement('div');
            suraNameDiv.className = 'sura-name';
            suraNameDiv.textContent = surah.name;
    
            const audioButton = document.createElement('button');
            audioButton.innerHTML = '<span class="material-symbols-outlined">record_voice_over</span>';
            audioButton.className = 'audio-button wave-button';
    
            audioButton.addEventListener('click', function () {
                const surahNumber = wrapper.getAttribute('data-number');
                const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahNumber}.mp3`;
                
                // إيقاف الصوت الحالي إذا كان قيد التشغيل
                if (audio && isPlaying && previousAudioButton && previousAudioButton !== audioButton) {
                    audio.pause();
                    audio.currentTime = 0;
                    previousAudioButton.innerHTML = '<span class="material-symbols-outlined">record_voice_over</span>';
                    isPlaying = false;
                    togglePlayButton.innerHTML = '<ion-icon name="caret-forward-outline"></ion-icon>';
                }
                
                // إنشاء كائن الصوت الجديد فقط إذا لم يكن الصوت الحالي هو نفسه
                if (previousAudioButton !== audioButton) {
                    audio = new Audio(audioUrl);
                    audio.addEventListener('timeupdate', updateProgressBar);
                    audio.onended = () => {
                        isPlaying = false;
                        audioButton.innerHTML = '<span class="material-symbols-outlined">record_voice_over</span>';
                        togglePlayButton.innerHTML = '<ion-icon name="caret-forward-outline"></ion-icon>';
                        progressBar.value = 0;
                        currentTimeSpan.textContent = '0:00';
                        durationTimeSpan.textContent = '0:00';
                    };
                
                    audio.addEventListener('loadedmetadata', function () {
                        durationTimeSpan.textContent = formatTime(audio.duration);
                    });
                }
                
                // Toggle play/pause state when clicking the button
                if (isPlaying) {
                    audio.pause();
                    audioButton.innerHTML = '<span class="material-symbols-outlined">record_voice_over</span>';
                    togglePlayButton.innerHTML = '<ion-icon name="caret-forward-outline"></ion-icon>';
                } else {
                    audio.play();
                    audioButton.innerHTML = '<span class="material-symbols-outlined">voice_over_off</span>';
                    togglePlayButton.innerHTML = '<ion-icon name="pause-outline"></ion-icon>'; // Update main play button
                }
                
                isPlaying = !isPlaying;
                previousAudioButton = audioButton;
            });
    
            wrapper.appendChild(typeImg);
            wrapper.appendChild(suraNameDiv);
            wrapper.appendChild(audioButton);
            suraContainer.appendChild(wrapper);

            
        wrapper.addEventListener('click', async function () {
            document.querySelectorAll('.sura-wrapper').forEach(item => {
                item.classList.remove('selected');
                item.querySelector('.sura-name').style.color = 'black';
            });
            this.classList.add('selected');
            this.querySelector('.sura-name').style.color = '#444';

            const surahNumber = this.getAttribute('data-number');
            localStorage.setItem('selectedSurah', surahNumber);

            const textResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
            const textData = await textResponse.json();

            function numberToArabic(num) {
                const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
                return num.toString().split('').map(digit => arabicDigits[parseInt(digit)]).join('');
            }
            const surahText = textData.data.ayahs.map((ayah, index, array) => {
                const ayahNumberInArabic = numberToArabic(index + 1);  // تحويل رقم الآية إلى اللغة العربية
                const ayahTextWithNumberAtEnd = `
                    <div class="ayah" data-ayah-number="${ayah.number}"> 
                        ${ayah.text.replace(/ٱللَّهِ|بِرَبِّ/gi, match => `<span style="color: red;">${match}</span>`)} 
                        <strong class="ayah-number">${ayahNumberInArabic}</strong>
                    </div>
                    ${index !== array.length - 1 ? '<hr>' : ''}`;
                
                return ayahTextWithNumberAtEnd;
            }).join('');

            suraTextDiv.innerHTML = surahText;
            suraTextContainer.style.display = 'block';

            // تحديث اسم السورة في الـ span
            selectedSuraNameSpan.textContent = `${surah.name}`;

            if (localStorage.getItem('selectedAyah')) {
                const savedAyah = localStorage.getItem('selectedAyah');
                const savedAyahElement = document.querySelector(`.ayah[data-ayah-number="${savedAyah}"]`);
                if (savedAyahElement) {
                    highlightAyah(savedAyahElement);
                    selectedAyah = savedAyahElement;
                }
            }

                // إضافة EventListener لجميع الآيات
        document.querySelectorAll('.ayah').forEach(ayahElement => {
            ayahElement.addEventListener('click', function () {
                const ayahNumber = this.getAttribute('data-ayah-number'); // الحصول على رقم الآية
            
                // إلغاء تمييز الآية المحددة مسبقًا إذا كانت موجودة
                if (selectedAyah) {
                    unhighlightAyah(selectedAyah);
                }
            
                // إذا كانت الآية الحالية هي نفسها الآية المحددة، قم بإلغاء التمييز
                if (selectedAyah && selectedAyah.getAttribute('data-ayah-number') === ayahNumber) {
                    unhighlightAyah(this);
                    selectedAyah = null;
                    localStorage.removeItem('selectedAyah');
                } else {
                    // تمييز الآية الجديدة
                    highlightAyah(this);
                    selectedAyah = this;
                    localStorage.setItem('selectedAyah', ayahNumber);
                }
            });
        });
        
        // عند تحميل الصفحة، استرجاع الآية المحددة من localStorage
        const savedAyahNumber = localStorage.getItem('selectedAyah');
        if (savedAyahNumber) {
            const savedAyahElement = document.querySelector(`.ayah[data-ayah-number="${savedAyahNumber}"]`);
            if (savedAyahElement) {
                highlightAyah(savedAyahElement);
                selectedAyah = savedAyahElement;
            }
        }
        
        // دوال تمييز وإلغاء تمييز الآية
        function highlightAyah(ayah) {
            ayah.classList.add('highlighted'); // يمكن تخصيص التمييز حسب رغبتك
        }
        
        function unhighlightAyah(ayah) {
            ayah.classList.remove('highlighted');
        }
                    });
                }

        allSurahs.forEach(surah => createSurahElement(surah));

        const savedSurahNumber = localStorage.getItem('selectedSurah');
        if (savedSurahNumber) {
            const savedSurahElement = document.querySelector(`.sura-wrapper[data-number="${savedSurahNumber}"]`);
            if (savedSurahElement) {
                savedSurahElement.click();
            }
        }

        closeButton.addEventListener('click', function () {
            suraTextContainer.style.display = 'none';
            document.querySelectorAll('.sura-wrapper').forEach(item => {
                item.classList.remove('selected');
                item.querySelector('.sura-name').style.color = 'black';
            });
            selectedAyah = null;
            localStorage.removeItem('selectedAyah');
            localStorage.removeItem('selectedSurah');
        });

        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.trim().toLowerCase().normalize("NFC"); // تطبيع النص المدخل
            const filteredSurahs = allSurahs.filter(surah => 
                surah.name.trim().toLowerCase().normalize("NFC").includes(searchTerm) // تطبيع أسماء السور
            );
            
            suraContainer.innerHTML = ''; // مسح المحتوى السابق
            if (filteredSurahs.length > 0) {
                filteredSurahs.forEach(surah => createSurahElement(surah));
            } else {
                suraContainer.innerHTML = '<p>السورة غير موجودة</p>'; // رسالة إذا لم يتم العثور على السورة
            }
        });
        

        forwardButton.addEventListener('click', function () {
            if (audio) {
                audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
            }
        });

        rewindButton.addEventListener('click', function () {
            if (audio) {
                audio.currentTime = Math.max(audio.currentTime - 5, 0);
            }
        });

        // تعديل progressBar لتمكين السحب
        progressBar.addEventListener('input', function () {
            if (audio) {
                audio.currentTime = (progressBar.value / 100) * audio.duration; // تحديث الوقت بناءً على النسبة
                currentTimeSpan.textContent = formatTime(audio.currentTime); // تحديث الوقت الحالي
            }
        });

        function updateProgressBar() {
            if (audio) {
                progressBar.value = (audio.currentTime / audio.duration) * 100 || 0; // تحديث القيمة بالنسب المئوية
                currentTimeSpan.textContent = formatTime(audio.currentTime); // عرض الوقت الحالي
            }
        }

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        togglePlayButton.addEventListener('click', function () {
            if (audio) {
                if (isPlaying) {
                    audio.pause();
                    togglePlayButton.innerHTML = '<ion-icon name="caret-forward-outline"></ion-icon>';
                } else {
                    audio.play();
                    togglePlayButton.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
                }
                isPlaying = !isPlaying;
            }
        });

        repeatButton.addEventListener('click', function () {
            if (audio) {
                audio.currentTime = 0;
                audio.play();
                togglePlayButton.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
                isPlaying = true;
            }
        });

// إضافة وظيفة زر التنزيل
downloadButton.addEventListener('click', function () {
    // عرض رسالة تأكيد قبل التنزيل
    const userConfirmed = confirm("الذهاب الى صفحة التنزيل");

    if (userConfirmed) { // إذا وافق المستخدم
        if (audio && audio.src) {
            const link = document.createElement('a');
            link.href = audio.src; // استخدم الرابط الموجود في audio.src
            link.download = `surah_${audio.src.split('/').pop()}`; // تحديد اسم الملف بناءً على اسم الملف الصوتي
            link.style.display = 'none'; // إخفاء الرابط
            document.body.appendChild(link); // أضف الرابط إلى الـ DOM
            link.click(); // يحاكي النقر على الرابط لتحميل الملف
            document.body.removeChild(link); // إزالة الرابط بعد النقر
        } else {
            console.log("لم يتم تحميل المقطع الصوتي بعد.");
        }
    } else {
        console.log("تم إلغاء التنزيل بواسطة المستخدم.");
    }
});
        
const downloadTextButton = document.getElementById('downloadTextButton');
downloadTextButton.addEventListener('click', function () {
    const confirmation = confirm("تأكيد تحميل نص السورة");
    if (!confirmation) {
        // إذا اختار المستخدم الإلغاء
        return;
    }

    const suraTextContainer = document.getElementById('suraTextContainer');
    const suraText = suraTextContainer ? suraTextContainer.innerText : '';

    if (suraText) {
        const htmlContent = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: system-ui;
                            font-size: 18px;
                            line-height: 2em;
                        }
                        pre {
                            font-family: system-ui;
                        }
                    </style>
                </head>
                <body>
                    <pre>${suraText}</pre>
                    <a>Quran recited لا تنسنا من صالح دعائك</a>
                </body>
            </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Quran recited_download-text.html'; // اسم الملف سيكون بصيغة .html
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        console.log("لم يتم العثور على نص السورة.");
    }
});

const searchAyahInput = document.getElementById('searchAyahInput'); // تحديث المتغير ليحمل ID الجديد

searchAyahInput.addEventListener('input', function () {
    const searchTerm = this.value.trim().toLowerCase().normalize("NFC"); // تطبيع النص المدخل
    const ayahs = document.querySelectorAll('.ayah'); // اختيار جميع الآيات في الـ suraTextDiv
    
    ayahs.forEach(ayah => {
        const ayahText = ayah.innerHTML.toLowerCase();
        const hr = ayah.nextElementSibling; // الحصول على العنصر التالي (الـ <hr>)

        if (ayahText.includes(searchTerm)) {
            ayah.style.display = 'block'; // إظهار الآية
            if (hr) hr.style.display = 'block'; // إظهار الـ <hr>
        } else {
            ayah.style.display = 'none'; // إخفاء الآية
            if (hr) hr.style.display = 'none'; // إخفاء الـ <hr>
        }
    });
});


const shareButton = document.getElementById('shareButton234');

if (shareButton) {
    shareButton.addEventListener('click', function () {
        // الحصول على السورة المحددة من الـ div الذي يحمل id="suraContainer" والفئة selected
        const surahContainer = document.querySelector('#suraContainer.selected');
        const surahName = surahContainer ? surahContainer.innerText.trim() : 'Quran recited'; // اسم السورة من العنصر المحدد

        // التحقق من وجود نص مميز داخل الـ div #suraText
        const highlightedText = document.querySelectorAll('#suraText .highlighted');
        let selectedText = '';

        // دمج النصوص المميزة مع اسم السورة بين قوسين
        highlightedText.forEach(function (element) {
            selectedText += `${element.innerText} (${surahName})\n`; // إضافة اسم السورة بعد النص المميز
        });

        // إذا لم يتم تحديد أي نص
        if (selectedText.trim() === '') {
            alert('يرجى تحديد اية للمشاركة أولاً.');
            return; // إنهاء التنفيذ
        }

        // إذا تم العثور على نص مميز، نشاركه
        if (navigator.share) {
            navigator.share({
                title: 'مشاركة النص المميز',
                text: selectedText
            }).then(() => {
                console.log('تمت المشاركة بنجاح');
            }).catch((error) => {
                console.log('فشل في المشاركة:', error);
            });
        } else {
            // إذا لم يكن المدعوم، استخدام رابط للمشاركة عبر الوسائل الأخرى
            const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(selectedText)}`;
            window.open(shareUrl, '_blank');
        }
    });
} else {
    console.log('الزر غير موجود!');
}


    } catch (error) {
        console.error('Error fetching surah data:', error);
    }


// الدالة التي تقوم بالتمرير للأعلى داخل الديف
function scrollToTop(scrollableDiv) {
    scrollableDiv.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // اختيار جميع الديفات التي تحتوي على صنف .scrollable-div
  var scrollableDivs = document.querySelectorAll(".scrollable-div");
  var scrollToTopBtn = document.getElementById("scrollToTopBtn");
  var hideBtns = document.querySelectorAll(".hide-btn");  // اختيار جميع الأزرار التي تحتوي على الكلاس .hide-btn
  
  // ربط الزر بالدالة عند النقر عليه باستخدام addEventListener
  scrollToTopBtn.addEventListener("click", function() {
    // تمرير إلى الأعلى في كل ديف يتم تمرير الزر له
    scrollableDivs.forEach(function(scrollableDiv) {
      scrollToTop(scrollableDiv);
    });
  });
  
  // إضافة حدث التمرير لكل ديف
  scrollableDivs.forEach(function(scrollableDiv) {
    scrollableDiv.onscroll = function() {
      // تحقق من إذا كان التمرير داخل الديف قد تجاوز 100px
      if (scrollableDiv.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
      } else {
        scrollToTopBtn.style.display = "none";
      }
    };
  });
  
  // إخفاء الزر عند النقر على أي زر يحتوي على الكلاس .hide-btn
  hideBtns.forEach(function(hideBtn) {
    hideBtn.addEventListener("click", function() {
      scrollToTopBtn.style.display = "none";  // إخفاء زر التمرير للأعلى
    });
  });  
  
//   مشراكة نص السورة
const shareButtonc = document.getElementById('shareButtonc');

shareButtonc.addEventListener('click', function () {
    if (!suraTextDiv) {
        console.error('العنصر الذي يحتوي على النص غير موجود!');
        return;
    }

    const textToShare = suraTextDiv.innerText.trim();

    // التعرف على المتصفح
    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome = userAgent.includes("chrome") && !userAgent.includes("edg");
    const isEdge = userAgent.includes("edg");
    const isFirefox = userAgent.includes("firefox");
    const isSafari = userAgent.includes("safari") && !userAgent.includes("chrome");

    if (navigator.share) {
        // إذا كان المتصفح يدعم navigator.share (مثل كروم وفايرفوكس وسفاري وإيدج)
        navigator.share({
            title: 'نص السورة',
            text: textToShare
        }).then(() => {
            console.log('تمت مشاركة السورة بنجاح');
        }).catch((error) => {
            console.error('خطأ في مشاركة السورة:', error);
        });
    } else if (isChrome || isEdge || isFirefox || isSafari) {
        // إذا كان المتصفح من الأنواع المدعومة الأخرى (كروم، إيدج، فايرفوكس، سفاري)
        console.warn("المشاركة غير مدعومة على هذا المتصفح.");
    } else {
        // إذا لم يكن المتصفح من الأنواع المدعومة، استخدام رابط WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
        window.open(whatsappUrl, '_blank');
    }
});






const downloadOptionsDiv = document.getElementById("downloadOptions");
const selectFormat = document.getElementById("downloadFormat");
const downloadButtone = document.getElementById("downloadButtone");
const closeSelection = document.getElementById("closeSelection"); // زر الإغلاق
const selectedCountSpan = document.getElementById("selectedCount"); // العنصر لعرض العدد

let selectedSurahs = new Set(); // لتخزين السور المحددة
let isFirstSelection = false; // تحديد ما إذا تم تحديد السورة الأولى بزر الفأرة الأيمن
let isSelectionCleared = false; // لتحديد ما إذا تم إلغاء التحديد من جميع السور

// إضافة الحدث 'contextmenu' للنقر بزر الفأرة الأيمن على اسم السورة
suraContainer.addEventListener("contextmenu", function (event) {
    const clickedElement = event.target.closest(".sura-wrapper");
    if (!clickedElement) return;

    event.preventDefault(); // منع القائمة الافتراضية للنقر بزر الفأرة الأيمن

    const surahNumber = clickedElement.getAttribute("data-number");
    const typeImg = clickedElement.querySelector(".sura-type-image");

    // إذا تم إلغاء التحديد من جميع السور، يجب النقر بزر الفأرة الأيمن لتحديد السورة الأولى مجددًا
    if (isSelectionCleared) {
        selectedSurahs.clear(); // إلغاء أي تحديد سابق
        isFirstSelection = false; // إعادة تعيين اختيار السورة الأولى
        isSelectionCleared = false; // إعادة تعيين حالة إلغاء التحديد
        document.querySelectorAll(".sura-wrapper").forEach(wrapper => {
            const typeImg = wrapper.querySelector(".sura-type-image");
            if (wrapper.hasAttribute("data-original-src")) {
                typeImg.src = wrapper.getAttribute("data-original-src"); // استعادة الصورة الأصلية
                typeImg.classList.remove("online"); // إزالة كلاس online من الصورة
            }
        });
        downloadOptionsDiv.style.display = "none"; // إخفاء خيارات التنزيل
        updateSelectedCount(); // تحديث العدد
    }

    // إذا لم يتم تحديد السورة الأولى بعد، نقوم بتحديد السورة الأولى
    if (!isFirstSelection) {
        selectedSurahs.add(surahNumber); // إضافة السورة إلى المحددة
        clickedElement.setAttribute("data-original-src", typeImg.src);
        typeImg.src = "https://cdn-icons-png.flaticon.com/512/1828/1828640.png"; // صورة علامة الصح
        typeImg.classList.add("online"); // إضافة الكلاس "online" للصورة
        isFirstSelection = true; // تم تحديد السورة الأولى
    } else {
        // إذا كانت السورة موجودة في المحددات، نقوم بإلغاء تحديدها
        if (selectedSurahs.has(surahNumber)) {
            selectedSurahs.delete(surahNumber);
            typeImg.src = clickedElement.getAttribute("data-original-src"); // استعادة الصورة الأصلية
            typeImg.classList.remove("online"); // إزالة الكلاس "online" من الصورة
        } else {
            selectedSurahs.add(surahNumber); // إضافة السورة إلى التحديد
            clickedElement.setAttribute("data-original-src", typeImg.src);
            typeImg.src = "https://cdn-icons-png.flaticon.com/512/1828/1828640.png"; // صورة علامة الصح
            typeImg.classList.add("online"); // إضافة الكلاس "online" للصورة
        }
    }

    // إظهار أو إخفاء خيارات التنزيل بناءً على السور المحددة
    downloadOptionsDiv.style.display = selectedSurahs.size > 0 ? "flex" : "none";
    updateSelectedCount(); // تحديث العدد
});

// إضافة الحدث للنقر العادي لتحديد باقي السور بعد تحديد السورة الأولى
suraContainer.addEventListener("click", function (event) {
    const clickedElement = event.target.closest(".sura-wrapper");
    if (!clickedElement) return;

    // إذا تم تحديد السورة الأولى بزر الفأرة الأيمن، يمكن تحديد باقي السور بالنقر فقط
    if (isFirstSelection) {
        const surahNumber = clickedElement.getAttribute("data-number");
        const typeImg = clickedElement.querySelector(".sura-type-image");

        // إذا كانت السورة موجودة في المحددات، نقوم بإلغاء تحديدها
        if (selectedSurahs.has(surahNumber)) {
            selectedSurahs.delete(surahNumber);
            typeImg.src = clickedElement.getAttribute("data-original-src"); // استعادة الصورة الأصلية
            typeImg.classList.remove("online"); // إزالة الكلاس "online" من الصورة
        } else {
            selectedSurahs.add(surahNumber); // إضافة السورة إلى التحديد
            clickedElement.setAttribute("data-original-src", typeImg.src);
            typeImg.src = "https://cdn-icons-png.flaticon.com/512/1828/1828640.png"; // صورة علامة الصح
            typeImg.classList.add("online"); // إضافة الكلاس "online" للصورة
        }

        // إظهار أو إخفاء خيارات التنزيل بناءً على السور المحددة
        downloadOptionsDiv.style.display = selectedSurahs.size > 0 ? "flex" : "none";
        updateSelectedCount(); // تحديث العدد
    }
});

downloadButtone.addEventListener("click", async function () {
    if (selectedSurahs.size === 0) return;

    const format = selectFormat.value;
    const zip = new JSZip();

    for (let surahNumber of selectedSurahs) {
        if (format === "video") {
            try {
                const videoUrl = `https://example.com/quran/videos/surah${surahNumber}.mp4`; // تأكد من وجود روابط فيديو صحيحة
                const response = await fetch(videoUrl);
                
                if (!response.ok) {
                    throw new Error(`لم يتم العثور على الفيديو لسورة ${surahNumber}`);
                }

                // تحقق من تحميل الفيديو بنجاح
                const blob = await response.blob();
                console.log(`تم تحميل الفيديو لسورة ${surahNumber} بنجاح`);
                zip.file(`Surah_${surahNumber}.mp4`, blob);
            } catch (error) {
                console.error(`خطأ في تحميل الفيديو لسورة ${surahNumber}:`, error);
            }
        } else {
            try {
                // تحميل اسم السورة من API
                const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
                const data = await response.json();
                const surahName = data.data.name; // اسم السورة
                const textContent = data.data.ayahs.map(ayah => ayah.text).join("\n");

                // إضافة الملف إلى zip باستخدام اسم السورة
                zip.file(`Surah_${surahName}.txt`, textContent);
            } catch (error) {
                console.error(`خطأ في تحميل النص لسورة ${surahNumber}:`, error);
            }
        }
    }

    // إنشاء ملف ZIP وتنزيله
    zip.generateAsync({ type: "blob" }).then(content => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = "Selected_Surahs.zip";
        a.click();
    });
});

// زر الإغلاق: عند النقر عليه يتم إلغاء التحديد وإخفاء الديف
closeSelection.addEventListener("click", function () {
    selectedSurahs.clear(); // إلغاء تحديد جميع السور
    isFirstSelection = false; // إعادة تعيين حالة السورة الأولى
    isSelectionCleared = true; // تحديد أنه تم إلغاء التحديد من جميع السور
    document.querySelectorAll(".sura-wrapper").forEach(wrapper => {
        const typeImg = wrapper.querySelector(".sura-type-image");
        if (wrapper.hasAttribute("data-original-src")) {
            typeImg.src = wrapper.getAttribute("data-original-src"); // استعادة الصورة الأصلية
            typeImg.classList.remove("online"); // إزالة كلاس "online" من الصورة
        }
    });
    downloadOptionsDiv.style.display = "none"; // إخفاء الديف
    updateSelectedCount(); // تحديث العدد
});

// دالة لتحديث عدد السور المحددة في الـ span
function updateSelectedCount() {
    selectedCountSpan.textContent = `${selectedSurahs.size}`;
}




});






















document.addEventListener('DOMContentLoaded', function () {
    const isAndroidApp = navigator.userAgent.includes("YourAppName"); // استبدل بـ اسم تطبيقك إذا كان موجودًا في User-Agent
  
    if (isAndroidApp) {
      const divToHide = document.getElementById("screen"); // استبدل بـ id الديف
      if (divToHide) {
        divToHide.style.display = "none";
      }
    }
  });  



// دالة لتحديد العنوان بناءً على معرف الديف
function getDivTitle(divId) {
    switch (divId) {
        case 'Page1': return 'اوقات الصلاة اليوم';
        case 'Page2': return 'قراءة القرآن';
        case 'Page3': return 'اذكار الصباح والمساء';
        case 'Page5': return 'مسابقة دينية';
        case 'Page6': return 'المسابقات الشهرية';
        case 'Page7': return 'سياسة الموقع';
        case 'Page8': return 'مساهمة تقنية';
        case 'Page9': return 'API سيلسة استعمال ال';
        case 'Page10': return 'مقاطع دينية';
        default: return 'Quran recited';
    }
}

// دالة لتعطيل التمرير بشكل دائم
function disableScroll() {
    document.body.style.overflow = 'hidden'; // تعطيل التمرير
}

// دالة لتمكين التمرير بعد إغلاق الديف
function enableScroll() {
    document.body.style.overflow = ''; // تمكين التمرير بعد إغلاق الديف
}

// دالة لتخزين حالة التمرير والديف المفتوح في الرابط
function storeState(divId) {
    const newUrl = divId ? `${document.location.origin}${document.location.pathname}?div=${divId}` : `${document.location.origin}${document.location.pathname}`;
    history.pushState({ divId: divId }, '', newUrl); // استخدام history API لتحديث الرابط
}

// دالة لاسترجاع حالة الديف المفتوح عند تحميل الصفحة
function restoreState() {
    const urlParams = new URLSearchParams(document.location.search);
    const divId = urlParams.get('div');

    // إغلاق جميع الديفات المفتوحة قبل فتح الديف الهدف
    const divs = document.querySelectorAll('.visible');
    divs.forEach(function (div) {
        div.classList.remove('visible');
        div.classList.add('coffees');
        div.style.display = 'none';
        stopVideo(div.id); // إيقاف الفيديو عند إغلاق الديف
    });

    if (divId) {
        const targetDiv = document.getElementById(divId);
        if (targetDiv) {
            // تأخير 2 ثانية بعد تحميل الصفحة
            setTimeout(() => {
                targetDiv.classList.add('visible');
                targetDiv.classList.remove('coffees');
                targetDiv.style.display = 'block';

                // تغيير عنوان النافذة بناءً على معرف الديف
                document.title = getDivTitle(divId);

                // تعطيل التمرير نهائيًا
                disableScroll();

                // تخزين الحالة في الرابط
                storeState(divId);
            }, 2000); // تأخير 2 ثانية
        }
    }
}

// دالة لإيقاف الفيديو عند إغلاق الديف
function stopVideo(divId) {
    const div = document.getElementById(divId);
    const video = div.querySelector('video');
    const audio = div.querySelector('audio'); // إضافة لإيقاف الصوت أيضا
    if (video) {
        video.pause(); // إيقاف الفيديو
        video.currentTime = 0; // إعادة الفيديو إلى البداية
    }
    if (audio) {
        audio.pause(); // إيقاف الصوت
        audio.currentTime = 0; // إعادة الصوت إلى البداية
    }
}

// حدث عند الضغط على الأزرار لفتح/إغلاق الديف
document.addEventListener('click', function (event) {
    const target = event.target;

    // فتح الديف عند الضغط على زر
    if (target.matches('.show-btn')) {
        const targetId = target.getAttribute('data-target');
        const targetDiv = document.getElementById(targetId);
        if (targetDiv && !targetDiv.classList.contains('visible')) {
            // إغلاق أي ديف مفتوح
            const openDivs = document.querySelectorAll('.visible');
            openDivs.forEach(function (div) {
                div.classList.remove('visible');
                div.classList.add('coffees');
                div.style.display = 'none';
                stopVideo(div.id); // إيقاف الفيديو عند إغلاق الديف
            });

            // عرض الديف الهدف
            targetDiv.classList.add('visible');
            targetDiv.classList.remove('coffees');
            targetDiv.style.display = 'block';

            // تغيير العنوان وحفظ الحالة
            document.title = getDivTitle(targetId);
            disableScroll(); // تعطيل التمرير عند فتح الديف
            storeState(targetId); // حفظ حالة الديف في الرابط
        }
    }

    // إغلاق الديف عند الضغط على زر إغلاق داخله
    if (target.matches('.hide-btn')) {
        const targetId = target.getAttribute('data-target');
        const targetDiv = document.getElementById(targetId);
        if (targetDiv) {
            targetDiv.classList.remove('visible');
            targetDiv.classList.add('coffees');
            targetDiv.style.display = 'none';

            // إيقاف الفيديو عند إغلاق الديف
            stopVideo(targetId);

            // إرجاع العنوان للحالة الافتراضية
            document.title = 'Quran recited';

            // تمكين التمرير بعد إغلاق الديف
            enableScroll();

            // تحديث الرابط
            storeState('');
        }
    }
});

// حدث عند الضغط على زر الرجوع أو الأمام في المتصفح
window.addEventListener('popstate', function (event) {
    const divId = event.state ? event.state.divId : null;

    // إغلاق جميع الديفات المفتوحة
    const openDivs = document.querySelectorAll('.visible');
    openDivs.forEach(function (div) {
        div.classList.remove('visible');
        div.classList.add('coffees');
        div.style.display = 'none';
        stopVideo(div.id); // إيقاف الفيديو عند إغلاق الديف
    });

    if (divId) {
        const targetDiv = document.getElementById(divId);
        if (targetDiv) {
            targetDiv.classList.add('visible');
            targetDiv.classList.remove('coffees');
            targetDiv.style.display = 'block';

            // تغيير العنوان وإخفاء التمرير
            document.title = getDivTitle(divId);
            disableScroll(); // تعطيل التمرير عند عرض الديف
        }
    } else {
        // إذا لم يكن هناك ديف، ارجع العنوان والتمرير للحالة الافتراضية
        document.title = 'Quran recited';
        enableScroll(); // تمكين التمرير إذا لم يكن هناك ديف مفتوح
    }
});

// عند تحميل الصفحة، استرجع حالة الديف المفتوح
window.addEventListener('load', function () {
    restoreState();
});















document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".copyable").forEach(el => {
        el.addEventListener("click", () => {
            const sel = window.getSelection(), range = document.createRange();
            range.selectNodeContents(el);
            sel.removeAllRanges();
            sel.addRange(range);
            const msg = document.getElementById("message");
            (navigator.clipboard ? navigator.clipboard.writeText(el.textContent) : document.execCommand("copy"))
            .then(() => {
                msg.style.display = "flex";
                msg.innerHTML = '<ion-icon name="checkmark-outline" style="margin-right: 8px;"></ion-icon>Copied!';
                setTimeout(() => {
                    msg.style.display = "none";
                    sel.removeAllRanges();
                }, 3000);
            });
        });
    });
});








// استرجاع الحالة المحفوظة من localStorage
document.addEventListener('DOMContentLoaded', function () {
    const sssd = document.getElementById('sssd');
    const coos = document.getElementById('coos');
    const isBoxShadowApplied = localStorage.getItem('boxShadowApplied') === 'true';

    // إذا كانت الحالة المحفوظة هي true، أضف الظل وعدل لون الزر
    if (isBoxShadowApplied) {
        applyBoxShadow(sssd, coos);
    }

    // إضافة حدث للزر عند الضغط عليه لتبديل الحالة
    coos.addEventListener('click', function () {
        if (sssd.style.boxShadow) {
            removeBoxShadow(sssd, coos);
        } else {
            applyBoxShadow(sssd, coos);
        }
    });
});

// دالة لإضافة الظل وتغيير لون الزر
function applyBoxShadow(element, button) {
    element.style.boxShadow = '0 0 0 5051px rgb(255 174 90 / 7%)';
    button.classList.add('button-sss');
    localStorage.setItem('boxShadowApplied', 'true');
}

// دالة لإزالة الظل وإعادة لون الزر لوضعه الأصلي
function removeBoxShadow(element, button) {
    element.style.boxShadow = '';
    button.classList.remove('button-sss');
    localStorage.setItem('boxShadowApplied', 'false');
}







document.addEventListener('DOMContentLoaded', function () {
    const popupDiv = document.getElementById('popupDivWithLongIdName');
    const overlay = document.getElementById('ass');
    const showDivButton = document.getElementById('showDivButtonWithLongName');
    const closeDivButton = document.getElementById('closeDivButtonWithLongName');

    let startX = 0;
    let isSwiping = false;

    showDivButton.addEventListener('click', function () {
        showDivButton.style.display = 'none'; // إخفاء زر الإظهار
        popupDiv.classList.remove('hide');
        popupDiv.classList.add('show');
        popupDiv.style.display = 'block';
        overlay.style.display = 'block';
    });

    function closePopup() {
        popupDiv.classList.remove('show');
        popupDiv.classList.add('hide');

        setTimeout(() => {
            popupDiv.style.display = 'none';
            overlay.style.display = 'none';
            showDivButton.style.display = 'flex'; // إعادة زر الإظهار
        }, 500); // مدة الأنميشن
    }

    closeDivButton.addEventListener('click', closePopup);

    // إغلاق عند الضغط خارج النافذة حتى لو لم يتم تحرير الضغط
    overlay.addEventListener('mousedown', function (event) {
        if (event.target === overlay) {
            closePopup();
        }
    });

    // إغلاق عند لمس الخارج على الهاتف
    overlay.addEventListener('touchstart', function (event) {
        if (event.target === overlay) {
            closePopup();
        }
    });

    // إضافة ميزة السحب لليسار على الهاتف
    popupDiv.addEventListener('touchstart', function (event) {
        startX = event.touches[0].clientX;
        isSwiping = true;
    });

    popupDiv.addEventListener('touchmove', function (event) {
        if (!isSwiping) return;

        let moveX = event.touches[0].clientX;
        let diffX = startX - moveX;

        // إذا تم السحب لليسار بمسافة كافية
        if (diffX > 100) {
            isSwiping = false; // منع المزيد من السحب
            closePopup();
        }
    });

    popupDiv.addEventListener('touchend', function () {
        isSwiping = false;
    });
});







document.addEventListener("DOMContentLoaded", function () {
    function showModal() {
        document.body.dataset.previousScrollState = document.body.style.overflow;
        document.querySelector('.overlay').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        document.body.style.overflow = document.body.dataset.previousScrollState || '';
        document.querySelector('.overlay').style.display = 'none';
    }

    // التحقق من وجود العناصر قبل إضافة الأحداث لتجنب الأخطاء
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');

    if (overlay) {
        overlay.addEventListener('mousedown', hideModal);
        overlay.addEventListener('touchstart', hideModal);
    }

    if (modal) {
        modal.addEventListener('mousedown', function (event) {
            event.stopPropagation();
        });

        modal.addEventListener('touchstart', function (event) {
            event.stopPropagation();
        });
    }

    // جعل `showModal` و `hideModal` متاحين عالميًا للاستدعاء من HTML
    window.showModal = showModal;
    window.hideModal = hideModal;
});







document.addEventListener("DOMContentLoaded", () => {
    // التأكد من تحميل DOM أولاً
    const button = document.getElementById("createShortcut"); // تأكد من أن الزر بالمعرف موجود

    if (button) {
        button.addEventListener("click", () => {
            const confirmation = confirm("هل تريد تنزيل الاختصار؟"); // عرض رسالة تأكيد
            if (confirmation) {
                const localFilePath = "file:///C:/Users/ccit-one/Downloads/noon-20241009T110922Z-001/noon/The%20Quran/Quran.html";
                const fileName = "Quran recited";

                // المسار الصحيح للصورة التي تم رفعها على السيرفر أو المجلد المحلي
                const iconUrl = "file:///C:/path/to/New%20Project.png"; // استبدل هذا بالمسار الصحيح للصورة على جهازك أو السيرفر

                const shortcutFileContent = `
[InternetShortcut]
URL=${localFilePath}
IconFile=${iconUrl}
IconIndex=0
                `;

                const blob = new Blob([shortcutFileContent], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `${fileName}.url`; // تنزيل الملف كـ .url
                link.click();
            } else {
                console.log("تم إلغاء عملية التنزيل من قبل المستخدم.");
            }
        });
    } else {
        console.log("الزر غير موجود");
    }
});





document.addEventListener("DOMContentLoaded", () => {
    // تعريف المجموعات من الـ IDs للديفات والأزرار
    const divIds = ["contentDivWithDetails1", "contentDivWithDetails2", "contentDivWithDetails3", "contentDivWithDetails4"];
    const closeButtonIds = ["closeContentButtonForDiv1", "closeContentButtonForDiv2", "closeContentButtonForDiv3", "closeContentButtonForDiv4"];
    const showButtonIds = ["showContentButtonForDiv1", "showContentButtonForDiv2", "showContentButtonForDiv3", "showContentButtonForDiv4"];

    divIds.forEach((divId, index) => {
        const contentDiv = document.getElementById(divId);
        const closeButton = document.getElementById(closeButtonIds[index]);
        const showButton = document.getElementById(showButtonIds[index]);

        // التحقق من وجود العناصر قبل إضافة الأحداث
        if (contentDiv && closeButton && showButton) {
            // حدث زر الإغلاق
            closeButton.addEventListener("click", () => {
                contentDiv.style.display = "none";  // إخفاء الديف
                showButton.style.display = "";  // إظهار زر الإظهار
                closeButton.style.display = "none";  // إخفاء زر الإغلاق
            });

            // حدث زر الإظهار
            showButton.addEventListener("click", () => {
                contentDiv.style.display = "inline-flex";  // إظهار الديف
                showButton.style.display = "none";  // إخفاء زر الإظهار
                closeButton.style.display = "block"; // إظهار زر الإغلاق مجددًا
            });
        }
    });
});





        // تأكد من تشغيل الكود بعد تحميل DOM
        document.addEventListener("DOMContentLoaded", () => {
            // استهداف العناصر
            const toggleButton123 = document.getElementById("toggleButton123");
            const myDiv = document.querySelector(".myDiv123");

            // التحقق من وجود العناصر
            if (!toggleButton123) {
                console.error("The toggleButton123 element was not found!");
                return;
            }

            if (!myDiv) {
                console.error("The myDiv123 element was not found!");
                return;
            }

            let isStyleApplied = false; // حالة التنسيق

            // إضافة حدث النقر للزر
            toggleButton123.addEventListener("click", () => {
                if (isStyleApplied) {
                    // إزالة التنسيق
                    myDiv.style.marginTop = ""; // إعادة القيم الافتراضية
                    myDiv.style.zIndex = ""; // إعادة القيم الافتراضية
                    toggleButton123.textContent = "اخفاء الشريط العلوي"; // تغيير نص الزر
                } else {
                    // تطبيق التنسيق
                    myDiv.style.marginTop = "0";
                    myDiv.style.zIndex = "100";
                    toggleButton123.textContent = "اظهار الشريط العلوي"; // تغيير نص الزر
                }
                isStyleApplied = !isStyleApplied; // عكس الحالة
            });
        });



      // دالة تحميل التطبيق الأول
      function confirmAndDownloadApp1() {
        // عرض رسالة التأكيد
        const userConfirmed = confirm("هل أنت متأكد أنك تريد تحميل تطبيق Quran recited؟");

        if (userConfirmed) {
            // إذا وافق المستخدم، يتم بدء التنزيل
            const apkUrl = 'app-release.apk'; // قم بتغيير هذا إلى مسار ملف APK الخاص بك

            // إنشاء رابط وتحفيز التنزيل
            const link = document.createElement('a');
            link.href = apkUrl;
            link.download = 'Quran recited.apk'; // اسم الملف عند التنزيل
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        // لا حاجة لعمل أي شيء إذا رفض المستخدم
    }

    // دالة تحميل التطبيق الثاني
    function confirmAndDownloadApp2() {
        // عرض رسالة التأكيد
        const userConfirmed = confirm("هل أنت متأكد أنك تريد تحميل التطبيق الآخر؟");

        if (userConfirmed) {
            // إذا وافق المستخدم، يتم بدء التنزيل
            const apkUrl = 'another-app.apk'; // قم بتغيير هذا إلى مسار ملف APK الخاص بك

            // إنشاء رابط وتحفيز التنزيل
            const link = document.createElement('a');
            link.href = apkUrl;
            link.download = 'Another app.apk'; // اسم الملف عند التنزيل
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        // لا حاجة لعمل أي شيء إذا رفض المستخدم
    }





// مراقبة شاملة لأي عملية مشاركة
document.addEventListener('click', (event) => {
    console.log("تم الضغط على عنصر:", event.target);

    // إذا كان العنصر يحتوي على رابط مشاركة (مثل البريد الإلكتروني أو الروابط الخارجية)
    if (event.target.tagName === 'A' && event.target.href) {
        console.log("تم الضغط على رابط مشاركة:", event.target.href);

        // مثال: يمكنك التحقق إذا كانت الرابط تبدأ بـ mailto أو whatsapp
        if (event.target.href.includes('mailto:') || event.target.href.includes('whatsapp.com')) {
            console.log("تم التعرف على عملية مشاركة عبر رابط خارجي.");
            shareContent(); // تشغيل دالة المشاركة
        }
    }
});

// مراقبة النسخ كجزء من المشاركة
document.addEventListener('copy', (event) => {
    console.log("عملية نسخ تم التعرف عليها. المحتوى قد يتم مشاركته.");
    shareContent(); // تشغيل دالة المشاركة
});

// مراقبة أي حدث يسحب النص أو العنصر
document.addEventListener('dragstart', (event) => {
    console.log("تم التعرف على عملية سحب محتوى (قد تكون مشاركة).");
    shareContent(); // تشغيل دالة المشاركة
});

// مراقبة التفاعل مع واجهة المشاركة في المتصفح
document.addEventListener('share', (event) => {
    console.log("عملية مشاركة تم تشغيلها عبر واجهة المتصفح.");
    shareContent(); // تشغيل دالة المشاركة
});

// الدالة العامة للمشاركة
function shareContent() {
    const url = window.location.href; // الرابط الحالي للصفحة
    const title = document.title; // عنوان الصفحة
    const text = "Check out this page!"; // النص الافتراضي

    if (navigator.share) {
        // إذا كان المتصفح يدعم واجهة Web Share API
        navigator.share({
            title: title,
            text: text,
            url: url,
        })
            .then(() => console.log("تمت مشاركة المحتوى بنجاح"))
            .catch((error) => console.error("حدث خطأ أثناء المشاركة:", error));
    } else {
        // في حالة عدم دعم المتصفح لـ Web Share API
        console.log("المتصفح لا يدعم Web Share API. يتم استخدام بديل.");
        fallbackShare(url);
    }
}

// طريقة بديلة للمشاركة (نسخ الرابط)
function fallbackShare(url) {
    navigator.clipboard.writeText(url)
        .then(() => alert("تم نسخ الرابط إلى الحافظة!"))
        .catch(() => alert("تعذر نسخ الرابط إلى الحافظة."));
}





function displayMessage() {
    alert("عذرا لم يتم تشغيل العنصر بعد");
}


// // تابع لتحديد الديف الذي سيتم عرضه
// let messageDiv;

// // وظيفة لعرض الـ div
// function showMessage() {
//   // إنشاء الديف إذا لم يكن موجودًا بعد
//   if (!messageDiv) {
//     messageDiv = document.createElement('div');
//     messageDiv.style.position = 'fixed';
//     messageDiv.style.top = '20px';
//     messageDiv.style.left = '50%';
//     messageDiv.style.transform = 'translateX(-50%)';
//     messageDiv.style.outline = 'solid 3px #fff';
//     messageDiv.style.backgroundColor = '#ff0000';
//     messageDiv.style.color = '#fff';
//     messageDiv.style.padding = '10px 20px';
//     messageDiv.style.borderRadius = '5px';
//     messageDiv.style.zIndex = '10000000';
//     messageDiv.innerHTML = 'Creative Clouds IT Protection ! <a href="#" style="color: #fff;">سياسة الخصوصية</a>';
//     document.body.appendChild(messageDiv);
//   }

//   // إظهار الـ div
//   messageDiv.style.display = 'block';

//   // إخفاء الديف بعد 3 ثواني
//   setTimeout(function() {
//     if (messageDiv) {
//       messageDiv.style.display = 'none';
//     }
//   }, 3000);

//   // إضافة حدث لإغلاق الديف عند النقر خارجه
//   document.addEventListener('click', function closeMessage(event) {
//     if (!messageDiv.contains(event.target)) {
//       messageDiv.style.display = 'none';
//       document.removeEventListener('click', closeMessage); // إزالة الحدث بعد النقر
//     }
//   });
// }

// // تعطيل الأزرار F1 إلى F12
// document.addEventListener('keydown', function(event) {
//   if (event.keyCode >= 112 && event.keyCode <= 123) {
//     event.preventDefault(); // منع الفعل الافتراضي (فتح المساعدة أو قوائم أخرى)
//     showMessage(); // عرض الـ div عند الضغط على F1-F12
//   }
// });

// // تعطيل قائمة النقر بالزر الأيمن
// document.addEventListener('contextmenu', function(event) {
//   event.preventDefault(); // منع ظهور قائمة النقر بالزر الأيمن
//   showMessage(); // عرض الـ div عند النقر بالزر الأيمن
// });

// // تعطيل اختصار Ctrl + S
// document.addEventListener('keydown', function(event) {
//   if (event.ctrlKey && event.key === 's') {
//     event.preventDefault(); // منع الفعل الافتراضي (الحفظ)
//     showMessage(); // عرض الـ div عند الضغط على Ctrl + S
//   }
// });

// // تعطيل اختصار Alt + F
// document.addEventListener('keydown', function(event) {
//   if (event.altKey && event.key === 'f') {
//     event.preventDefault(); // منع الفعل الافتراضي (فتح قائمة الملف)
//     showMessage(); // عرض الـ div عند الضغط على Alt + F
//   }

//   // تعطيل اختصار Ctrl + F
//   if (event.ctrlKey && event.key === 'f') {
//     event.preventDefault(); // منع الفعل الافتراضي (فتح البحث)
//     showMessage(); // عرض الـ div عند الضغط على Ctrl + F
//   }

//   // تعطيل اختصار Ctrl + S
//   if (event.ctrlKey && event.key === 's') {
//     event.preventDefault(); // منع الفعل الافتراضي (الحفظ)
//     showMessage(); // عرض الـ div عند الضغط على Ctrl + S
//   }

//   // تعطيل اختصار Alt + E
//   if (event.altKey && event.key === 'e') {
//     event.preventDefault(); // منع الفعل الافتراضي (فتح قائمة التحرير)
//     showMessage(); // عرض الـ div عند الضغط على Alt + E
//   }
// });
