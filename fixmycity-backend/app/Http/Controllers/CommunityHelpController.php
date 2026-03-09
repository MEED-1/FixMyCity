<?php

namespace App\Http\Controllers;

use App\Models\CommunityHelpRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class CommunityHelpController extends Controller
{
    
    public function index(Request $request)
    {
        $query = CommunityHelpRequest::with('user');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if (!auth('api')->check() && $request->bearerToken()) {
            try {
                $u = auth('api')->authenticate();
            } catch (\Exception $e) {
                \Log::error("DEBUG: Token parse error: " . $e->getMessage());
            }
        }

        if ($request->has('mine') && auth('api')->check()) {
            $query->where('user_id', auth('api')->id());
        } else {
            $user = auth('api')->user();
            if (!$user || $user->role !== 'admin') {
                $query->where(function($q) use ($user) {
                    $q->whereNotIn('verification_status', ['pending', 'rejected']);
                    if ($user) {
                        $q->orWhere('user_id', $user->id);
                    }
                });
            }
        }

        $query->orderBy('created_at', 'desc');

        $requests = $query->paginate(20);

        return response()->json($requests);
    }

    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:volunteering,donation,other',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif,webp,heic,heif|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $photoUrls = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                try {
                    $result = cloudinary()->uploadApi()->upload($photo->getRealPath(), [
                        'folder' => 'fixmycity/help_requests'
                    ]);
                    $photoUrls[] = $result['secure_url'];
                } catch (\Exception $e) {
                    \Log::error('Photo upload failed: ' . $e->getMessage());
                    return response()->json(['error' => 'Failed to upload photo'], 500);
                }
            }
        }

        $helpRequest = CommunityHelpRequest::create([
            'user_id' => auth('api')->id(),
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'status' => 'active',
            'target_amount' => $request->target_amount ?? 0,
            'current_amount' => 0,
            'donations_count' => 0,
            'location' => [
                'type' => 'Point',
                'coordinates' => [
                    (float)$request->longitude, 
                    (float)$request->latitude
                ]
            ],
            'photos' => $photoUrls,
            'verification_status' => 'pending',
        ]);

        return response()->json($helpRequest, 201);
    }

    
    public function show($id)
    {
        $helpRequest = CommunityHelpRequest::with('user')->find($id);

        if (!$helpRequest) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        return response()->json($helpRequest);
    }

    
    public function update(Request $request, $id)
    {
        $helpRequest = CommunityHelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        if ($helpRequest->user_id !== auth('api')->id() && !in_array(auth('api')->user()->role, ['admin', 'agent'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($helpRequest->current_amount > 0 || $helpRequest->donations_count > 0) {
            return response()->json(['error' => 'Cannot edit a request that has received donations.'], 403);
        }

        if (!in_array($helpRequest->status, ['active', 'pending', 'approved'])) {
            return response()->json(['error' => 'Cannot edit a resolved or closed request.'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'string',
            'category' => 'in:volunteering,donation,other',
            'target_amount' => 'numeric',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif,webp,heic,heif|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $needsReapproval = false;
        
        $photoUrls = $helpRequest->photos ?? [];
        if ($request->has('removed_photos')) {
            $removed = is_string($request->removed_photos) ? json_decode($request->removed_photos, true) : $request->removed_photos;
            if (is_array($removed)) {
                $photoUrls = array_values(array_diff($photoUrls, $removed));
                $needsReapproval = true;
            }
        }

        if ($request->hasFile('photos')) {
            $needsReapproval = true;
            foreach ($request->file('photos') as $photo) {
                try {
                    $result = cloudinary()->uploadApi()->upload($photo->getRealPath(), [
                        'folder' => 'fixmycity/help_requests'
                    ]);
                    $photoUrls[] = $result['secure_url'];
                } catch (\Exception $e) {
                    \Log::error('Photo upload failed: ' . $e->getMessage());
                    return response()->json(['error' => 'Failed to upload photo'], 500);
                }
            }
        }

        if (
            ($request->has('title') && $request->title !== $helpRequest->title) ||
            ($request->has('description') && $request->description !== $helpRequest->description)
        ) {
            $needsReapproval = true;
        }

        $updateData = $request->only(['title', 'description', 'status', 'target_amount', 'category']);
        $updateData['photos'] = $photoUrls;

        if ($needsReapproval && auth('api')->user()->role === 'citizen') {
            $updateData['verification_status'] = 'pending';
            
            \App\Models\Notification::create([
                'user_id' => $helpRequest->user_id,
                'title' => 'Request requires re-approval',
                'message' => 'Your help request was edited and is now pending admin approval again.',
                'type' => 'status_update',
                'related_id' => $helpRequest->id,
                'related_type' => 'urban_issue', // Or help_request if you use that
            ]);
        }

        $helpRequest->update($updateData);

        return response()->json($helpRequest);
    }

    
    public function destroy($id)
    {
        $helpRequest = CommunityHelpRequest::find($id);

        if (!$helpRequest) {
            return response()->json(['error' => 'Request not found'], 404);
        }

        if ($helpRequest->user_id !== auth('api')->id() && !in_array(auth('api')->user()->role, ['admin', 'agent'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($helpRequest->current_amount > 0 || $helpRequest->donations_count > 0) {
            return response()->json(['error' => 'Cannot delete a request that has received donations.'], 403);
        }

        $helpRequest->delete();

        return response()->json(['message' => 'Request deleted successfully']);
    }
}
