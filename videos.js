document.addEventListener("DOMContentLoaded", () => {
    let currentVideo = null; // لتخزين الفيديو المشغل حاليًا
    let currentPlayPauseButton = null; // لتخزين زر التشغيل/الإيقاف الحالي

    function addVideoDiv(videoSrc) {
        // إنشاء ديف الحاوي
        const container = document.createElement('div');
        container.classList.add('video-container');

        // إنشاء ديف الفيديو
        const videoWrapper = document.createElement('div');
        videoWrapper.classList.add('video-wrapper');

        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = false; // تعطيل أدوات الفيديو المدمجة
        video.style.width = '100%'; // التأكد من أن الفيديو يأخذ المساحة كاملة

        // إضافة الفيديو إلى ال div
        videoWrapper.appendChild(video);
        container.appendChild(videoWrapper);

        // ديف التحكمات أسفل الفيديو
        const controls = document.createElement('div');
        controls.classList.add('controls');

        // وقت الفيديو المتبقي
        const timeLeft = document.createElement('span');
        timeLeft.textContent = 'الوقت: 0 ثانية'; // عرض الوقت المتبقي كـ "0 ثانية"
        controls.appendChild(timeLeft);

        // زر إيقاف وتشغيل الفيديو باستخدام أيقونة
        const playPauseButton = document.createElement('button');
        playPauseButton.classList.add('containersk-button');
        playPauseButton.innerHTML = '<ion-icon name="play"></ion-icon>'; // أيقونة تشغيل
        playPauseButton.addEventListener('click', () => {
            // إذا كان هناك فيديو قيد التشغيل سابقًا، أوقفه وأعد زر التشغيل/الإيقاف إلى حالة التشغيل
            if (currentVideo && currentVideo !== video) {
                currentVideo.pause(); // إيقاف الفيديو السابق
                currentVideo.currentTime = 0; // إعادة تعيين الزمن إلى البداية
                if (currentPlayPauseButton) {
                    currentPlayPauseButton.innerHTML = '<ion-icon name="play"></ion-icon>'; // تغيير أيقونة الزر السابق
                }
            }

            if (video.paused) {
                video.play().then(() => {
                    playPauseButton.innerHTML = '<ion-icon name="pause"></ion-icon>'; // تغيير الأيقونة إلى إيقاف
                }).catch((error) => {
                    console.error("خطأ في تشغيل الفيديو:", error);
                });
            } else {
                video.pause();
                playPauseButton.innerHTML = '<ion-icon name="play"></ion-icon>'; // تغيير الأيقونة إلى تشغيل
            }

            // تحديث الفيديو وزر التشغيل الحالي
            currentVideo = video;
            currentPlayPauseButton = playPauseButton;
        });
        controls.appendChild(playPauseButton);

        // حدث عندما ينتهي الفيديو
        video.addEventListener('ended', () => {
            playPauseButton.innerHTML = '<ion-icon name="play"></ion-icon>'; // تغيير الأيقونة إلى تشغيل عند الانتهاء
            if (currentVideo === video) {
                currentVideo = null; // إعادة تعيين الفيديو المشغل
                currentPlayPauseButton = null; // إعادة تعيين زر التشغيل
            }
            timeLeft.textContent = 'الوقت: 0 ثانية'; // عرض "0 ثانية" عند نهاية الفيديو
        });

        // زر مشاركة الفيديو
        const shareButton = document.createElement('button');
        shareButton.classList.add('containersk-button');
        shareButton.innerHTML = '<ion-icon name="share-social"></ion-icon>'; // أيقونة المشاركة
        shareButton.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'فيديو مميز',
                    text: 'شاهد هذا الفيديو الرائع!',
                    url: videoSrc
                }).then(() => {
                    console.log('تمت مشاركة الفيديو');
                }).catch((error) => {
                    console.error('فشل المشاركة: ', error);
                });
            } else {
                alert('هذه الميزة غير مدعومة في متصفحك.');
            }
        });
        controls.appendChild(shareButton);

        // زر تنزيل الفيديو
        const downloadButton = document.createElement('button');
        downloadButton.classList.add('containersk-button');
        downloadButton.innerHTML = '<ion-icon name="download-outline"></ion-icon>'; // أيقونة التنزيل
        downloadButton.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = videoSrc;
            link.download = videoSrc.split('/').pop(); // استخدام اسم الملف من الرابط
            link.click(); // تنفيذ عملية التنزيل
        });
        controls.appendChild(downloadButton);

        // إضافة التحكمات إلى الحاوية
        container.appendChild(controls);

        // إضافة المحتوى إلى الصفحة
        document.getElementById('video-wrapper-container').appendChild(container);

        // تحديث الوقت المتبقي بعد تحميل الفيديو
        video.addEventListener('loadedmetadata', () => {
            const videoDuration = video.duration; // مدة الفيديو
            video.addEventListener('timeupdate', () => {
                const remainingTime = Math.max(0, Math.round(videoDuration - video.currentTime));
                timeLeft.textContent = `الوقت: ${remainingTime} ثانية`; // تحديث الوقت المتبقي
            });
        });
    }

    // قائمة روابط الفيديوهات
    const videoLinks = [
        'https://videos.pexels.com/video-files/7401908/7401908-hd_1920_1080_25fps.mp4',
        'https://videos.pexels.com/video-files/8165553/8165553-uhd_1440_2560_25fps.mp4',
        'https://videos.pexels.com/video-files/7318806/7318806-hd_1080_1920_30fps.mp4',
        'https://videos.pexels.com/video-files/16510575/16510575-sd_360_640_30fps.mp4',
        'https://videos.pexels.com/video-files/28077962/12294863_360_640_60fps.mp4',
        'https://videos.pexels.com/video-files/11803764/11803764-sd_360_640_30fps.mp4',
        'https://videos.pexels.com/video-files/28077960/12294761_360_640_60fps.mp4',
        'https://videos.pexels.com/video-files/27411331/12138025_360_640_60fps.mp4',
        'https://videos.pexels.com/video-files/8165100/8165100-sd_360_640_25fps.mp4',
        'https://videos.pexels.com/video-files/8165766/8165766-sd_360_640_25fps.mp4',
        'https://videos.pexels.com/video-files/7157380/7157380-sd_640_360_24fps.mp4',
        'https://videos.pexels.com/video-files/8165768/8165768-sd_360_640_25fps.mp4',
        'https://videos.pexels.com/video-files/8165170/8165170-sd_360_640_25fps.mp4',
        'https://videos.pexels.com/video-files/8165914/8165914-sd_360_640_25fps.mp4',
        'https://videos.pexels.com/video-files/8165766/8165766-sd_360_640_25fps.mp4'
    ];

    // إضافة الفيديوهات عند تحميل الصفحة
    videoLinks.forEach(link => {
        addVideoDiv(link);
    });
});
