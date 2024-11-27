// تشغيل الكود بعد تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
    // استهداف الديف الرئيسي باستخدام id
    const container = document.getElementById("container");

    // التحقق من وجود العنصر قبل محاولة إدخال المحتوى
    if (container) {
        // إضافة المحتوى المطلوب داخل الديف
        container.innerHTML = `
          <div class="home">
              <div class="home-div">
                  <a href="#">
                      <div class="logo pagee">
                          <img src="logo-no-background.png" class="xx2" alt="Logo 1">
                          <img src="logo-no-background2.png" class="xx img-logo" alt="Logo 2">
                      </div>
                  </a>
                  <div class="fof">
                      <button class="logo_button cvme" id="coos" data-tooltip="Eye protection">
                          <ion-icon name="eye-outline" role="img" class="md hydrated" aria-label="eye outline"></ion-icon>
                      </button>
                      <div class="fof-div vo1">
                          <button class="logo_button">
                              <ion-icon name="download-outline" role="img" class="md hydrated" aria-label="download outline"></ion-icon>
                          </button>
                          <div class="fof-dive">
                              <div>
                                  <button class="download-button-link">Apple
                                      <ion-icon name="logo-apple" role="img" class="md hydrated" aria-label="logo apple"></ion-icon>
                                  </button>
                                  <button class="download-button-link">Android
                                      <ion-icon name="logo-android" role="img" class="md hydrated" aria-label="logo android"></ion-icon>
                                  </button>
                              </div>
                          </div>
                      </div>
                      <div class="fof-div">
                          <button class="logo_button pagee">
                              <ion-icon name="code" role="img" class="md hydrated" aria-label="code"></ion-icon>
                          </button>
                          <div class="fof-dive">
                              <div>
                                  <span>
                                      <div style="color: #b0bcc4; display: inline-flex;">&lt; frame &gt;</div> قم بنسخ الـ
                                  </span>
                                  <br>
                                  <span>لإضافة أوقات الصلاة إلى موقعك بالإضافة إلى أذكار الصباح والمساء وغيرها من الأشياء</span>
                                  <br>
                                  <textarea readonly class="frame copyable">
                                      &lt;iframe src="file:///C:/Users/Lenovo/OneDrive/Desktop/Chat%20[%20Eyad%20]/noon/noon.html" frameborder="0"&gt;&lt;/iframe&gt;
                                  </textarea>
                              </div>
                          </div>
                      </div>
                      <button class="logo_button cvme" id="shareButton" data-tooltip="Share">
                          <ion-icon name="arrow-redo" role="img" class="md hydrated" aria-label="arrow redo"></ion-icon>
                      </button>
                      <div class="fof-div cke vo" style="display: none;">
                          <button class="logo_button">
                              <ion-icon name="ellipsis-vertical" role="img" class="md hydrated" aria-label="ellipsis vertical"></ion-icon>
                          </button>
                          <div class="fof-dive">
                              <div>
                                  <button class="kkf">
                                      <ion-icon name="code-outline" role="img" class="md hydrated" aria-label="code outline"></ion-icon>نسخ الكود
                                  </button>
                                  <hr>
                                  <button class="kkf">
                                      <ion-icon name="download-outline" role="img" class="md hydrated" aria-label="download outline"></ion-icon>Apple
                                  </button>
                                  <button class="kkf">
                                      <ion-icon name="download-outline" role="img" class="md hydrated" aria-label="download outline"></ion-icon>Android
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        `;
    } else {
        // رسالة توضح أن العنصر غير موجود
        console.error("العنصر '#container' غير موجود في الصفحة. يرجى التحقق من الكود.");
    }
});
