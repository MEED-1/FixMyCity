<?php

return [

    

    


    'cloud_url' => null,

    'notification_url' => env('CLOUDINARY_NOTIFICATION_URL'),
    

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
