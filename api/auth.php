<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

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
    $name = $data['name'] ?? '';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $address = $data['address'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    try {
        $stmt = $pdo->prepare("INSERT INTO users (name, email, phone, address, password_hash) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $email, $phone, $address, $hashedPassword]);
        
        echo json_encode(['success' => true, 'message' => 'User registered successfully']);
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            http_response_code(409);
            echo json_encode(['error' => 'Email already exists']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Registration failed']);
        }
    }
}

function login($pdo, $data) {
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password required']);
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
            
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ],
                'token' => $sessionToken
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Login failed']);
    }
}
?>