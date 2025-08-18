<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database/config.php';

// Input sanitization function
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Security logging function
function logSecurity($event, $details = []) {
    $logDir = __DIR__ . '/../logs';
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    // Remove sensitive data from logs for privacy compliance
    if (isset($details['email'])) {
        $details['email'] = substr($details['email'], 0, 3) . '***@' . substr(strrchr($details['email'], '@'), 1);
    }
    $log = date('Y-m-d H:i:s') . " - $event - " . json_encode($details) . " - IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . PHP_EOL;
    file_put_contents($logDir . '/security.log', $log, FILE_APPEND | LOCK_EX);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    return;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = sanitizeInput($input['action'] ?? '');

switch ($action) {
    case 'register':
        register($pdo, $input);
        break;
    case 'login':
        login($pdo, $input);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
}

function register($pdo, $data) {
    $name = sanitizeInput($data['name'] ?? '');
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = sanitizeInput($data['phone'] ?? '');
    $address = sanitizeInput($data['address'] ?? '');
    $password = $data['password'] ?? '';
    
    // Validate inputs
    if (empty($name) || empty($email) || empty($password)) {
        logSecurity('registration_failed', ['reason' => 'missing_fields', 'email' => $email]);
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        logSecurity('registration_failed', ['reason' => 'invalid_email', 'email' => $email]);
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        return;
    }
    
    if (strlen($password) < 8) {
        logSecurity('registration_failed', ['reason' => 'weak_password', 'email' => $email]);
        http_response_code(400);
        echo json_encode(['error' => 'Password must be at least 8 characters']);
        return;
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, address, password_hash) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $address, $hashedPassword]);
        
        logSecurity('user_registered', ['email' => $email]);
        echo json_encode(['success' => true, 'message' => 'User registered successfully']);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            logSecurity('registration_failed', ['reason' => 'email_exists', 'email' => $email]);
            http_response_code(409);
            echo json_encode(['error' => 'Email already exists']);
        } else {
            logSecurity('registration_error', ['email' => $email, 'error' => $e->getMessage()]);
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed']);
        }
    }
}

function login($pdo, $data) {
    $email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        logSecurity('login_failed', ['reason' => 'missing_credentials', 'email' => $email]);
        http_response_code(400);
        echo json_encode(['error' => 'Email and password required']);
        return;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        logSecurity('login_failed', ['reason' => 'invalid_email', 'email' => $email]);
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        return;
    }
    
    try {
        $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password_hash'])) {
            $sessionToken = bin2hex(random_bytes(32));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));
            
            $stmt = $pdo->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
            $stmt->execute([$user['id'], $sessionToken, $expiresAt]);
            
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['token'] = $sessionToken;
            
            logSecurity('login_success', ['user_id' => $user['id'], 'email' => $email]);
            
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => sanitizeInput($user['name']),
                    'email' => $user['email']
                ],
                'token' => $sessionToken
            ]);
        } else {
            logSecurity('login_failed', ['reason' => 'invalid_credentials', 'email' => $email]);
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } catch (PDOException $e) {
        logSecurity('login_error', ['email' => $email, 'error' => $e->getMessage()]);
        http_response_code(500);
        echo json_encode(['error' => 'Login failed']);
    }
}
?>