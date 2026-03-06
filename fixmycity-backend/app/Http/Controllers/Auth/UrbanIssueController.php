<?php

namespace App\Http\Controllers;

use App\Models\UrbanIssue;
use Illuminate\Http\Request;

class UrbanIssueController extends Controller
{
    public function index(Request $request)
    {
        $query = UrbanIssue::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $issues = $query->orderBy('boost_score', 'desc')
                       ->orderBy('created_at', 'desc')
                       ->paginate(20);

        return response()->json($issues);
    }

    public function show($id)
    {
        $issue = UrbanIssue::findOrFail($id);
        return response()->json($issue);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'location' => 'required|array',
            'location.type' => 'required|string',
            'location.coordinates' => 'required|array',
            'photos' => 'nullable|array',
        ]);

        $issue = UrbanIssue::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'location' => $validated['location'],
            'photos' => $validated['photos'] ?? [],
            'status' => 'pending',
            'priority' => 'normal',
            'upvotes' => 0,
            'upvoted_by' => [],
            'comments' => [],
            'boost_score' => 0,
            'boost_history' => [],
        ]);

        return response()->json($issue, 201);
    }

    public function update(Request $request, $id)
    {
        $issue = UrbanIssue::findOrFail($id);

        if ($issue->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'photos' => 'sometimes|array',
        ]);

        $issue->update($validated);

        return response()->json($issue);
    }

    public function upvote($id)
    {
        $issue = UrbanIssue::findOrFail($id);
        $userId = auth()->id();

        $upvotedBy = $issue->upvoted_by ?? [];

        if (in_array($userId, $upvotedBy)) {
            $upvotedBy = array_values(array_diff($upvotedBy, [$userId]));
            $issue->upvotes = max(0, $issue->upvotes - 1);
        } else {
            $upvotedBy[] = $userId;
            $issue->upvotes = ($issue->upvotes ?? 0) + 1;
        }

        $issue->upvoted_by = $upvotedBy;
        $issue->save();

        return response()->json($issue);
    }

    public function addComment(Request $request, $id)
    {
        $validated = $request->validate([
            'text' => 'required|string|max:1000',
        ]);

        $issue = UrbanIssue::findOrFail($id);
        
        $comments = $issue->comments ?? [];
        $comments[] = [
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name,
            'text' => $validated['text'],
            'created_at' => now()->toISOString(),
        ];

        $issue->comments = $comments;
        $issue->save();

        return response()->json($issue);
    }
}