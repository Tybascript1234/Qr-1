const code1 = `
  <p>مرحبا بك يسعدنا مساهمتك معنا</p>
  <div>
      <p>قم بإرفاق الملف</p>
      <p>قم بملئ معلومات تسجيل الدخول</p>
      <p>اضغط على زرار الإرسال ليتم مراجعة المحتوى ثم اضافته الى الموقع</p>
  </div>
  `;

  // وظيفة لتحويل الكود إلى ترميز HTML (escape)
  function escapeHTML(str) {
      return str.replace(/[&<>"']/g, function (char) {
          return {
              '&': '&amp;',
              '<': '&lt;',
              '>': '&gt;',
              '"': '&quot;',
              "'": '&#39;'
          }[char];
      });
  }

  // وظيفة لتحديد لغة البرمجة بناءً على امتداد الملف
  function getLanguageByExtension(fileName) {
      const extension = fileName.split('.').pop().toLowerCase();
      switch (extension) {
          case 'html':
          case 'htm':
              return 'language-markup'; // HTML
          case 'css':
              return 'language-css'; // CSS
          case 'js':
              return 'language-javascript'; // JavaScript
          case 'py':
              return 'language-python'; // Python
          case 'java':
              return 'language-java'; // Java
          case 'php':
              return 'language-php'; // PHP
          case 'rb':
              return 'language-ruby'; // Ruby
          default:
              return 'language-text'; // Text if no match
      }
  }

  // وظيفة لإضافة الكود والأزرار لكل حاوية
  function addCodeWithButtons(containerId, code) {
      const container = document.getElementById(containerId);
      const escapedCode = escapeHTML(code);
      
      // تخزين الكود الأصلي
      const originalCode = code;

      // إنشاء محتوى الكود
      container.innerHTML = `
      <div style="top: 0; display: flex ; align-items: center; justify-content: space-between; width: -webkit-fill-available; height: 38px; background: white; /* box-shadow: 1px 1px 0px #f5f2f0 inset, -1px 0px 0px #f5f2f0 inset; */ overflow: hidden; border-radius: 10px 10px 0px 0px; padding: 0 2px; border: solid 1px #f5f2f0;">
          <div class="buttons-container">
          <button class="copy-btn wave-button pagee ccitme cvme" type="button" data-tooltip="نسخ"><ion-icon name="copy-outline"></ion-icon></button>
          <button class="share-btn wave-button pagee ccitme cvme" type="button" data-tooltip="مشاركة"><ion-icon name="share-social-outline"></ion-icon></button>
          <label for="file-input-${containerId}" type="button" class="file-label wave-button pagee cvme" data-tooltip="رفع ملف">
              <i class="fi fi-tr-file-upload" style="display: flex ; font-size: 18px;"></i>
          </label>
          <input id="file-input-${containerId}" type="file" class="file-input ccitme" name="dlut">
          <button class="reset-btn wave-button pagee ccitme cvme" type="button" data-tooltip="إعاده"><ion-icon name="reload-outline" class="uspe"></ion-icon></button>
        </div>  
        <div class="codeng">
            Quran recited 
            <button class="fullscreen-btn wave-button pagee ccitme cvme" type="button" data-tooltip="مساعدة" id="showContentButtonForDiv4" style="margin-right: 0;margin-left: 8px;"><ion-icon name="accessibility-outline"></ion-icon></button>
            <button class="fullscreen-btn wave-button pagee ccitme cvme" type="button" data-tooltip="اغلاق" id="closeContentButtonForDiv4" style="display: none;margin-right: 0;margin-left: 8px;"><ion-icon name="close-outline"></ion-icon></button>
        </div>

        <div class="ccc" id="contentDivWithDetails4">
            <div class="xovox">
                <div class="scol"><a>Development languages</a> اللغات البرمجية المتاحة</div>
                <div class="pagee"><img src="https://cdn-icons-png.flaticon.com/512/732/732212.png"><br><span>htm</span></div>
                <div class="pagee"><img src="https://cdn.iconscout.com/icon/free/png-256/free-css3-9-1175237.png?f=webp""><br><span>css</span></div>
                <div class="pagee"><img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/javascript-programming-language-icon.png"><br><span>js</span></div>
                <div class="pagee"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968350.png"><br><span>Python</span></div>
                <div class="pagee"><img src="https://cdn.iconscout.com/icon/free/png-256/free-java-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-vol-1-pack-logos-icons-3029997.png?f=webp&w=256"><br><span>java</span></div>
                <div class="pagee"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968332.png"><br><span>php</span></div>
                <div class="pagee"><img src="https://cdn-icons-png.freepik.com/256/12957/12957664.png?semt=ais_hybrid"><br><span>Ruby</span></div>
                <div class="scol" style="background: #0000; padding-right: 0; padding-left: 0;">
                    <a>
                        <button class=" pagee ccitme cvme" type="button" data-tooltip="تعديل الكود يدوي"><ion-icon name="create-outline"></ion-icon></button>
                        <button class=" pagee ccitme cvme" type="button" data-tooltip="عرض الكود"><ion-icon name="eye-outline"></ion-icon></button>
                    </a>
                </div>
            </div>
        </div>
      </div>
      
      <pre class="line-numbers"><code class="language-markup">${escapedCode}</code></pre>
      `;

      // إضافة وظيفة النسخ
      const copyButton = container.querySelector('.copy-btn');
      copyButton.addEventListener('click', () => {
          navigator.clipboard.writeText(code).then(() => {
              // تغيير محتوى الزر عند النجاح
              copyButton.innerHTML = `<ion-icon name="checkmark-outline"></ion-icon>`;
              // إعادة المحتوى الأصلي بعد ثانيتين
              setTimeout(() => {
                  copyButton.innerHTML = `<ion-icon name="copy-outline"></ion-icon>`;
              }, 2000);
          }).catch(() => {
              alert('حدث خطأ أثناء النسخ!');
          });
      });

      // إضافة وظيفة المشاركة
      container.querySelector('.share-btn').addEventListener('click', () => {
          if (navigator.share) {
              navigator.share({
                  title: 'شارك الكود',
                  text: code
              }).then(() => {
                  console.log('تمت المشاركة بنجاح!');
              }).catch(() => {
                  alert('حدث خطأ أثناء المشاركة!');
              });
          } else {
              alert('خاصية المشاركة غير مدعومة في هذا المتصفح.');
          }
      });

      // إضافة وظيفة رفع الملف
      const fileInput = container.querySelector(`#file-input-${containerId}`);
      const resetButton = container.querySelector('.reset-btn'); // الزر الذي سيظهر بعد رفع الملف

      fileInput.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function(e) {
                  const fileContent = e.target.result;
                  const escapedFileContent = escapeHTML(fileContent);

                  // تحديد اللغة بناءً على امتداد الملف
                  const languageClass = getLanguageByExtension(file.name);

                  // تحديث فئة الكود الخاصة باللغة
                  container.querySelector('pre code').className = `language-markup ${languageClass}`;
                  container.querySelector('code').textContent = fileContent; // إضافة محتوى الملف إلى الكود

                  // تلوين الكود بعد التعديل
                  Prism.highlightAll(); 

                  // إظهار زر إعادة المحتوى الأصلي بعد رفع الملف
                  resetButton.style.display = 'inline-block';
              };
              reader.readAsText(file); // قراءة الملف كـ نص
          }
      });

      // إضافة وظيفة إعادة المحتوى الأصلي
      resetButton.addEventListener('click', () => {
          container.querySelector('code').textContent = originalCode; // استعادة الكود الأصلي
          container.querySelector('pre code').className = 'language-markup'; // استعادة الفئة الأصلية
          Prism.highlightAll(); // إعادة تلوين الكود بعد إعادة المحتوى

          // إعادة تفعيل عنصر الملف للسماح للمستخدم برفع نفس الملف أو ملف آخر
          const fileInput = container.querySelector(`#file-input-${containerId}`);
          fileInput.value = ''; // مسح القيمة الحالية للـ input

          // إخفاء زر الإعادة بعد الضغط عليه
          resetButton.style.display = 'none';
      });

      // إعادة تفعيل Prism.js لتلوين الكود
      Prism.highlightAll();
  }

  // إضافة الأكواد إلى الـ divs المختلفة
  addCodeWithButtons('code-container-1', code1);
