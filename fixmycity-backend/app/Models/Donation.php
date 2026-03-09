<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Donation extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'donations';

    protected $fillable = [
        'donor_user_id',
        'help_request_id',
        'amount',
        'is_anonymous',
        'message',
        'stripe_payment_id',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'amount' => 'float',
        'is_anonymous' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'donor_user_id');
    }

    public function helpRequest()
    {
        return $this->belongsTo(CommunityHelpRequest::class, 'help_request_id');
    }
}