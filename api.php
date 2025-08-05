<?php
// Error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Include database configuration
require_once 'config.php';

// Function to load data from database
function loadData() {
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT * FROM shared_data WHERE id = 1");
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row) {
            // Create initial record if not exists
            $stmt = $pdo->prepare("INSERT INTO shared_data (id, tasbih_do3aa, tasbih_tasbeh, tasbih_hamd, tasbih_takbeer, interactions_surah_gifts, interactions_prayers, interactions_juz_reads, quran_total_readings, quran_completed_khatmat, quran_read_surahs) VALUES (1, 0, 0, 0, 0, 0, 0, 0, 0, 0, '[]')");
            $stmt->execute();
            
            return [
                'tasbih' => [
                    'do3aa' => 0,
                    'tasbeh' => 0,
                    'hamd' => 0,
                    'takbeer' => 0
                ],
                'interactions' => [
                    'surahGifts' => 0,
                    'prayers' => 0,
                    'juzReads' => 0
                ],
                'quran' => [
                    'totalReadings' => 0,
                    'completedKhatmat' => 0,
                    'readSurahs' => []
                ],
                'lastUpdate' => date('Y-m-d H:i:s')
            ];
        }
        
        return [
            'tasbih' => [
                'do3aa' => intval($row['tasbih_do3aa']),
                'tasbeh' => intval($row['tasbih_tasbeh']),
                'hamd' => intval($row['tasbih_hamd']),
                'takbeer' => intval($row['tasbih_takbeer'])
            ],
            'interactions' => [
                'surahGifts' => intval($row['interactions_surah_gifts']),
                'prayers' => intval($row['interactions_prayers']),
                'juzReads' => intval($row['interactions_juz_reads'])
            ],
            'quran' => [
                'totalReadings' => intval($row['quran_total_readings']),
                'completedKhatmat' => intval($row['quran_completed_khatmat']),
                'readSurahs' => json_decode($row['quran_read_surahs'], true) ?: []
            ],
            'lastUpdate' => $row['last_update']
        ];
    } catch (Exception $e) {
        throw new Exception('Failed to load data: ' . $e->getMessage());
    }
}

// Function to save data to database
function saveData($data) {
    try {
        $pdo = getDBConnection();
        
        $stmt = $pdo->prepare("
            UPDATE shared_data SET 
                tasbih_do3aa = :do3aa,
                tasbih_tasbeh = :tasbeh,
                tasbih_hamd = :hamd,
                tasbih_takbeer = :takbeer,
                interactions_surah_gifts = :surah_gifts,
                interactions_prayers = :prayers,
                interactions_juz_reads = :juz_reads,
                quran_total_readings = :total_readings,
                quran_completed_khatmat = :completed_khatmat,
                quran_read_surahs = :read_surahs
            WHERE id = 1
        ");
        
        $stmt->execute([
            ':do3aa' => $data['tasbih']['do3aa'],
            ':tasbeh' => $data['tasbih']['tasbeh'],
            ':hamd' => $data['tasbih']['hamd'],
            ':takbeer' => $data['tasbih']['takbeer'],
            ':surah_gifts' => $data['interactions']['surahGifts'],
            ':prayers' => $data['interactions']['prayers'],
            ':juz_reads' => $data['interactions']['juzReads'],
            ':total_readings' => $data['quran']['totalReadings'],
            ':completed_khatmat' => $data['quran']['completedKhatmat'],
            ':read_surahs' => json_encode($data['quran']['readSurahs'], JSON_UNESCAPED_UNICODE)
        ]);
        
        return true;
    } catch (Exception $e) {
        throw new Exception('Failed to save data: ' . $e->getMessage());
    }
}

// Handle different requests
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

if ($method === 'GET') {
    if ($action === 'getData') {
        try {
            $data = loadData();
            echo json_encode($data, JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
    }
} elseif ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON input');
        }
        $data = loadData();
    
    switch ($action) {
        case 'updateTasbih':
            $type = $input['type'] ?? '';
            if (isset($data['tasbih'][$type])) {
                $data['tasbih'][$type]++;
                saveData($data);
                echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid tasbih type']);
            }
            break;
            
        case 'updateInteraction':
            $type = $input['type'] ?? '';
            if (isset($data['interactions'][$type])) {
                $data['interactions'][$type]++;
                saveData($data);
                echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid interaction type']);
            }
            break;
            
        case 'updateQuran':
            $quranData = $input['quranData'] ?? [];
            if (isset($quranData['totalReadings'])) {
                $data['quran']['totalReadings'] = intval($quranData['totalReadings']);
            }
            if (isset($quranData['completedKhatmat'])) {
                $data['quran']['completedKhatmat'] = intval($quranData['completedKhatmat']);
            }
            if (isset($quranData['readSurahs'])) {
                $data['quran']['readSurahs'] = is_array($quranData['readSurahs']) ? $quranData['readSurahs'] : [];
            }
            saveData($data);
            echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
            break;
            
        case 'resetTasbih':
            $type = $input['type'] ?? '';
            if (isset($data['tasbih'][$type])) {
                $data['tasbih'][$type] = 0;
                saveData($data);
                echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid tasbih type']);
            }
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
}
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

/*
 * IMPORTANT: Before uploading to production server:
 * 1. Remove or comment out these lines:
 *    error_reporting(E_ALL);
 *    ini_set('display_errors', 1);
 * 2. Update database credentials with your actual Hostinger credentials
 * 3. Make sure the database table is created
 * 4. Test the API endpoints:
 *    GET: yourdomain.com/api.php?action=getData
 *    POST: yourdomain.com/api.php?action=updateTasbih
 */
?> 