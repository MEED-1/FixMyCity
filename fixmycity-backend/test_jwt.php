<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::first();
$token = auth('api')->login($user); 

$total = App\Models\UrbanIssue::count();
$mine = App\Models\UrbanIssue::where('user_id', $user->id)->count();

echo "Total Issues: $total\n";
echo "My Issues: $mine\n";
