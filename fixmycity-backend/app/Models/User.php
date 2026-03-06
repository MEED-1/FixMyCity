<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;

class User extends Model implements JWTSubject, AuthenticatableContract
{
    use Authenticatable;

    protected $connection = 'mongodb';
    protected $collection = 'users';
    
    protected $fillable = [
        'name', 'email', 'password', 'phone', 'role',
        'avatar_url', 'municipality', 'language_preference',
        'theme_preference', 'notifications', 'stats', 'is_active'
    ];
    
    protected $hidden = ['password'];
    
    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function getJWTIdentifier() 
    { 
        return $this->getKey(); 
    }
    
    public function getJWTCustomClaims() 
    { 
        return []; 
    }
}