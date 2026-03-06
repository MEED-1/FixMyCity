<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class DonationController extends Controller
{
    
    public function createSession(Request $request)
    {
        $validated = $request->validate([
            'help_request_id' => 'required|string',
            'amount' => 'required|numeric|min:10',
            'is_anonymous' => 'boolean',
            'message' => 'nullable|string|max:500',
        ]);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'mad',
                    'product_data' => [
                        'name' => 'Community Help Donation',
                    ],
                    'unit_amount' => $validated['amount'] * 100,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/donation/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/donation/cancel',
            'metadata' => [
                'type' => 'donation',
                'donor_user_id' => auth()->id(),
                'help_request_id' => $validated['help_request_id'],
                'is_anonymous' => $validated['is_anonymous'] ? 'true' : 'false',
                'donor_message' => $validated['message'] ?? '',
            ],
        ]);

        return response()->json(['url' => $session->url]);
    }

    
    public function myDonations(Request $request)
    {
        $donations = \App\Models\Donation::with('helpRequest')
            ->where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($donations);
    }
}