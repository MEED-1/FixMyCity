<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class CommunityHelpRequest extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'community_help_requests';
    
    protected $fillable = [
        'user_id', 'title', 'description', 'category', 'status', 'priority',
        'location', 'photos', 'documents', 'verification_status',
        'target_amount', 'current_amount', 'donations_count',
        'boost_score', 'boost_history', 'current_boost_level', 'boost_expires_at',
        'municipality', 'admin_notes', 'qr_code_url'
    ];
    
    protected $casts = [
        'target_amount' => 'float',
        'current_amount' => 'float',
        'donations_count' => 'integer',
        'boost_score' => 'float',
        'boost_expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}