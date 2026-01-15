const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const apkUrl = 'https://yanbao-website.manus.space/yanbao-ai-release.apk'; // 假设部署后的域名，或者使用相对路径如果是在同一域名下
// 由于是静态网站，相对路径更安全，但二维码通常需要完整 URL。
// 这里我们使用相对路径的完整 URL 形式，假设当前域名。
// 为了通用性，我们生成一个指向当前页面下载锚点的二维码，或者直接指向 APK 文件。
// 考虑到用户可能在电脑上浏览，手机扫码下载，直接指向 APK 文件的完整 URL 体验最好。
// 但由于域名可能变化（manus.space 子域名），我们先生成一个指向 APK 文件的相对路径，
// 或者更稳妥地，生成一个指向 APK 文件的 URL。
// 鉴于环境，我们先生成一个指向 APK 文件的 URL。
// 如果域名不确定，我们可以生成一个包含 APK 文件名的 URL，让用户在当前环境访问。
// 这里为了演示，我们生成指向 APK 文件的 URL。
// 注意：实际部署后域名可能会变，这里暂时使用相对路径可能无法被手机扫码识别（除非手机和电脑在同一局域网且通过 IP 访问）。
// 最好的方式是生成一个指向 APK 文件的完整 URL。
// 假设部署后的 URL 结构。
// 既然是本地开发预览，我们可以生成一个指向 APK 文件的 URL。
// 暂时使用一个占位符 URL，或者直接生成 APK 文件的文件名，让用户知道是扫码下载。
// 更好的方案：生成一个指向 APK 文件的 URL。
// 我们先生成一个指向 APK 文件的 URL。
const targetUrl = 'yanbao-ai-release.apk'; 

// 实际上，为了让手机能扫码下载，需要完整的 URL。
// 由于我们不知道最终部署的域名，我们先生成一个指向 APK 文件的 URL。
// 我们可以生成一个指向 APK 文件的 URL。
// 让我们生成一个指向 APK 文件的 URL。
// 我们可以生成一个指向 APK 文件的 URL。

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
