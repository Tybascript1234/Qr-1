// تابع لتحديد الديف الذي سيتم عرضه
let messageDiv;

// وظيفة لعرض الـ div
function showMessage(message) {
  // إنشاء الديف إذا لم يكن موجودًا بعد
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.outline = 'solid 3px #fff';
    messageDiv.style.backgroundColor = '#ff0000';
    messageDiv.style.color = '#fff';
    messageDiv.style.padding = '10px 20px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.fontFamily = 'system-ui';
    messageDiv.style.zIndex = '10000000';
    document.body.appendChild(messageDiv);
  }

  // تحديث النص وعرض الديف
  messageDiv.innerHTML = `${message} <a onclick="openNewPage()" style="color: #fff;text-decoration: underline;">سياسة الخصوصية</a>`;
  messageDiv.style.display = 'block';

  // إخفاء الديف بعد 3 ثواني
  setTimeout(function() {
    if (messageDiv) {
      messageDiv.style.display = 'none';
    }
  }, 3000);

  // إضافة حدث لإغلاق الديف عند النقر خارجه
  document.addEventListener('click', function closeMessage(event) {
    if (!messageDiv.contains(event.target)) {
      messageDiv.style.display = 'none';
      document.removeEventListener('click', closeMessage); // إزالة الحدث بعد النقر
    }
  });
}

// وظيفة لتعطيل الاختصارات
document.addEventListener('keydown', function(event) {
  const keyCombination = `${event.ctrlKey ? 'Ctrl+' : ''}${event.altKey ? 'Alt+' : ''}${event.shiftKey ? 'Shift+' : ''}${event.key}`;

  const disabledShortcuts = {
    'F1': 'تم تعطيل زر F1.',
    'F2': 'تم تعطيل زر F2.',
    'F3': 'تم تعطيل زر F3.',
    'F4': 'تم تعطيل زر F4.',
    'F5': 'تم تعطيل زر F5.',
    'F6': 'تم تعطيل زر F6.',
    'F7': 'تم تعطيل زر F7.',
    'F8': 'تم تعطيل زر F8.',
    'F9': 'تم تعطيل زر F9.',
    'F10': 'تم تعطيل زر F10.',
    'F11': 'تم تعطيل زر F11.',
    'F12': 'تم تعطيل زر F12.',
    'Ctrl+S': 'تم تعطيل الحفظ باستخدام Ctrl+S.',
    'Ctrl+P': 'تم تعطيل الطباعة باستخدام Ctrl+P.',
    'Ctrl+U': 'تم تعطيل عرض مصدر الصفحة باستخدام Ctrl+U.',
    'Ctrl+Shift+I': 'تم تعطيل أدوات المطور باستخدام Ctrl+Shift+I.',
    'Ctrl+F': 'تم تعطيل البحث باستخدام Ctrl+F.',
    'Ctrl+H': 'تم تعطيل فتح السجل باستخدام Ctrl+H.',
    'Ctrl+R': 'تم تعطيل إعادة تحميل الصفحة باستخدام Ctrl+R.',
    'Alt+F': 'تم تعطيل قائمة الملف باستخدام Alt+F.',
    'Alt+E': 'تم تعطيل قائمة التحرير باستخدام Alt+E.'
  };

  if (disabledShortcuts[keyCombination]) {
    event.preventDefault(); // منع الفعل الافتراضي
    showMessage(disabledShortcuts[keyCombination]); // عرض الرسالة المناسبة
  }
});

// تعطيل قائمة النقر بالزر الأيمن
document.addEventListener('contextmenu', function(event) {
  event.preventDefault(); // منع ظهور قائمة النقر بالزر الأيمن
  showMessage('تم تعطيل قائمة النقر بالزر الأيمن.');
});




// وظيفة لإعادة تحميل الصفحة
function reloadPage() {
    location.reload();
}





    document.querySelectorAll('a.fo_url').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault(); // منع التصرف الافتراضي (عرض الرابط في شريط الحالة)

        const url = link.getAttribute('data-url'); // استخدام data-url بدلاً من href
        window.location.assign(url); // استخدام window.location.assign لتمكين العودة للخلف
      });
    });




    // دالة لفتح صفحة جديدة
    function openNewPage() {
        // تحديد محتوى النص الذي سيتم عرضه في الصفحة الجديدة
        const newPageContent = `
            <html>
                <head>
                <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
                    <title>الصفحة الجديدة</title>
                    <link rel="stylesheet" href="home.css">
                    <link rel="stylesheet" href="oo.css">
                    <script src="reload.js"></script>
                    <link >
                    <script src="home.js"></script>
                    <style>
                        body {
                            font-family: system-ui;
                        }
                        .xllle {
                            margin-left: 17px;
                            color: #878787;
                            padding: 6px 12px;
                            border-radius: 8px;
                            background: #80919f12;
                        }
                        .toooxe {

                        }
                        .toooxe input {
                            
                        }
                        .toooxe button {
                            
                        }
                        .xoxxxx {
                            display: inline-flex;
                            align-items: center;
                            background: rgb(255 255 255);
                            color: #515151;
                            font-size: 16px;
                            font-family: system-ui;
                            width: -webkit-fill-available;
                            padding: 16.1px 16px;
                            margin-top: 0;
                            margin-bottom: 10px;
                            border-bottom: solid 1px #ccc;
                            position: sticky;
                            top: 0;
                        }
                        .xoxxxx img {
                            height: 32px;
                            margin-right: 10px;
                            color: white;
                        }
                    </style>
                </head>
                <body>
                    <!-- <div id="container" style="z-index: 1500;"></div> -->
                    <p>Not allowed <span class="xllle">F1-F12</span></p>
                    <p>Not allowed <span class="xllle">Right click</span></p>
                    <p>Not allowed <span class="xllle">Ctrl + S</span></p>
                    <p>Not allowed <span class="xllle">Ctrl + R</span></p>
                    <p>Not allowed <span class="xllle">Ctrl + F</span></p>
                    <p>Not allowed <span class="xllle">Ctrl + H</span></p>
                    <p>Not allowed <span class="xllle">Ctrl + Shift + I</span></p>
                    <p>Not allowed <span class="xllle">Ctrl + P</span></p>
                    <p>Not allowed <span class="xllle">Alt + F</span></p>
                    <p>Not allowed <span class="xllle">Alt + E</span></p>
                    <br>
                    <h3>All these shortcuts and others have been deprecated.</h3>
                    <h2>Subscribe for protection</h2>
                    <form class="toooxe">
                        <input type="text" placeholder="Enter your Name">
                        <br>
                        <br>
                        <input type="text" placeholder="Enter your Google email">
                        <br>
                        <br>
                        <textarea name="" id="" placeholder="Select the shortcuts you want to remove." style="width: 300px;height: 200px;max-width: 100%;"></textarea>
                        <br>
                        <br>
                        <button type="submit">Send</button>
                    </form>
                    </div>
                    <!-- Reload --> <div class="Reload" id="Reload-logo"> <div class="Reload-div"> <div class="i-freem"> <div class="Reload-div-logo"> <div class="logo"> <img src="logo-no-background.png" alt=""> </div> </div> </div> <div class="ome"><span id="progress-bar"></span></div> <br> <div class="hom"> <button onclick="openInternetSettings()">WiFi settings</button> <button onclick="reloadPage()">Reload</button> </div> <br> <div id="status-text" style="color: rgb(117, 117, 117);">Internet disconnected.</div> </div> </div>
                </body>
            </html>
        `;
        
        // فتح نافذة جديدة
        const newWindow = window.open();
        newWindow.document.write(newPageContent);
        newWindow.document.close();
    }
