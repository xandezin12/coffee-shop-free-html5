<?php
require_once 'database/config.php';

echo "Testing database connection...\n";

try {
    // Test connection
    $stmt = $pdo->query("SELECT 1");
    echo "✓ Database connection successful\n";
    
    // Check if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->rowCount() > 0) {
        echo "✓ Users table exists\n";
    } else {
        echo "✗ Users table does not exist\n";
        echo "Creating users table...\n";
        
        $sql = "CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(20),
            address TEXT,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        $pdo->exec($sql);
        echo "✓ Users table created\n";
    }
    
    // Check if user_sessions table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'user_sessions'");
    if ($stmt->rowCount() > 0) {
        echo "✓ User_sessions table exists\n";
    } else {
        echo "✗ User_sessions table does not exist\n";
        echo "Creating user_sessions table...\n";
        
        $sql = "CREATE TABLE user_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            session_token VARCHAR(255) UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )";
        
        $pdo->exec($sql);
        echo "✓ User_sessions table created\n";
    }
    
    echo "\nDatabase setup complete!\n";
    
} catch(PDOException $e) {
    echo "✗ Database error: " . $e->getMessage() . "\n";
}
?>