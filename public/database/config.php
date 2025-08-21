<?php
class DatabaseException extends Exception {}

// Secure environment loader
function loadEnv($path) {
    // Validate and sanitize path to prevent path traversal attacks
    $sanitizedPath = basename($path);
    $allowedPaths = ['.env', '.env.local', '.env.production'];
    
    if (!in_array($sanitizedPath, $allowedPaths)) {
        throw new DatabaseException("Invalid configuration file");
    }
    
    $realPath = realpath($path);
    if (!$realPath || !file_exists($realPath)) {
        error_log("Environment file not found: $sanitizedPath");
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
            $_ENV[$key] = htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
        }
    }
}

try {
    loadEnv(__DIR__ . '/../.env');
    
    // Validate required environment variables
    $host = htmlspecialchars($_ENV['DB_HOST'] ?? '127.0.0.1', ENT_QUOTES, 'UTF-8');
    $dbname = htmlspecialchars($_ENV['DB_NAME'] ?? 'coffee_shop', ENT_QUOTES, 'UTF-8');
    $username = htmlspecialchars($_ENV['DB_USER'] ?? 'root', ENT_QUOTES, 'UTF-8');
    $password = $_ENV['DB_PASS'] ?? '';
    
    if (empty($host) || empty($dbname) || empty($username)) {
        throw new DatabaseException("Invalid database configuration");
    }
    
    // Try to connect to database, create if doesn't exist
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
    } catch (PDOException $e) {
        // If database doesn't exist, try to create it
        if (strpos($e->getMessage(), 'Unknown database') !== false) {
            $pdo_temp = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
            $pdo_temp->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            
            $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } else {
            throw $e;
        }
    }
    
} catch (DatabaseException $e) {
    error_log("Database configuration error: " . $e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Service temporarily unavailable']);
    throw $e;
} catch (PDOException $e) {
    error_log("Database connection failed: " . $e->getMessage());
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Service temporarily unavailable']);
    throw $e;
}
?>
