<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Municipality extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'municipalities';
    
    protected $fillable = [
        'name', 'code', 'region', 'zone_boundaries', 'contact_info', 'is_active'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
    ];
}