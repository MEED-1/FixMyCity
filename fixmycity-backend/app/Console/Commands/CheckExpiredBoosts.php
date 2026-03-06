<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UrbanIssue;
use App\Models\CommunityHelpRequest;
use Carbon\Carbon;

class CheckExpiredBoosts extends Command
{
    protected $signature = 'boost:check-expired';
    protected $description = 'Check for expired boosts and activate next in queue';

    public function handle()
    {
        $this->info('Checking for expired boosts...');

        $this->checkExpiredItems(UrbanIssue::class);
        $this->checkExpiredItems(CommunityHelpRequest::class);

        $this->info('Boost check completed.');
    }

    private function checkExpiredItems($modelClass)
    {
        $expiredItems = $modelClass::where('boost_expires_at', '<=', now())
            ->whereNotNull('current_boost_level')
            ->get();

        foreach ($expiredItems as $item) {
            $boostHistory = $item->boost_history ?? [];
            
            // Find next active boost
            $nextBoost = null;
            foreach ($boostHistory as $boost) {
                $expiresAt = Carbon::parse($boost['expires_at']);
                if ($expiresAt->isFuture()) {
                    $nextBoost = $boost;
                    break;
                }
            }

            if ($nextBoost) {
                // Activate next boost
                $item->update([
                    'current_boost_level' => $nextBoost['boost_level'],
                    'boost_expires_at' => $nextBoost['expires_at'],
                ]);
                $this->info("Activated next boost for {$modelClass} {$item->_id}");
            } else {
                // No more active boosts
                $item->update([
                    'current_boost_level' => null,
                    'boost_expires_at' => null,
                ]);
                $this->info("Cleared boost for {$modelClass} {$item->_id}");
            }
        }
    }
}