<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class BoostTransaction extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'boost_transactions';

    protected $fillable = [
        'paid_by_user_id',
        'boosted_item_id',
        'boosted_item_type', // urban_issue, community_help
        'boost_level', // basic, premium, super
        'amount',
        'duration_hours',
        'stripe_payment_id',
        'is_self_boost',
        'status', // pending, completed
        'expires_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'expires_at' => 'datetime',
        'amount' => 'float',
        'is_self_boost' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'paid_by_user_id');
    }
}