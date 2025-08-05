<?php
// ملف لفحص مشكلة حفظ البيانات
// احذف هذا الملف بعد حل المشكلة

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

echo "<h2>🔍 فحص مشكلة حفظ البيانات</h2>";

// اختبار قراءة البيانات
echo "<h3>📖 قراءة البيانات الحالية:</h3>";
try {
    $pdo = getDBConnection();
    $stmt = $pdo->prepare("SELECT * FROM shared_data WHERE id = 1");
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($row) {
        echo "<ul>";
        echo "<li>التسبيح - دعاء: " . $row['tasbih_do3aa'] . "</li>";
        echo "<li>التسبيح - تسبيح: " . $row['tasbih_tasbeh'] . "</li>";
        echo "<li>التسبيح - حمد: " . $row['tasbih_hamd'] . "</li>";
        echo "<li>التسبيح - تكبير: " . $row['tasbih_takbeer'] . "</li>";
        echo "</ul>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ خطأ في قراءة البيانات: " . $e->getMessage() . "</p>";
}

// اختبار تحديث البيانات
echo "<h3>✏️ اختبار تحديث البيانات:</h3>";
try {
    $pdo = getDBConnection();
    
    // تحديث عداد الدعاء
    $stmt = $pdo->prepare("UPDATE shared_data SET tasbih_do3aa = tasbih_do3aa + 1 WHERE id = 1");
    $result = $stmt->execute();
    
    if ($result) {
        echo "<p style='color: green;'>✅ تم تحديث البيانات بنجاح!</p>";
        
        // قراءة البيانات المحدثة
        $stmt = $pdo->prepare("SELECT * FROM shared_data WHERE id = 1");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<h4>📊 البيانات بعد التحديث:</h4>";
        echo "<ul>";
        echo "<li>التسبيح - دعاء: " . $row['tasbih_do3aa'] . "</li>";
        echo "<li>التسبيح - تسبيح: " . $row['tasbih_tasbeh'] . "</li>";
        echo "<li>التسبيح - حمد: " . $row['tasbih_hamd'] . "</li>";
        echo "<li>التسبيح - تكبير: " . $row['tasbih_takbeer'] . "</li>";
        echo "</ul>";
    } else {
        echo "<p style='color: red;'>❌ فشل في تحديث البيانات</p>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ خطأ في تحديث البيانات: " . $e->getMessage() . "</p>";
}

// اختبار API endpoint
echo "<h3>🌐 اختبار API endpoint:</h3>";
echo "<p>جرب هذا الرابط: <a href='api.php?action=getData' target='_blank'>api.php?action=getData</a></p>";

?>

<style>
body {
    font-family: 'Cairo', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    margin: 0;
}

h2, h3, h4 {
    color: #ffd700;
}

ul {
    background: rgba(255,255,255,0.1);
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0;
}

li {
    margin: 10px 0;
    padding: 5px 0;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}

a {
    color: #ffd700;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style> 