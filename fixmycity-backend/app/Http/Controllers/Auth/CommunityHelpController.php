<?php

namespace App\Http\Controllers;

use App\Models\CommunityHelpRequest;
use Illuminate\Http\Request;

class CommunityHelpController extends Controller
{
    public function index(Request $request)
    {
        $query = CommunityHelpRequest::where('verification_status', 'approved');

        $requests = $query->orderBy('boost_score', 'desc')
                         ->orderBy('created_at', 'desc')
                         ->paginate(20);

        return response()->json($requests);
    }

    public function show($id)
    {
        $request = CommunityHelpRequest::findOrFail($id);
        return response()->json($request);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'target_amount' => 'required|numeric|min:0',
            'location' => 'required|array',
            'photos' => 'nullable|array',
            'documents' => 'nullable|array',
        ]);

        $helpRequest = CommunityHelpRequest::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'target_amount' => $validated['target_amount'],
            'current_amount' => 0,
            'donations_count' => 0,
            'location' => $validated['location'],
            'photos' => $validated['photos'] ?? [],
            'documents' => $validated['documents'] ?? [],
            'status' => 'open',
            'verification_status' => 'pending',
            'boost_score' => 0,
            'boost_history' => [],
        ]);

        return response()->json($helpRequest, 201);
    }
}