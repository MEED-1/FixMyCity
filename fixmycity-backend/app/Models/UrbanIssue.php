<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class UrbanIssue extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'urban_issues';
    
    protected $fillable = [
        'user_id', 'title', 'description', 'category', 'status', 'priority',
        'location', 'photos', 'upvotes', 'upvoted_by', 'comments',
        'boost_score', 'boost_history', 'current_boost_level', 'boost_expires_at',
        'municipality', 'assigned_agent_id', 'qr_code_url', 'resolved_photos'
    ];
    
    protected $casts = [
        'upvotes' => 'integer',
        'boost_score' => 'float',
        'boost_expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}