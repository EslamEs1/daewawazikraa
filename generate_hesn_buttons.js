// هذا الملف يستخدم لتوليد متغيرات hesnButtons و hesnAudioFiles بناءً على الملفات الصوتية المتوفرة

const fs = require('fs');
const path = require('path');

// قراءة قائمة الملفات من مجلد الصوت
const audioDir = path.join(__dirname, 'audios');
const files = fs.readdirSync(audioDir);

// تصفية الملفات للحصول فقط على ملفات حصن المسلم
const hesnFiles = files.filter(file => file.includes('حصن المسلم من أذكار الكتاب والسنة'));

// استخراج الأرقام والعناوين من أسماء الملفات
const hesnData = hesnFiles.map(file => {
    const match = file.match(/حصن المسلم من أذكار الكتاب والسنة \((\d+)\) (.+?)\.mp3/);
    if (match) {
        return {
            number: match[1],
            title: `حصن المسلم من أذكار الكتاب والسنة (${match[1]}) ${match[2]}`,
            filename: file
        };
    }
    return null;
}).filter(Boolean);

// إنشاء كائنات hesnButtons و hesnAudioFiles
let hesnButtonsCode = 'const hesnButtons = {\n';
let hesnAudioFilesCode = 'const hesnAudioFiles = {\n';

hesnData.forEach(item => {
    const buttonId = `func${item.number}`;
    hesnButtonsCode += `    ${buttonId}: "${item.title}",\n`;
    hesnAudioFilesCode += `    ${buttonId}: "audios/${item.filename}",\n`;
});

hesnButtonsCode += '};\n';
hesnAudioFilesCode += '};\n';

// كتابة الكود إلى ملف
const outputCode = `// تم إنشاء هذا الملف تلقائيًا بواسطة generate_hesn_buttons.js
// يحتوي على متغيرات hesnButtons و hesnAudioFiles المولدة من الملفات الصوتية المتوفرة

${hesnButtonsCode}

${hesnAudioFilesCode}

// تصدير المتغيرات لاستخدامها في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        hesnButtons,
        hesnAudioFiles
    };
}
`;

fs.writeFileSync(path.join(__dirname, 'hesn_data.js'), outputCode);

console.log(`تم إنشاء ملف hesn_data.js بنجاح!`);
console.log(`عدد الأزرار المولدة: ${hesnData.length}`); 