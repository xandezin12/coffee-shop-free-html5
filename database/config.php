<?php
class DatabaseException extends Exception {}

// Secure environment loader
function loadEnv($path) {
    // Validate and sanitize path
    $realPath = realpath($path);
    if (!$realPath || !file_exists($realPath)) {
        error_log("Environment file not found: $path");
        throw new DatabaseException("Configuration file missing");
    }
    
    // Prevent directory traversal
    $allowedDir = realpath(__DIR__ . '/..');
    if (strpos($realPath, $allowedDir) !== 0) {
        throw new DatabaseException("Invalid configuration path");
    }
    
    $lines = file($realPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        throw new DatabaseException("Cannot read configuration file");
    }
    
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || $line[0] === '#') continue;
        
        if (strpos($line, '=') === false) continue;
        
        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        
        // Sanitize key and value
        if (preg_match('/^[A-Z_][A-Z0-9_]*$/', $key)) {
            $_ENV[$key] = filter_var($value, FILTER_SANITIZE_STRING);
        }
    }
}

try {
    loadEnv(__DIR__ . '/../.env');
    
    // Validate required environment variables
    $host = filter_var($_ENV['DB_HOST'] ?? '127.0.0.1', FILTER_SANITIZE_STRING);
    $dbname = filter_var($_ENV['DB_NAME'] ?? 'coffee_shop', FILTER_SANITIZE_STRING);
    $username = filter_var($_ENV['DB_USER'] ?? 'root', FILTER_SANITIZE_STRING);
    $password = $_ENV['DB_PASS'] ?? '';
    
    if (empty($host) || empty($dbname) || empty($username)) {
        throw new DatabaseException("Invalid database configuration");
    }
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
} catch (DatabaseException $e) {
    error_log("Database configuration error: " . $e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Service temporarily unavailable']);
    exit(1);
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Service temporarily unavailable']);
    exit(1);
}
?>
