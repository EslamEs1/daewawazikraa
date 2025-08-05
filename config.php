<?php
// Database configuration for Hostinger
// تحديث هذه البيانات بمعلومات قاعدة البيانات الخاصة بك

$host = 'localhost';
$dbname = 'u904771102_sdka'; // اسم قاعدة البيانات
$username = 'u904771102_eslames'; // اسم المستخدم
$password = 'Sda49fs4Zs4@'; // كلمة المرور - استبدل بكلمة المرور الحقيقية

// Function to get database connection
function getDBConnection() {
    global $host, $dbname, $username, $password;
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch (PDOException $e) {
        throw new Exception('Database connection failed: ' . $e->getMessage());
    }
}
?> 