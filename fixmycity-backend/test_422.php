<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$request = \Illuminate\Http\Request::create('/api/urban-issues', 'POST', [
    'title' => 'Test',
    'description' => 'Test',
    'category' => 'infrastructure',
    'priority' => 'low',
    'latitude' => 10.5,
    'longitude' => 20.5,
], [], ['photos' => [new \Illuminate\Http\UploadedFile(__FILE__, 'test.php', 'text/php', null, true)]]);
$request->headers->set('Accept', 'application/json');

$user = \App\Models\User::first();
\Illuminate\Support\Facades\Auth::shouldReceive('guard')->with('api')->andReturn(new class($user) {
    private $u;
    public function __construct($u) { $this->u = $u; }
    public function check() { return true; }
    public function id() { return clone $this->u->id; } // MongoDB Object ID issue
    public function user() { return $this->u; }
});

$response = $kernel->handle($request);
echo 'Status: ' . $response->getStatusCode() . "\n";
echo 'Content: ' . $response->getContent() . "\n";
