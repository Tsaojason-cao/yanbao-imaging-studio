const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const targetUrl = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663291962366/jVgfLFpLeBxAcRlq.apk'; 

const outputDir = path.join(__dirname, 'client', 'public', 'images');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

QRCode.toFile(
    path.join(outputDir, 'download-qr.png'),
    targetUrl,
    {
        color: {
            dark: '#A33BFF',  // 紫色前景色
            light: '#00000000' // 透明背景
        },
        width: 200,
        margin: 1
    },
    function (err) {
        if (err) throw err;
        console.log('QR code generated successfully!');
    }
);
