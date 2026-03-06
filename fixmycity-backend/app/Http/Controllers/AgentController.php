<?php

namespace App\Http\Controllers;

use App\Models\UrbanIssue;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AgentController extends Controller
{
    
    public function assignedIssues(Request $request)
    {
        $user = auth('api')->user();
        
        if ($user->role !== 'agent') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $agentMunicipalityId = $user->municipality_id ?? $user->municipality;

        $query = UrbanIssue::where('assigned_agent_id', $user->id)
            ->where(function ($q) use ($agentMunicipalityId) {
                $q->where('municipality_id', $agentMunicipalityId)
                  ->orWhere('municipality', $agentMunicipalityId);
            })
            ->with('user')
            ->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $issues = $query->paginate(20);

        return response()->json($issues);
    }

    
    public function updateStatus(Request $request, $id)
    {
        $user = auth('api')->user();

        if ($user->role !== 'agent') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $rules = [
            'status' => 'required|in:in_progress,resolved,rejected',
            'resolved_photos.*' => 'image|mimes:jpeg,png,jpg,gif,webp,heic,heif|max:10240',
        ];

        if ($request->status === 'resolved') {
            $rules['resolved_photos'] = 'required|array|min:1';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $issue = UrbanIssue::find($id);

        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        if ($issue->assigned_agent_id !== $user->id) {
            return response()->json(['error' => 'Issue not assigned to you'], 403);
        }

        $agentMunicipalityId = $user->municipality_id ?? $user->municipality;
        $issueMunicipality = $issue->municipality_id ?? $issue->municipality;

        if ($issueMunicipality !== $agentMunicipalityId) {
            return response()->json(['error' => 'Issue does not belong to your municipality'], 403);
        }

        if ($request->hasFile('resolved_photos') && $request->status === 'resolved') {
            $photoUrls = $issue->resolved_photos ?? [];
            
            $url = env('CLOUDINARY_URL');
            if ($url) {
                $cleanUrl = str_replace('cloudinary://', '', $url);
                list($auth, $cloud_name) = explode('@', $cleanUrl);
                list($api_key, $api_secret) = explode(':', $auth);
                
                \Cloudinary\Configuration\Configuration::instance([
                    'cloud' => [
                        'cloud_name' => $cloud_name, 
                        'api_key' => $api_key, 
                        'api_secret' => $api_secret
                    ],
                    'url' => ['secure' => true]
                ]);
            }

            foreach ($request->file('resolved_photos') as $photo) {
                try {
                    $uploadApi = new \Cloudinary\Api\Upload\UploadApi();
                    $result = $uploadApi->upload($photo->getRealPath(), [
                        'folder' => 'fixmycity/resolved_issues'
                    ]);
                    $photoUrls[] = $result['secure_url'];
                } catch (\Exception $e) {
                    \Log::error('Resolved photo upload failed: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
                    return response()->json(['error' => 'Failed to upload resolved photo'], 500);
                }
            }
            $issue->resolved_photos = $photoUrls;
        }

        $issue->status = $request->status;
        $issue->save();

        if ($issue->user_id !== $user->id) {
            Notification::create([
                'user_id' => $issue->user_id,
                'type' => 'issue_status_changed',
                'data' => [
                    'issue_id' => $issue->_id,
                    'title' => $issue->title,
                    'new_status' => $request->status,
                    'agent_name' => $user->name,
                    'message' => "Your issue \"{$issue->title}\" status changed to {$request->status}.",
                ],
            ]);
        }

        return response()->json($issue);
    }

    
    public function reports()
    {
        $user = auth('api')->user();

        if ($user->role !== 'agent') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $agentId = $user->id;

        $lifetimeResolved = UrbanIssue::where('assigned_agent_id', $agentId)
            ->where('status', 'resolved')
            ->count();

        $currentMonthResolved = UrbanIssue::where('assigned_agent_id', $agentId)
            ->where('status', 'resolved')
            ->where('updated_at', '>=', now()->startOfMonth())
            ->count();

        $resolvedIssues = UrbanIssue::where('assigned_agent_id', $agentId)
            ->where('status', 'resolved')
            ->get(['created_at', 'updated_at']);

        $avgResolutionDays = 0;
        if ($resolvedIssues->count() > 0) {
            $totalDays = $resolvedIssues->sum(function ($issue) {
                return $issue->created_at->diffInHours($issue->updated_at) / 24;
            });
            $avgResolutionDays = round($totalDays / $resolvedIssues->count(), 1);
        }

        $history = [];
        for ($i = 0; $i < 6; $i++) {
            $date = now()->subMonths($i);
            $startOfMonth = $date->copy()->startOfMonth();
            $endOfMonth = $date->copy()->endOfMonth();

            $monthResolved = UrbanIssue::where('assigned_agent_id', $agentId)
                ->where('status', 'resolved')
                ->whereBetween('updated_at', [$startOfMonth, $endOfMonth])
                ->count();

            $monthIssues = UrbanIssue::where('assigned_agent_id', $agentId)
                ->where('status', 'resolved')
                ->whereBetween('updated_at', [$startOfMonth, $endOfMonth])
                ->get(['created_at', 'updated_at']);

            $monthAvg = 0;
            if ($monthIssues->count() > 0) {
                $monthTotalDays = $monthIssues->sum(function ($issue) {
                    return $issue->created_at->diffInHours($issue->updated_at) / 24;
                });
                $monthAvg = round($monthTotalDays / $monthIssues->count(), 1);
            }

            $history[] = [
                'month' => $date->format('F Y'),
                'total_resolved' => $monthResolved,
                'avg_resolution_time' => $monthAvg . ' Days',
                'date_generated' => $endOfMonth->format('M j, Y'),
            ];
        }

        $categories = UrbanIssue::where('assigned_agent_id', $agentId)
            ->get()
            ->groupBy('category')
            ->map(fn($group) => $group->count());

        return response()->json([
            'lifetime_resolved' => $lifetimeResolved,
            'avg_resolution_days' => $avgResolutionDays,
            'current_month_progress' => $currentMonthResolved,
            'history' => $history,
            'tasks_per_category' => $categories,
        ]);
    }
}
