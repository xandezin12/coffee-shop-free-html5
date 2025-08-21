# Database Setup Instructions

## MySQL Setup

1. **Install MySQL** (if not already installed)
2. **Create Database**: Run `schema.sql` in MySQL
3. **Configure Connection**: Update `config.php` with your MySQL credentials

## Quick Setup Commands

```sql
-- In MySQL command line or phpMyAdmin
SOURCE database/schema.sql;
```

## Configuration

Edit `database/config.php`:
```php
$host = 'localhost';        // Your MySQL host
$dbname = 'coffee_shop';    // Database name
$username = 'root';         // Your MySQL username
$password = '';             // Your MySQL password
```

## Testing

1. Open website in browser
2. Try registering a new user
3. Try logging in with created user
4. Check MySQL database for stored data

## Tables Created

- `users` - User accounts and login data
- `user_sessions` - Active login sessions
- `orders` - Customer orders
- `events` - Event bookings