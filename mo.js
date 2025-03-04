let countdownTimeout;
let adhanTimeout;

// حفظ البيانات في LocalStorage
function saveToLocalStorage(country, city, timings) {
    localStorage.setItem('selectedCountry', country);
    localStorage.setItem('selectedCity', city);
    localStorage.setItem('prayerTimings', JSON.stringify(timings));
}

// استرجاع البيانات من LocalStorage
function loadFromLocalStorage() {
    const savedCountry = localStorage.getItem('selectedCountry');
    const savedCity = localStorage.getItem('selectedCity');
    const savedTimings = JSON.parse(localStorage.getItem('prayerTimings'));

    return { savedCountry, savedCity, savedTimings };
}

// تحديث الـ UI بناءً على القيم المحفوظة
function updateUIFromLocalStorage(selectElement, container) {
    const { savedCountry, savedCity, savedTimings } = loadFromLocalStorage();

    if (savedCountry) {
        const countrySelect = container.querySelector('select:nth-of-type(1)');
        countrySelect.value = savedCountry;
        populateCities(savedCountry, container.querySelector('select:nth-of-type(2)'));
    }

    if (savedCity) {
        const citySelect = container.querySelector('select:nth-of-type(2)');
        citySelect.value = savedCity;
    }

    if (savedTimings) {
        container.querySelector('.fajr-time').textContent = savedTimings.Fajr;
        container.querySelector('.sunrise-time').textContent = savedTimings.Sunrise;
        container.querySelector('.dhuhr-time').textContent = savedTimings.Dhuhr;
        container.querySelector('.asr-time').textContent = savedTimings.Asr;
        container.querySelector('.maghrib-time').textContent = savedTimings.Maghrib;
        container.querySelector('.isha-time').textContent = savedTimings.Isha;

        updateCountdown(savedTimings, container);
    }
}

function togglePrayerTimes(show) {
    const prayerTimesDiv = document.querySelector('.prayer-times-container');
    prayerTimesDiv.style.display = show ? 'flex' : 'none';
}

const countriesAndCities = {
    "السعودية": ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "بريدة", "أبها", "تبوك", "حائل", "نجران", "جيزان", "القطيف", "خميس مشيط", "الهفوف", "المبرز", "الظهران", "الجبيل", "ينبع", "حفر الباطن", "سكاكا", "عرعر", "بيشة", "القنفذة", "الباحة", "الوجه", "ضباء", "القريات", "رفحاء", "الزلفي", "الخرج", "المجمعة", "الدوادمي", "شرورة", "حوطة بني تميم", "وادي الدواسر", "رأس تنورة", "الحائط", "السليل", "طريف", "رجال ألمع", "بلجرشي", "تنومة", "أحد رفيدة", "تثليث", "الليث", "العلا", "النماص", "بيش", "العارضة", "سراة عبيدة", "محايل عسير", "الطوال", "الريث", "الدرب", "ظهران الجنوب", "ضمد", "بارق", "تربة", "حبونا", "الخرمة", "المخواة", "القويعية", "مرات", "عفيف", "البدائع", "عنيزة", "الأسياح", "النبهانية", "رياض الخبراء", "الشماسية", "المذنب", "الرس", "البكيرية", "خليص", "رابغ", "الكامل", "بحرة", "ثول", "حريملاء", "العيينة", "الدرعية", "حوطة سدير", "تمير", "ضرما", "المزاحمية", "القويعية", "الحريق", "صامطة", "الدائر", "فيفا", "صبيا", "العيدابي", "وادي الفرع", "الحناكية", "المندق", "القرى", "العقيق", "بلجرشي"],
    "مصر": ["القاهرة", "الجيزة", "الإسكندرية", "بورسعيد", "السويس", "الإسماعيلية", "دمياط", "المنصورة", "طنطا", "الزقازيق", "بنها", "شبين الكوم", "كفر الشيخ", "دمنهور", "المحلة الكبرى", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "الفيوم", "بني سويف", "الغردقة", "شرم الشيخ", "مرسى مطروح", "العريش", "رفح", "الشيخ زويد", "الخارجة", "الداخلة", "سيوة", "نويبع", "طابا", "رأس سدر", "أبو زنيمة", "دهب", "سانت كاترين", "قوص", "إدفو", "أرمنت", "القصير", "سفاجا", "مرسى علم", "بلبيس", "أبو كبير", "أبو حماد", "فاقوس", "الحسينية", "ديرب نجم", "منيا القمح", "ههيا", "كفر صقر", "أولاد صقر", "الصالحية الجديدة", "العاشر من رمضان", "مغاغة", "سمالوط", "مطاي", "أبو قرقاص", "بني مزار", "ملوي", "دير مواس", "منفلوط", "البداري", "ساحل سليم", "أبوتيج", "صدفا", "الغنايم", "جرجا", "البلينا", "طهطا", "طما", "المراغة", "أخميم", "دار السلام", "نجع حمادي", "فرشوط", "دشنا", "الوقف", "قوص", "نقادة", "أرمنت", "كوم أمبو", "نصر النوبة", "دراو", "توشكى", "أبوسمبل", "الفشن", "إهناسيا", "الواسطى", "سمسطا", "ببا", "مطوبس", "فوه", "دسوق", "بيلا", "الحامول", "قلين", "سيدى سالم", "الرياض", "مطوبس"],
    "الإمارات": ["دبي", "أبو ظبي", "الشارقة", "العين", "رأس الخيمة", "الفجيرة", "أبوظبي", "دبي", "الشارقة", "عجمان", "أم القيوين", "رأس الخيمة", "الفجيرة", "العين", "خورفكان", "دبا الفجيرة", "دبا الحصن", "حتا", "الذيد", "مصفوت", "المدام", "فلج المعلا", "مسافي", "ليوا", "الرويس", "دلما", "المرفأ", "زايد", "السلع", "غياثي", "السلع"],
    "الكويت": ["مدينة الكويت", "حولي", "الأحمدي", "الفروانية", "الجهراء", "العاصمة", "الأحمدي", "الجهراء", "الفروانية", "حولي", "مبارك الكبير", "السالمية", "الفحيحيل", "صباح السالم", "المنقف", "الرميثية", "خيطان", "بيان", "القرين", "الفنطاس", "الجابرية", "المهبولة", "سلوى", "أبو حليفة", "الزور", "الوفرة", "صباح الأحمد", "المسيلة", "الصليبية", "العارضية", "الصليبخات", "الشويخ", "كبد", "العبدلي", "المسايل", "شرق", "الدسمة", "الدعية", "بنيد القار", "مشرف", "الشعب", "النسيم", "النزهة", "القادسية", "اليرموك", "الفيحاء", "العديلية", "الروضة", "السرة", "الصديق", "حطين", "الظهر", "جابر الأحمد", "مدينة سعد العبد الله"],
    "قطر": ["الدوحة", "الوكرة", "الخور", "الريان", "العاصمة", "الدوحة", "الريان", "الوكرة", "الخور", "الشحانية", "دخان", "مسيعيد", "زكريت", "أم صلال", "الجميلية", "الغارية", "أبو سمرة", "روضة راشد", "أم باب", "الذخيرة", "السيلية", "اللؤلؤة", "الغرافة", "الوجبة", "المرة", "روضة الجهانية", "لوسيل"],
    "الجزائر": ["الجزائر العاصمة", "وهران", "قسنطينة", "عنابة", "البليدة", "باتنة", "سطيف", "تيزي وزو", "بشار", "بجاية", "تمنراست", "تلمسان", "ورقلة", "بسكرة", "الجلفة", "المدية", "غرداية", "تبسة", "الشلف", "الأغواط", "عين تموشنت", "سوق أهراس", "معسكر", "المسيلة", "سيدي بلعباس", "عين الدفلى", "برج بوعريريج", "ميلة", "تيارت", "تيسمسيلت", "أدرار", "النعامة", "تيبازة", "جيجل", "سعيدة", "خنشلة", "الوادي", "البيض", "غليزان", "أم البواقي"],
    "المغرب": ["الرباط", "الدار البيضاء", "مراكش", "فاس", "طنجة", "مكناس", "تطوان", "وجدة", "أغادير", "القنيطرة", "بني ملال", "خريبكة", "الجديدة", "سلا", "آسفي", "تارودانت", "العيون", "الناظور", "الراشيدية", "الحسيمة", "قلعة السراغنة", "الصويرة", "تمارة", "تاونات", "سيدي سليمان", "سيدي قاسم", "المحمدية", "العرائش", "الفقيه بن صالح", "تازة", "القصر الكبير", "الداخلة", "الخميسات", "زاكورة", "ورزازات", "تينغير"],
    "السودان": ["الخرطوم", "أم درمان", "بحري", "بورتسودان", "كسلا", "الأبيض", "الفاشر", "مدني", "عطبرة", "دنقلا", "كادقلي", "سنار", "الدمازين", "كوستي", "القضارف", "نيالا", "الجنينة", "زالنجي", "ود مدني", "شندي", "الحصاحيصا", "رفاعة", "الرهد", "سواكن", "بارا", "أبو جبيهة", "طوكر", "الدلنج", "بابنوسة", "كريمة"],
    "سوريا": ["دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس", "إدلب", "دير الزور", "الحسكة", "الرقة", "السويداء", "درعا", "القنيطرة", "الميادين", "البوكمال", "جبلة", "تل أبيض", "منبج", "إعزاز", "الباب", "صلخد", "دوما", "داريا", "الزبداني", "السلمية", "مصياف", "بانياس", "صافيتا", "المالكية", "عامودا"],
    "لبنان": ["بيروت", "طرابلس", "صيدا", "صور", "جبيل", "بعلبك", "زحلة", "النبطية", "جونية", "عاليه", "بعبدا", "بشري", "بعقلين", "شتورة", "دير القمر", "تبنين", "حاصبيا", "جب جنين", "راشيا", "بنت جبيل"],
    "الأردن": ["عمان", "الزرقاء", "إربد", "العقبة", "المفرق", "السلط", "الكرك", "معان", "مادبا", "جرش", "عجلون", "الرمثا", "الطفيلة", "الفحيص", "الصويفية", "دير علا", "الشوبك"],
    "تونس": ["تونس", "صفاقس", "سوسة", "بنزرت", "قابس", "القيروان", "تونس العاصمة", "سوسة", "صفاقس", "نابل", "قفصة", "المهدية", "القيروان", "بنزرت", "سليانة", "جندوبة", "زغوان", "مدنين", "قبلي", "تطاوين", "المنيهلة"],
    "العراق": ["بغداد", "البصرة", "الموصل", "أربيل", "النجف", "كربلاء", "دهوك", "السليمانية", "الكوت", "بعقوبة", "سامراء", "الرمادي", "الفلوجة", "تكريت", "الحلة"],
    "اليمن": ["صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت", "ذمار", "البيضاء", "شبوة", "الجوف", "مأرب", "الضالع", "حجة", "المهرة", "لحج"],
    "ليبيا": ["طرابلس", "بنغازي", "مصراتة", "سبها", "درنة", "الزاوية", "البيضاء", "جادو", "غريان", "اجدابيا", "زليتن", "الخمس", "ترهونة"],
    "موريتانيا": ["نواكشوط", "نواذيبو", "كيفه", "روصو", "العيون", "أطار", "أكجوجت", "سيلبابي", "كيهيدي", "تجكجة"],
    "البحرين": ["المنامة", "المحرق", "الرفاع", "الحد", "سترة", "جد حفص", "عيسى", "الدراز", "البديع", "الزلاق"],
    "عمان": ["مسقط", "صلالة", "نزوى", "بهلاء", "صور", "البريمي", "صحار", "بركاء", "عبري", "سيت", "دماء والطائيين", "مطرح", "الخابورة", "إبراء", "جعلان بني بو علي", "الرستاق", "الكامل والوافي", "وادي المعاول"],
    "جيبوتي": ["جيبوتي (العاصمة)", "تاجورة", "علي سابيح", "دوراليه", "قوريولي", "بليلة", "فجر", "دمجلي", "عسل", "أوبوك"],
    "فلسطين": ["القدس", "رام الله", "نابلس", "بيت لحم", "الخليل", "جنين", "طولكرم", "قلقيلية", "أريحا", "سلفيت", "طوباس", "بيت لحم", "غزة", "خان يونس", "رفح", "دير البلح", "خانيونس", "الشجاعية", "الزوايدة", "النصيرات", "المغازي", "بيت لاهيا"],
    "الصومال": ["مقديشو (العاصمة)", "بوساسو", "هرجيسا", "جالكعيو", "برعو", "كيسمايو", "بيدوا", "بلدوين", "طوسمريب", "جروي", "ملسو", "طوكر", "لوقا"],
    "جزر القمر": ["موروني (العاصمة)", "موهيلي", "أنجوان", "جزيرة القمر الكبرى", "نينغوي", "موي"],
    "إريتريا": ["أسمرة (العاصمة)", "كرن", "مصوع", "نيقلا", "تسني", "بارنتو", "دفني", "عدال"],
    "جنوب السودان": ["جوبا (العاصمة)", "واو", "ملكال", "بور", "ياي", "ملوال", "جوزي", "رياك", "أروب"]
};


function handleCountryChange(selectElement) {
    const selectedCountry = selectElement.value;
    const citySelect = selectElement.closest('.prayer-container').querySelector('select:nth-of-type(2)');
    populateCities(selectedCountry, citySelect);
}

function handleCityChange(selectElement) {
    const selectedCity = selectElement.value;
    const selectedCountry = selectElement.closest('.prayer-container').querySelector('select:nth-of-type(1)').value;

    if (selectedCity && selectedCountry) {
        fetchPrayerTimes(selectedCity, selectedCountry, selectElement);
    }
}

function populateCountries(selectElement) {
    for (let country in countriesAndCities) {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        selectElement.appendChild(option);
    }
}

function populateCities(country, citySelect) {
    citySelect.innerHTML = '<option value="">اختر المدينة</option>';
    citySelect.disabled = true;

    if (country && countriesAndCities[country]) {
        citySelect.disabled = false;
        countriesAndCities[country].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

window.onload = function() {
    const container = document.querySelector('.prayer-container');
    const countrySelect = container.querySelector('select:nth-of-type(1)');

    populateCountries(countrySelect);
    updateUIFromLocalStorage(countrySelect, container);
}

function fetchPrayerTimes(city, country, selectElement) {
    const apiUrl = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const timings = data.data.timings;
            const container = selectElement.closest('.prayer-container');
            container.querySelector('.fajr-time').textContent = timings.Fajr;
            container.querySelector('.sunrise-time').textContent = timings.Sunrise;
            container.querySelector('.dhuhr-time').textContent = timings.Dhuhr;
            container.querySelector('.asr-time').textContent = timings.Asr;
            container.querySelector('.maghrib-time').textContent = timings.Maghrib;
            container.querySelector('.isha-time').textContent = timings.Isha;

            // حفظ الدولة، المدينة، وأوقات الصلاة في LocalStorage
            const selectedCountry = container.querySelector('select:nth-of-type(1)').value;
            const selectedCity = container.querySelector('select:nth-of-type(2)').value;
            saveToLocalStorage(selectedCountry, selectedCity, timings);

            updateCountdown(timings, container);
        });
}

function updateCountdown(timings, container) {
    if (countdownTimeout) {
        clearTimeout(countdownTimeout);
    }

    const now = moment();
    const prayerTimes = [
        { row: container.querySelector('.fajr-prayer-row'), time: moment(timings.Fajr, "HH:mm") },
        { row: container.querySelector('.dhuhr-prayer-row'), time: moment(timings.Dhuhr, "HH:mm") },
        { row: container.querySelector('.asr-prayer-row'), time: moment(timings.Asr, "HH:mm") },
        { row: container.querySelector('.maghrib-prayer-row'), time: moment(timings.Maghrib, "HH:mm") },
        { row: container.querySelector('.isha-prayer-row'), time: moment(timings.Isha, "HH:mm") }
    ];

    let nextPrayer = null;

    for (let i = 0; i < prayerTimes.length; i++) {
        prayerTimes[i].row.classList.remove('highlighted-next-prayer');

        if (now.isBefore(prayerTimes[i].time)) {
            nextPrayer = prayerTimes[i];
            break;
        }
    }

    if (nextPrayer) {
        nextPrayer.row.classList.add('highlighted-next-prayer');
        const diff = nextPrayer.time.diff(now);
        container.querySelector('.prayer-countdown-timer').textContent = moment.utc(diff).format("HH:mm:ss");
        container.querySelector('.next-prayer-time').textContent = nextPrayer.time.format("h:mm A");

        // أظهر الديف مع الأذان عند موعد الصلاة
        if (diff < 1000 * 60) {  // قبل دقيقة واحدة من الصلاة
            showAdhanAlert();
        }

        countdownTimeout = setTimeout(() => updateCountdown(timings, container), 1000);
    } else {
        container.querySelector('.prayer-countdown-timer').textContent = "00:00:00";
        container.querySelector('.next-prayer-time').textContent = "غداً";
    }
}

function showAdhanAlert() {
    const adhanAlertDiv = document.getElementById('adhan-alert-container');
    const adhanAudio = document.getElementById('adhan-audio');

    // إظهار التنبيه
    adhanAlertDiv.style.display = 'flex';

    // التأكد من تحميل الصوت بالكامل قبل حساب المدة
    adhanAudio.addEventListener('canplaythrough', function playAudioOnce() {
        adhanAudio.play();

        adhanTimeout = setTimeout(() => {
            adhanAlertDiv.style.display = 'none';
            adhanAudio.pause();
            adhanAudio.currentTime = 0;
        }, adhanAudio.duration * 1000);

        // إزالة الحدث بعد أول تشغيل
        adhanAudio.removeEventListener('canplaythrough', playAudioOnce);
    });
}


function closeAdhanAlert() {
    const adhanAlertDiv = document.getElementById('adhan-alert-container');
    const adhanAudio = document.getElementById('adhan-audio');

    if (!adhanAlertDiv) {
        console.error('adhanAlertDiv غير موجود!');
        return;
    }

    if (!adhanAudio) {
        console.error('adhanAudio غير موجود!');
        return;
    }

    adhanAlertDiv.style.display = 'none';
    adhanAudio.pause();
    adhanAudio.currentTime = 0;

    if (adhanTimeout) {
        clearTimeout(adhanTimeout);
        console.log('تم مسح عداد الأذان.');
    } else {
        console.log('لا يوجد عداد لتوقيفه.');
    }
}

// طلب إذن الإشعارات
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                console.log("إذن الإشعارات مرفوض.");
            }
        });
    }
}

// عرض الإشعار
function showNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body });
    }
}

// جدولة الإشعار
function schedulePrayerNotification(prayerName, prayerTime) {
    const now = moment();
    const prayerMoment = moment(prayerTime, "HH:mm");
    const diffMs = prayerMoment.diff(now);

    if (diffMs > 0) {
        setTimeout(() => {
            showNotification("وقت الصلاة", `حان الآن وقت صلاة ${prayerName}`);
        }, diffMs);
    }
}

// تحديث العد التنازلي وجدولة الإشعارات
function updateCountdownAndNotifications(timings, container) {
    if (countdownTimeout) {
        clearTimeout(countdownTimeout);
    }

    const now = moment();
    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    let nextPrayerName = null;
    let nextPrayerTime = null;

    for (let prayer of prayers) {
        const prayerMoment = moment(timings[prayer], "HH:mm");
        if (prayerMoment.isAfter(now)) {
            nextPrayerName = prayer;
            nextPrayerTime = timings[prayer];
            break;
        }
    }

    if (nextPrayerName && nextPrayerTime) {
        const diffMs = moment(nextPrayerTime, "HH:mm").diff(now);
        container.querySelector('.next-prayer').textContent = `${nextPrayerName} - ${nextPrayerTime}`;

        countdownTimeout = setTimeout(() => {
            updateCountdownAndNotifications(timings, container);
        }, diffMs);

        // جدولة الإشعار
        schedulePrayerNotification(nextPrayerName, nextPrayerTime);
    }
}







// ----------------------------------------------------------------------------------------------------------------------

// إحداثيات الكعبة المكرمة
const qiblaCoordinates = { lat: 21.4225, lon: 39.8262 };

// حساب اتجاه القبلة
function getQiblaDirection(latitude, longitude) {
    const phi = Math.PI / 180 * latitude;
    const lambda = Math.PI / 180 * longitude;
    const qiblaLat = Math.PI / 180 * qiblaCoordinates.lat;
    const qiblaLon = Math.PI / 180 * qiblaCoordinates.lon;

    const deltaLon = qiblaLon - lambda;
    const y = Math.sin(deltaLon);
    const x = Math.cos(phi) * Math.tan(qiblaLat) - Math.sin(phi) * Math.cos(deltaLon);

    let qiblaAngle = Math.atan2(y, x) * 180 / Math.PI;
    qiblaAngle = (qiblaAngle + 360) % 360; // التأكد من أن الزاوية بين 0 و 360

    return qiblaAngle;
}

// حساب المسافة بين نقطتين باستخدام معادلة هافرسين (Haversine Formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // نصف قطر الأرض بالكيلومترات
    const phi1 = lat1 * Math.PI / 180;
    const phi2 = lat2 * Math.PI / 180;
    const deltaPhi = (lat2 - lat1) * Math.PI / 180;
    const deltaLambda = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // المسافة بالكيلومترات
}

// الحصول على الموقع الجغرافي للمستخدم
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            const qiblaAngle = getQiblaDirection(userLat, userLon);

            // حساب المسافات في الاتجاهات الأربعة
            const northDistance = calculateDistance(userLat, userLon, 90, userLon); // شمال
            const southDistance = calculateDistance(userLat, userLon, -90, userLon); // جنوب
            const eastDistance = calculateDistance(userLat, userLon, userLat, 180); // شرق
            const westDistance = calculateDistance(userLat, userLon, userLat, -180); // غرب

            // تحديث الـ spans بالمسافات
            document.getElementById("north-distance").textContent = `الشمال: ${northDistance.toFixed(2)} كم`;
            document.getElementById("south-distance").textContent = `الجنوب: ${southDistance.toFixed(2)} كم`;
            document.getElementById("east-distance").textContent = `الشرق: ${eastDistance.toFixed(2)} كم`;
            document.getElementById("west-distance").textContent = `الغرب: ${westDistance.toFixed(2)} كم`;

            // استماع لاتجاه الجهاز
            if (window.DeviceOrientationEvent) {
                window.addEventListener("deviceorientation", function(event) {
                    const alpha = event.alpha; // زاوية الجهاز من البوصلة
                    const direction = (alpha - qiblaAngle + 360) % 360;

                    // تحديث دوران السهم
                    document.getElementById("qibla-arrow").style.transform = `rotate(${direction}deg)`;
                });
            } else {
                alert("جهازك لا يدعم مستشعر البوصلة.");
            }
        }, (error) => {
            alert("حدث خطأ أثناء الحصول على الموقع: " + error.message);
        });
    } else {
        alert("المتصفح لا يدعم تحديد الموقع الجغرافي.");
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // إظهار/إخفاء div عند النقر على الزر
    document.getElementById("show-qibla-container").addEventListener("click", function() {
        const qiblaContainer = document.getElementById("qibla-container");
        const overlay = document.getElementById("overlay");
        
        qiblaContainer.style.display = "block"; // عرض الـ div
        overlay.style.display = "flex"; // عرض الـ overlay
        document.body.style.overflow = "hidden"; // إيقاف التمرير عند فتح الـ div
    });

    // إخفاء الـ div والـ overlay عند النقر على الـ overlay (لكن ليس عند النقر داخل qibla-container)
    document.getElementById("overlay").addEventListener("click", function(event) {
        // التأكد من أن النقر حدث على الـ overlay وليس على qibla-container
        if (!document.getElementById("qibla-container").contains(event.target)) {
            const qiblaContainer = document.getElementById("qibla-container");
            const overlay = document.getElementById("overlay");

            qiblaContainer.style.display = "none"; // إخفاء الـ div
            overlay.style.display = "none"; // إخفاء الـ overlay
            document.body.style.overflow = "hidden"; // إعادة التمرير عند إغلاق الـ div

            // إعادة التمرير إلى حالته الأصلية
            window.scrollTo(0, 0);
        }
    });

    // إضافة حدث للنقر على qibla-arrow-container لعرض رسالة تحديد القبلة
    const qiblaArrowContainer = document.getElementById("qibla-arrow-container");
    if (qiblaArrowContainer) {
        qiblaArrowContainer.addEventListener("click", function() {
            alert("تحديد القبلة من جديد.");
            getUserLocation();  // إعادة حساب اتجاه القبلة
        });
    }

    getUserLocation(); // تشغيل دالة الحصول على الموقع الجغرافي
});



// ----------------------------------------------------------------------------------------------------------------------





function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ar-EG', options);
    document.getElementById('date').innerText = formattedDate; // تحديث النص
}

// استخدام DOMContentLoaded للتأكد من تحميل الصفحة قبل تنفيذ الكود
document.addEventListener('DOMContentLoaded', function() {
    updateDate();
    // تحديث التاريخ كل 24 ساعة
    setInterval(updateDate, 24 * 60 * 60 * 1000);
});





