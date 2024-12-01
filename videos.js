document.addEventListener("DOMContentLoaded", () => {
    let currentVideo = null; // لتخزين الفيديو المشغل حاليًا
    let currentPlayPauseButton = null; // لتخزين زر التشغيل/الإيقاف الحالي

    function createButtonWithLabel(iconName, labelText, onClickHandler) {
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('button-wrapper');

        const button = document.createElement('button');
        button.classList.add('containersk-button');
        button.innerHTML = `<ion-icon name="${iconName}"></ion-icon>`;
        button.addEventListener('click', onClickHandler);

        const label = document.createElement('span');
        label.textContent = labelText;

        buttonWrapper.appendChild(button);
        buttonWrapper.appendChild(label);

        return buttonWrapper;
    }

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

        // زر إيقاف وتشغيل الفيديو
        const playPauseButton = createButtonWithLabel('play', 'تشغيل', () => {
            // إيقاف الفيديو الحالي إذا كان هناك فيديو آخر قيد التشغيل
            if (currentVideo && currentVideo !== video) {
                currentVideo.pause();
                currentVideo.currentTime = 0; // إعادة الفيديو إلى البداية
                if (currentPlayPauseButton) {
                    const icon = currentPlayPauseButton.querySelector('ion-icon');
                    if (icon) {
                        icon.setAttribute('name', 'play');
                    }
                }
            }

            // تحقق من حالة الفيديو وتجنب التعارض بين التشغيل والإيقاف
            if (video.paused || video.ended) {
                video.play().then(() => {
                    const icon = playPauseButton.querySelector('ion-icon');
                    if (icon) {
                        icon.setAttribute('name', 'pause');
                    }
                }).catch((error) => {
                    console.error("خطأ في تشغيل الفيديو:", error);
                });
            } else {
                video.pause();
                const icon = playPauseButton.querySelector('ion-icon');
                if (icon) {
                    icon.setAttribute('name', 'play');
                }
            }

            currentVideo = video;
            currentPlayPauseButton = playPauseButton;
        });
        controls.appendChild(playPauseButton);

        // زر مشاركة الفيديو
        const shareButton = createButtonWithLabel('share-social', 'شارك', () => {
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

        // زر تنزيل الفيديو مع رسالة تأكيد
        const downloadButton = createButtonWithLabel('download-outline', 'تنزيل', () => {
            const userConfirmed = confirm('هل تريد بالتأكيد تنزيل هذا الفيديو؟');
            if (userConfirmed) {
                const link = document.createElement('a');
                link.href = videoSrc;
                link.download = videoSrc.split('/').pop(); // استخدام اسم الملف من الرابط
                link.click();
            } else {
                alert('تم إلغاء التنزيل.');
            }
        });
        controls.appendChild(downloadButton);

        // إضافة التحكمات إلى الحاوية
        container.appendChild(controls);

        // إضافة المحتوى إلى الصفحة
        document.getElementById('video-wrapper-container').appendChild(container);

        // تحديث الوقت المتبقي بعد تحميل الفيديو
        video.addEventListener('loadedmetadata', () => {
            const videoDuration = video.duration;
            video.addEventListener('timeupdate', () => {
                const remainingTime = Math.max(0, Math.round(videoDuration - video.currentTime));
                timeLeft.textContent = `الوقت: ${remainingTime} ثانية`;
            });
        });

        // حدث عندما ينتهي الفيديو
        video.addEventListener('ended', () => {
            const icon = playPauseButton.querySelector('ion-icon');
            if (icon) {
                icon.setAttribute('name', 'play');
            }
            if (currentVideo === video) {
                currentVideo = null;
                currentPlayPauseButton = null;
            }
            timeLeft.textContent = 'الوقت: 0 ثانية';

            // الانتقال إلى الفيديو التالي بعد الانتهاء من الفيديو الحالي
            scrollToNextVideo(container);
        });
    }

    // دالة التمرير إلى الفيديو التالي
    function scrollToNextVideo(currentVideoContainer) {
        const nextVideoContainer = currentVideoContainer.nextElementSibling; // الحصول على العنصر التالي
        if (nextVideoContainer) {
            nextVideoContainer.scrollIntoView({
                behavior: 'smooth', // التمرير بشكل سلس
                block: 'start' // التمرير ليظهر في أعلى الشاشة
            });

            // تشغيل الفيديو التالي وإيقاف الفيديو الحالي
            const nextVideo = nextVideoContainer.querySelector('video');
            if (nextVideo) {
                if (currentVideo) {
                    currentVideo.pause(); // إيقاف الفيديو الحالي
                }
                nextVideo.play(); // تشغيل الفيديو التالي
                currentVideo = nextVideo;
                const nextPlayPauseButton = nextVideoContainer.querySelector('.containersk-button');
                if (nextPlayPauseButton) {
                    const icon = nextPlayPauseButton.querySelector('ion-icon');
                    if (icon) {
                        icon.setAttribute('name', 'pause'); // تعيين زر التشغيل/الإيقاف للفيديو التالي
                    }
                }
            }
        }
    }

    // دالة الانتقال إلى الفيديو السابق
    function scrollToPreviousVideo(currentVideoContainer) {
        const prevVideoContainer = currentVideoContainer.previousElementSibling; // الحصول على العنصر السابق
        if (prevVideoContainer) {
            prevVideoContainer.scrollIntoView({
                behavior: 'smooth', // التمرير بشكل سلس
                block: 'start' // التمرير ليظهر في أعلى الشاشة
            });

            // تشغيل الفيديو السابق وإيقاف الفيديو الحالي
            const prevVideo = prevVideoContainer.querySelector('video');
            if (prevVideo) {
                if (currentVideo) {
                    currentVideo.pause(); // إيقاف الفيديو الحالي
                }
                prevVideo.play(); // تشغيل الفيديو السابق
                currentVideo = prevVideo;
                const prevPlayPauseButton = prevVideoContainer.querySelector('.containersk-button');
                if (prevPlayPauseButton) {
                    const icon = prevPlayPauseButton.querySelector('ion-icon');
                    if (icon) {
                        icon.setAttribute('name', 'pause'); // تعيين زر التشغيل/الإيقاف للفيديو السابق
                    }
                }
            }
        }
    }

    // إضافة أزرار التنقل بين الفيديوهات (القديم والجديد)
    function addNavigationButtons() {
        const navigationWrapper = document.createElement('div');
        navigationWrapper.classList.add('navigation-buttons');

        const prevButton = document.createElement('button');
        prevButton.textContent = 'الفيديو السابق';
        prevButton.addEventListener('click', () => {
            if (currentVideo) {
                const currentVideoContainer = currentVideo.closest('.video-container');
                scrollToPreviousVideo(currentVideoContainer);
            }
        });

        const nextButton = document.createElement('button');
        nextButton.textContent = 'الفيديو التالي';
        nextButton.addEventListener('click', () => {
            if (currentVideo) {
                const currentVideoContainer = currentVideo.closest('.video-container');
                scrollToNextVideo(currentVideoContainer);
            }
        });

        navigationWrapper.appendChild(prevButton);
        navigationWrapper.appendChild(nextButton);

        document.getElementById('video-wrapper-container').appendChild(navigationWrapper);
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

    // إضافة الفيديوهات إلى الصفحة
    videoLinks.forEach(link => addVideoDiv(link));

    // إضافة أزرار التنقل بين الفيديوهات
    addNavigationButtons();
});
