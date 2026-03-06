<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your Cloudinary settings. Cloudinary is a cloud
    | service that offers a solution to a web application's entire image
    | management pipeline.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    */

    // 'cloud_url' => env('CLOUDINARY_URL'),
    'cloud_url' => null,

    'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),
    
    // Manual fallback using parse_url which is more robust
    'cloud_name' => (function() {
        $url = env('CLOUDINARY_URL');
        if (!$url) return null;
        $components = parse_url($url);
        return $components['host'] ?? null;
    })(),
    'api_key' => (function() {
        $url = env('CLOUDINARY_URL');
        if (!$url) return null;
        $components = parse_url($url);
        return $components['user'] ?? null;
    })(),
    'api_secret' => (function() {
        $url = env('CLOUDINARY_URL');
        if (!$url) return null;
        $components = parse_url($url);
        return $components['pass'] ?? null;
    })(),
];
