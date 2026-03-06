# FixMyCity - Backend API

This backend is built on Laravel 12 using `mongodb/laravel-mongodb`. For the full project README and setup instructions, please see the [Frontend README](../fixmycity-frontend/README.md).

## Requirements
- PHP 8.2+
- MongoDB instance (Atlas recommended)
- Composer

## Initialization
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan db:seed
php artisan serve
```
