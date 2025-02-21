document.addEventListener("DOMContentLoaded", () => {
    let currentVideo = null; 
    let currentPlayPauseButton = null; 

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
        const container = document.createElement('div');
        container.classList.add('video-container');

        const videoWrapper = document.createElement('div');
        videoWrapper.classList.add('video-wrapper');

        const video = document.createElement('video');
        video.src = videoSrc;
        video.controls = false; 
        video.style.width = '100%';

        videoWrapper.appendChild(video);
        container.appendChild(videoWrapper);

        const controls = document.createElement('div');
        controls.classList.add('controls');

        const timeLeft = document.createElement('span');
        timeLeft.textContent = 'الوقت: 0 ثانية'; 
        controls.appendChild(timeLeft);

        const playPauseButton = createButtonWithLabel('play', 'تشغيل', () => {
            if (currentVideo && currentVideo !== video) {
                currentVideo.pause();
                currentVideo.currentTime = 0;
                if (currentPlayPauseButton) {
                    const icon = currentPlayPauseButton.querySelector('ion-icon');
                    if (icon) {
                        icon.setAttribute('name', 'play');
                    }
                }
            }

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

        const downloadButton = createButtonWithLabel('download-outline', 'تنزيل', () => {
            const userConfirmed = confirm('هل تريد بالتأكيد تنزيل هذا الفيديو؟');
            if (userConfirmed) {
                const link = document.createElement('a');
                link.href = videoSrc;
                link.download = videoSrc.split('/').pop();
                link.click();
            } else {
                alert('تم إلغاء التنزيل.');
            }
        });
        controls.appendChild(downloadButton);

        // إضافة شريط التمرير داخل <zero></zero>
        const progressBarContainer = document.createElement('zero');
        const progressBar = document.createElement('hr');
        progressBar.classList.add('progress-bar');
        progressBarContainer.appendChild(progressBar);
        controls.appendChild(progressBarContainer);

        container.appendChild(controls);

        document.getElementById('video-wrapper-container').appendChild(container);

        video.addEventListener('loadedmetadata', () => {
            const videoDuration = video.duration;

            // تحديث الوقت المتبقي والتحرك في شريط التمرير
            video.addEventListener('timeupdate', () => {
                const remainingTime = Math.max(0, Math.round(videoDuration - video.currentTime));
                timeLeft.textContent = `الوقت: ${remainingTime} ثانية`;

                // تحريك شريط التمرير
                const progressPercentage = (video.currentTime / videoDuration) * 100;
                progressBar.style.width = `${progressPercentage}%`;
            });
        });

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

            scrollToNextVideo(container);
        });

        // إضافة حدث الضغط على شريط التمرير
        progressBarContainer.addEventListener('click', (event) => {
            const progressBarWidth = progressBarContainer.offsetWidth;
            const clickPosition = event.offsetX;
            const newTime = (clickPosition / progressBarWidth) * video.duration;
            video.currentTime = newTime;

            // إذا كان الفيديو متوقفًا لا نقوم بتشغيله
            if (!video.paused && !video.ended) {
                video.play();
            }
        });
    }

    function scrollToNextVideo(currentVideoContainer) {
        const nextVideoContainer = currentVideoContainer.nextElementSibling;
        if (nextVideoContainer) {
            nextVideoContainer.scrollIntoView({
                behavior: 'smooth', 
                block: 'start'
            });

            const nextVideo = nextVideoContainer.querySelector('video');
            if (nextVideo) {
                if (currentVideo) {
                    currentVideo.pause();
                    currentVideo.currentTime = 0;  // إعادة تعيين الوقت إلى الصفر عند الانتقال
                }
                nextVideo.play();
                currentVideo = nextVideo;
                const nextPlayPauseButton = nextVideoContainer.querySelector('.containersk-button');
                if (nextPlayPauseButton) {
                    const icon = nextPlayPauseButton.querySelector('ion-icon');
                    if (icon) {
                        icon.setAttribute('name', 'pause');
                    }
                }
            }
        }
    }

    function scrollToPreviousVideo(currentVideoContainer) {
        const prevVideoContainer = currentVideoContainer.previousElementSibling;
        if (prevVideoContainer) {
            prevVideoContainer.scrollIntoView({
                behavior: 'smooth', 
                block: 'start'
            });

            const prevVideo = prevVideoContainer.querySelector('video');
            if (prevVideo) {
                if (currentVideo) {
                    currentVideo.pause();
                    currentVideo.currentTime = 0;  // إعادة تعيين الوقت إلى الصفر عند الانتقال
                }
                prevVideo.play();
                currentVideo = prevVideo;
                const prevPlayPauseButton = prevVideoContainer.querySelector('.containersk-button');
                if (prevPlayPauseButton) {
                    const icon = prevPlayPauseButton.querySelector('ion-icon');
                    if (icon) {
                        icon.setAttribute('name', 'pause');
                    }
                }
            }
        }
    }

    // التمرير باستخدام العجلة على الكمبيوتر
    // السماح بالتمرير فقط داخل عناصر .xc2
    document.querySelectorAll('.xc2').forEach(container => {
        container.addEventListener('wheel', (event) => {
            event.preventDefault(); // منع السلوك الافتراضي للتمرير

            if (event.deltaY > 0) {
                // التمرير للأسفل
                const currentVideoContainer = currentVideo?.closest('.video-container');
                if (currentVideoContainer) {
                    scrollToNextVideo(currentVideoContainer);
                }
            } else if (event.deltaY < 0) {
                // التمرير للأعلى
                const currentVideoContainer = currentVideo?.closest('.video-container');
                if (currentVideoContainer) {
                    scrollToPreviousVideo(currentVideoContainer);
                }
            }
        });
    });

    // إضافة أزرار التنقل
    function addNavigationButtons() {
        const navigationWrapper = document.createElement('div');
        navigationWrapper.classList.add('navigation-buttons');

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '<ion-icon name="arrow-up-outline"></ion-icon>';
        prevButton.addEventListener('click', () => {
            if (currentVideo) {
                const currentVideoContainer = currentVideo.closest('.video-container');
                scrollToPreviousVideo(currentVideoContainer);
            }
        });

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<ion-icon name="arrow-down-outline"></ion-icon>';
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

    addNavigationButtons();

    addVideoDiv('https://server14.mp3quran.net/islam/Rewayat-Hafs-A-n-Assem/001.mp3');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/02%D9%88%D8%A3%D9%85%D8%A7_%D8%A7%D9%84%D8%B0%D9%8A%D9%86_%D8%B3%D8%B9%D8%AF%D9%88%D8%A7_-_%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%84%D9%87_%D8%A7%D9%84%D8%AE%D9%84%D9%81.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/03%D8%A5%D9%86%D8%A7_%D8%AC%D8%B9%D9%84%D9%86%D8%A7_%D9%85%D8%A7_%D8%B9%D9%84%D9%89_%D8%A7%D9%84%D8%A3%D8%B1%D8%B6_%D8%B2%D9%8A%D9%86%D8%A9_-_%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%85%D8%AD%D8%B3%D9%86_%D8%A7%D9%84%D8%B6%D8%A8%D8%A7%D8%AD.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/04%D9%81%D8%A7%D8%B5%D8%A8%D8%B1_%D9%84%D8%AD%D9%83%D9%85_%D8%B1%D8%A8%D9%83_-_%D8%B5%D9%84%D8%A7%D8%AD_%D8%A7%D9%84%D9%85%D9%84%D9%8A%D9%83%D9%8A_%D8%B1%D8%AD%D9%85%D9%87_%D8%A7%D9%84%D9%84%D9%87.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/06%D9%88%D8%A3%D9%86_%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%AC%D8%AF_%D9%84%D9%84%D9%87_-_%D9%87%D9%8A%D8%AB%D9%85_%D8%A7%D9%84%D8%AF%D8%AE%D9%8A%D9%86.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/07%D9%82%D9%84_%D8%A3%D9%88%D8%AD%D9%8A_%D8%A5%D9%84%D9%8A_-_%D8%A8%D8%AF%D8%B1_%D8%A7%D9%84%D8%AA%D8%B1%D9%83%D9%8A.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/08%D8%A5%D8%B0_%D8%A3%D9%88%D9%89_%D8%A7%D9%84%D9%81%D8%AA%D9%8A%D8%A9_%D8%A5%D9%84%D9%89_%D8%A7%D9%84%D9%83%D9%87%D9%81_-_%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%84%D9%87_%D8%A7%D9%84%D9%85%D9%88%D8%B3%D9%89.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/09%D8%A5%D9%86%D9%85%D8%A7_%D8%A8%D8%BA%D9%8A%D9%83%D9%85_%D8%B9%D9%84%D9%89_%D8%A3%D9%86%D9%81%D8%B3%D9%83%D9%85_-_%D9%85%D8%B5%D8%B7%D9%81%D9%89_%D9%82%D8%AF%D8%B3%D9%8A.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/100%D9%8A%D8%B9%D9%84%D9%85_%D8%AE%D8%A7%D8%A6%D9%86%D8%A9_%D8%A7%D9%84%D8%A3%D8%B9%D9%8A%D9%86_-_%D8%A3%D8%AD%D9%85%D8%AF_%D8%A7%D9%84%D9%86%D9%81%D9%8A%D8%B3.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/15%D9%88%D9%84%D8%A7%D8%AA%D8%B2%D8%B1%D9%88%D8%A7_%D9%88%D8%A7%D8%B2%D8%B1%D8%A9_-_%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86_%D8%A7%D9%84%D9%85%D8%A7%D8%AC%D8%AF.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/14%D8%A3%D9%81%D9%85%D9%86_%D8%B2%D9%8A%D9%86_%D9%84%D9%87_%D8%B3%D9%88%D8%A1_%D8%B9%D9%85%D9%84%D9%87.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/13%D8%B5%D9%85_%D8%A8%D9%83%D9%85_%D8%B9%D9%85%D9%8A_-_%D8%B3%D8%B9%D9%88%D8%AF_%D8%A7%D9%84%D9%81%D8%A7%D9%8A%D8%B2.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/12%D9%82%D8%A7%D9%84_%D8%B3%D9%86%D9%86%D8%B8%D8%B1_%D8%A3%D8%B5%D8%AF%D9%82%D8%AA_-_%D8%B9%D9%85%D8%B1_%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%84%D9%87.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/11%D8%A5%D8%B0_%D8%A3%D9%88%D9%89_%D8%A7%D9%84%D9%81%D8%AA%D9%8A%D8%A9_%D8%A5%D9%84%D9%89_%D8%A7%D9%84%D9%83%D9%87%D9%81_-_%D9%87%D8%B2%D8%A7%D8%B9_%D8%A7%D9%84%D8%A8%D9%84%D9%88%D8%B4%D9%8A.mp4');
    addVideoDiv('https://upload.mp3quran.net/tadabbor/10%D9%88%D8%B9%D8%AC%D8%A8%D9%88%D8%A7_%D8%A3%D9%86_%D8%AC%D8%A7%D8%A6%D9%87%D9%85_%D9%85%D9%86%D8%B0%D9%86%D8%B2%D9%88%D8%B1_%D9%85%D9%86%D9%87%D9%85_-_%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2_%D8%A7%D9%84%D9%81%D9%8A%D8%B5%D9%84.mp4');
});
