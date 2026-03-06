<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BoostTransaction;
use App\Models\Donation;
use App\Models\Notification;
use App\Models\UrbanIssue;
use App\Models\CommunityHelpRequest;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\BoostNotification;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sig = $request->header('Stripe-Signature');
        $secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig, $secret);
        } catch (\Exception $e) {
            Log::error('Webhook signature verification failed: ' . $e->getMessage());
            if (env('APP_ENV') === 'local') {
                $event = json_decode($payload);
                if (!isset($event->type)) {
                     return response()->json(['error' => 'Invalid payload'], 400);
                }
            } else {
                return response()->json(['error' => $e->getMessage()], 400);
            }
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $metadata = (object) $session->metadata;

            if ($metadata->type === 'boost') {
                $this->handleBoostPayment($session, $metadata);
            } elseif ($metadata->type === 'donation') {
                $this->handleDonationPayment($session, $metadata);
            }
        }

        return response()->json(['status' => 'ok']);
    }

    private function handleBoostPayment($session, $metadata)
    {
        $boostLevelDurations = ['basic' => 24, 'premium' => 48, 'super' => 72];
        $duration = $boostLevelDurations[$metadata->boost_level];
        $expiresAt = now()->addHours($duration);
        $amount = $session->amount_total / 100;

        BoostTransaction::create([
            'paid_by_user_id' => $metadata->paid_by_user_id,
            'boosted_item_id' => $metadata->boosted_item_id,
            'boosted_item_type' => $metadata->boosted_item_type,
            'boost_level' => $metadata->boost_level,
            'amount_paid' => $amount,
            'duration_hours' => $duration,
            'boost_expires_at' => $expiresAt,
            'stripe_payment_intent_id' => $session->payment_intent,
            'payment_status' => 'succeeded',
            'is_self_boost' => $metadata->is_self_boost === 'true',
        ]);

        if ($metadata->boosted_item_type === 'urban_issue') {
            $model = UrbanIssue::find($metadata->boosted_item_id);
        } else {
            $model = CommunityHelpRequest::find($metadata->boosted_item_id);
        }

        if ($model) {
            $boostHistory = $model->boost_history ?? [];
            $boostHistory[] = [
                'boost_level' => $metadata->boost_level,
                'amount_paid' => $amount,
                'expires_at' => $expiresAt->toISOString(),
                'created_at' => now()->toISOString()
            ];

            $model->update([
                'boost_history' => $boostHistory,
                'boost_score' => collect($boostHistory)->sum('amount_paid'),
                'current_boost_level' => $metadata->boost_level,
                'boost_expires_at' => $expiresAt,
            ]);

            try {
                $payer = User::find($metadata->paid_by_user_id);
                if ($payer) {
                     Mail::to($payer)->send(new BoostNotification($model, $metadata->boost_level, $metadata->boosted_item_type));
                }
            } catch (\Exception $e) {
                Log::error("Failed to send boost notification email: " . $e->getMessage());
            }

            Log::info('Boost processed successfully', [
                'item_id' => $metadata->boosted_item_id,
                'booster' => $metadata->paid_by_name
            ]);
        }
    }

    private function handleDonationPayment($session, $metadata)
    {
        $amount = $session->amount_total / 100;

        $donation = Donation::create([
            'donor_user_id' => $metadata->donor_user_id,
            'help_request_id' => $metadata->help_request_id,
            'amount' => $amount,
            'currency' => 'mad',
            'stripe_payment_intent_id' => $session->payment_intent,
            'payment_status' => 'succeeded',
            'is_anonymous' => $metadata->is_anonymous === 'true',
            'donor_message' => $metadata->donor_message ?? null,
        ]);

        $helpRequest = CommunityHelpRequest::find($metadata->help_request_id);
        if ($helpRequest) {
            $helpRequest->current_amount = ($helpRequest->current_amount ?? 0) + $amount;
            $helpRequest->donations_count = ($helpRequest->donations_count ?? 0) + 1;
            $helpRequest->save();

            if ($helpRequest->user_id !== $metadata->donor_user_id) {
                $donorName = 'Someone';
                if ($metadata->is_anonymous !== 'true') {
                    $donor = User::find($metadata->donor_user_id);
                    $donorName = $donor ? $donor->name : 'Someone';
                }

                Notification::create([
                    'user_id' => $helpRequest->user_id,
                    'type' => 'donation_received',
                    'data' => [
                        'help_request_id' => $helpRequest->_id,
                        'title' => $helpRequest->title,
                        'amount' => $amount,
                        'donor_name' => $donorName,
                        'message' => "{$donorName} donated {$amount} MAD to your help request \"{$helpRequest->title}\".",
                    ],
                ]);
            }

            Log::info('Donation received', [
                'help_request_id' => $metadata->help_request_id,
                'amount' => $amount
            ]);
        }
    }
}