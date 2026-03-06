<?php

namespace App\Http\Controllers;

use App\Models\UrbanIssue;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class UrbanIssueController extends Controller
{
    
    public function index(Request $request)
    {
        $query = UrbanIssue::with('user');

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        if ($request->has('municipality') && $request->municipality !== 'all') {
            $query->where('municipality', $request->municipality);
        }
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if (!auth('api')->check() && $request->bearerToken()) {
            try {
                auth('api')->authenticate();
            } catch (\Exception $e) {
            }
        }

        if ($request->has('mine') && auth('api')->check()) {
            $query->where('user_id', auth('api')->id());
        } else {
            $user = auth('api')->user();
            if (!$user || $user->role !== 'admin') {
                if ($request->has('status') && $request->status !== 'all') {
                    if (in_array($request->status, ['reported', 'rejected', 'pending'])) {
                        if ($user) {
                            $query->where('user_id', $user->id);
                        } else {
                            return response()->json(['data' => [], 'links' => [], 'meta' => []]);
                        }
                    }
                } else {
                    $query->where(function($q) use ($user) {
                        $q->whereNotIn('status', ['reported', 'rejected', 'pending']);
                        if ($user) {
                            $q->orWhere('user_id', $user->id);
                        }
                    });
                }
            }
        }

        $query->orderBy('boost_score', 'desc');

        if ($request->has('sort') && $request->sort === 'upvotes') {
            $query->orderBy('upvotes', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $issues = $query->paginate(20);

        return response()->json($issues);
    }

    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'priority' => 'required|in:low,medium,high,critical',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'municipality' => 'required|string|exists:municipalities,name',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif,webp,heic,heif|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $photoUrls = [];
        if ($request->hasFile('photos')) {
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

            foreach ($request->file('photos') as $photo) {
                try {
                    $uploadApi = new \Cloudinary\Api\Upload\UploadApi();
                    $result = $uploadApi->upload($photo->getRealPath(), [
                        'folder' => 'fixmycity/issues'
                    ]);
                    $photoUrls[] = $result['secure_url'];
                } catch (\Exception $e) {
                    \Log::error('Photo upload failed: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
                    return response()->json(['error' => 'Failed to upload photo'], 500);
                }
            }
        }

        $issue = UrbanIssue::create([
            'user_id' => auth('api')->id(),
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'status' => 'reported',
            'priority' => $request->priority,
            'location' => [
                'type' => 'Point',
                'coordinates' => [
                    (float)$request->longitude, 
                    (float)$request->latitude
                ]
            ],
            'municipality' => $request->municipality,
            'photos' => $photoUrls,
            'upvotes' => 0,
            'upvoted_by' => [],
            'comments' => [],
            'boost_score' => 0,
            'boost_history' => [],
        ]);

        return response()->json($issue, 201);
    }

    
    public function show($id)
    {
        $issue = UrbanIssue::with('user')->find($id);

        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        return response()->json($issue);
    }

    
    public function update(Request $request, $id)
    {
        $issue = UrbanIssue::find($id);

        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        if ($issue->user_id !== auth('api')->id() && !in_array(auth('api')->user()->role, ['admin', 'agent'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($issue->user_id === auth('api')->id() && auth('api')->user()->role === 'citizen') {
            if (isset($issue->boost_status) && $issue->boost_status === 'active') {
                return response()->json(['error' => 'This issue cannot be edited while it has an active boost'], 403);
            }
            if (in_array($issue->status, ['in_progress', 'resolved'])) {
                return response()->json(['error' => 'This issue cannot be edited after work has started'], 403);
            }
        }

        $oldData = $issue->only(['title', 'description', 'category', 'priority', 'municipality']);
        $newData = $request->only(['title', 'description', 'category', 'priority', 'status', 'municipality']);

        if ($request->hasFile('photos')) {
            $photoUrls = [];
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

            foreach ($request->file('photos') as $photo) {
                try {
                    $uploadApi = new \Cloudinary\Api\Upload\UploadApi();
                    $result = $uploadApi->upload($photo->getRealPath(), [
                        'folder' => 'fixmycity/issues'
                    ]);
                    $photoUrls[] = $result['secure_url'];
                } catch (\Exception $e) {
                    \Log::error('Photo upload failed: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
                    return response()->json(['error' => 'Failed to upload photo'], 500);
                }
            }
            $newData['photos'] = $photoUrls;
        }

        $issue->update($newData);

        if ($issue->user_id === auth('api')->id() && auth('api')->user()->role === 'citizen') {
            $textChanged = false;
            foreach (['title', 'description', 'category', 'priority', 'municipality'] as $field) {
                if (isset($newData[$field]) && $newData[$field] !== $oldData[$field]) {
                    $textChanged = true;
                    break;
                }
            }

            $issue->status = 'pending';
            $issue->save();

            $message = $textChanged 
                ? "Your issue was updated and is pending re-approval" 
                : "Your issue photos were updated and is pending re-approval";

            Notification::create([
                'user_id' => $issue->user_id,
                'type' => 'issue_updated',
                'data' => [
                    'issue_id' => $issue->_id,
                    'title' => $issue->title,
                    'message' => $message,
                ],
            ]);
        }

        return response()->json($issue);
    }

    
    public function destroy($id)
    {
        $issue = UrbanIssue::find($id);

        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        if ($issue->user_id !== auth('api')->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (isset($issue->boost_status) && $issue->boost_status === 'active') {
            return response()->json(['error' => 'Cannot delete a boosted issue'], 403);
        }

        if (in_array($issue->status, ['in_progress', 'resolved'])) {
            return response()->json(['error' => 'Cannot delete after work has started'], 403);
        }

        $issue->delete();

        return response()->json(['message' => 'Issue deleted successfully']);
    }

    
    public function upvote($id)
    {
        $issue = UrbanIssue::find($id);

        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        $userId = auth('api')->id();
        $upvotedBy = $issue->upvoted_by ?? [];

        if (in_array($userId, $upvotedBy)) {
            $issue->pull('upvoted_by', $userId);
            $issue->decrement('upvotes');
            $message = 'Upvote removed';
        } else {
            $issue->push('upvoted_by', $userId);
            $issue->increment('upvotes');
            $message = 'Upvoted successfully';
        }
        
        $issue = UrbanIssue::find($id);

        return response()->json([
            'message' => $message,
            'upvotes' => $issue->upvotes,
            'upvoted_by' => $issue->upvoted_by
        ]);
    }
    
    
    public function addComment(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        $issue = UrbanIssue::find($id);
        
        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }
        
        $comment = [
            'user_id' => auth('api')->id(),
            'user_name' => auth('api')->user()->name,
            'content' => $request->content,
            'created_at' => now()->toIso8601String()
        ];
        
        $issue->push('comments', $comment);

        if ($issue->user_id !== auth('api')->id()) {
            Notification::create([
                'user_id' => $issue->user_id,
                'type' => 'new_comment',
                'data' => [
                    'issue_id' => $issue->_id,
                    'title' => $issue->title,
                    'commenter_name' => auth('api')->user()->name,
                    'message' => auth('api')->user()->name . " commented on your issue \"{$issue->title}\".",
                ],
            ]);
        }

        return response()->json($comment, 201);
    }
}
