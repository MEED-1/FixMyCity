<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BoostTransaction;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class BoostController extends Controller
{
    private $boostLevels = [
        'basic' => ['price' => 5, 'hours' => 24],
        'premium' => ['price' => 10, 'hours' => 48],
        'super' => ['price' => 20, 'hours' => 72],
    ];

    
    public function createSession(Request $request)
    {
        $validated = $request->validate([
            'boosted_item_id' => 'required|string',
            'boosted_item_type' => 'required|in:urban_issue,community_help',
            'boost_level' => 'required|in:basic,premium,super',
        ]);

        $activeBoostsCount = BoostTransaction::where('boosted_item_type', $validated['boosted_item_type'])
            ->where('status', 'completed')
            ->where('expires_at', '>', now())
            ->count();

        if ($activeBoostsCount >= 3) {
            return response()->json(['error' => 'Maximum number of active boosts (3) has been reached for this category.'], 422);
        }

        $level = $this->boostLevels[$validated['boost_level']];
        
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $isSelfBoost = false;
        if ($validated['boosted_item_type'] === 'urban_issue') {
            $item = \App\Models\UrbanIssue::findOrFail($validated['boosted_item_id']);
            $isSelfBoost = $item->user_id === auth()->id();
            if ($item->status === 'reported') {
                return response()->json(['error' => 'Cannot boost an issue pending admin approval.'], 422);
            }
        } else {
            $item = \App\Models\CommunityHelpRequest::findOrFail($validated['boosted_item_id']);
            $isSelfBoost = $item->user_id === auth()->id();
            if ($item->status === 'pending') {
                 return response()->json(['error' => 'Cannot boost a request pending admin approval.'], 422);
            }
        }

        if ($item->boost_expires_at && $item->boost_expires_at->isFuture()) {
            return response()->json([
                'error' => 'This item is already boosted until ' . $item->boost_expires_at->format('M d, Y H:i')
            ], 422);
        }

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => [
                        'name' => ucfirst($validated['boost_level']) . ' Boost',
                    ],
                    'unit_amount' => $level['price'] * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/boost/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/boost/cancel',
            'metadata' => [
                'type' => 'boost',
                'paid_by_user_id' => auth()->id(),
                'paid_by_name' => auth()->user()->name,
                'boosted_item_id' => $validated['boosted_item_id'],
                'boosted_item_type' => $validated['boosted_item_type'],
                'boost_level' => $validated['boost_level'],
                'is_self_boost' => $isSelfBoost ? 'true' : 'false',
            ],
        ]);

        return response()->json(['url' => $session->url]);
    }

    
    public function myBoosts()
    {
        $boosts = BoostTransaction::where('paid_by_user_id', auth()->id())
                                  ->orderBy('created_at', 'desc')
                                  ->get();

        return response()->json($boosts);
    }
}