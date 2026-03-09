<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UrbanIssue;
use App\Models\CommunityHelpRequest;
use App\Models\Category;
use App\Models\Municipality;
use App\Models\Notification;
use App\Models\BoostTransaction;
use App\Models\Donation;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    
    public function dashboardStats()
    {
        $stats = [
            'users_count' => User::count(),
            'issues_count' => UrbanIssue::count(),
            'issues_pending' => UrbanIssue::where('status', 'reported')->count(),
            'issues_resolved' => UrbanIssue::where('status', 'resolved')->count(),
            'help_requests_count' => CommunityHelpRequest::count(),
        ];

        return response()->json($stats);
    }

    
    public function users(Request $request)
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($users);
    }

    
    public function assignIssue(Request $request, $id)
    {
        $validator = \Validator::make($request->all(), [
            'agent_id' => 'required|exists:users,_id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $issue = UrbanIssue::find($id);
        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        $agent = User::find($request->agent_id);
        if ($agent->role !== 'agent') {
            return response()->json(['error' => 'Selected user is not an agent'], 422);
        }

        $issue->assigned_agent_id = $agent->id;
        $issue->status = 'in_progress';
        $issue->save();

        return response()->json($issue);
    }


    
    public function transactions()
    {
        $boosts = BoostTransaction::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($txn) {
                return [
                    'id' => (string) $txn->_id,
                    'user' => $txn->user ? ['name' => $txn->user->name] : null,
                    'type' => 'boost',
                    'amount' => $txn->amount,
                    'currency' => 'USD',
                    'status' => $txn->status ?? 'completed',
                    'createdAt' => $txn->created_at?->toISOString(),
                ];
            });

        $donations = Donation::with('user')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($txn) {
                return [
                    'id' => (string) $txn->_id,
                    'user' => $txn->user ? ['name' => $txn->user->name] : null,
                    'type' => 'donation',
                    'amount' => $txn->amount,
                    'currency' => 'USD',
                    'status' => $txn->status ?? 'completed',
                    'createdAt' => $txn->created_at?->toISOString(),
                ];
            });

        $all = $boosts->merge($donations)->sortByDesc('createdAt')->values();

        return response()->json($all);
    }


    
    public function categories()
    {
        return response()->json(Category::orderBy('name')->get());
    }

    
    public function storeCategory(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'type' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = Category::create($request->only(['name', 'type', 'icon', 'color', 'is_active']));

        return response()->json($category, 201);
    }

    
    public function updateCategory(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $validator = \Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'type' => 'nullable|string|max:50',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:20',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category->update($request->only(['name', 'type', 'icon', 'color', 'is_active']));

        return response()->json($category);
    }

    
    public function destroyCategory($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted']);
    }


    
    public function municipalities()
    {
        return response()->json(Municipality::orderBy('name')->get());
    }

    
    public function storeMunicipality(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:20',
            'region' => 'nullable|string|max:100',
            'contact_info' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $municipality = Municipality::create($request->only(['name', 'code', 'region', 'contact_info', 'is_active']));

        return response()->json($municipality, 201);
    }

    
    public function updateMunicipality(Request $request, $id)
    {
        $municipality = Municipality::find($id);
        if (!$municipality) {
            return response()->json(['error' => 'Municipality not found'], 404);
        }

        $validator = \Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'code' => 'nullable|string|max:20',
            'region' => 'nullable|string|max:100',
            'contact_info' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $municipality->update($request->only(['name', 'code', 'region', 'contact_info', 'is_active']));

        return response()->json($municipality);
    }

    
    public function destroyMunicipality($id)
    {
        $municipality = Municipality::find($id);
        if (!$municipality) {
            return response()->json(['error' => 'Municipality not found'], 404);
        }

        $municipality->delete();

        return response()->json(['message' => 'Municipality deleted']);
    }


    
    public function updateIssueStatus(Request $request, $id)
    {
        $validator = \Validator::make($request->all(), [
            'status' => 'required|in:reported,approved,in_progress,resolved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $issue = UrbanIssue::find($id);
        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        $issue->status = $request->status;
        $issue->save();

        if ($issue->user_id) {
            Notification::create([
                'user_id' => $issue->user_id,
                'type' => 'issue_status_changed',
                'data' => [
                    'issue_id' => $issue->_id,
                    'title' => $issue->title,
                    'new_status' => $request->status,
                    'message' => "Your issue \"{$issue->title}\" has been {$request->status} by an admin.",
                ],
            ]);
        }

        return response()->json($issue);
    }

    
    public function deleteIssue($id)
    {
        $issue = UrbanIssue::find($id);
        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        $issue->delete();

        return response()->json(['message' => 'Issue deleted']);
    }

    
    public function deleteComment($issueId, $commentIndex)
    {
        $issue = UrbanIssue::find($issueId);
        if (!$issue) {
            return response()->json(['error' => 'Issue not found'], 404);
        }

        $comments = $issue->comments ?? [];

        if (!isset($comments[$commentIndex])) {
            return response()->json(['error' => 'Comment not found'], 404);
        }

        array_splice($comments, $commentIndex, 1);
        $issue->comments = $comments;
        $issue->save();

        return response()->json(['message' => 'Comment deleted', 'comments' => $issue->comments]);
    }


    
    public function updateUserRole(Request $request, $id)
    {
        $validator = \Validator::make($request->all(), [
            'role' => 'required|in:citizen,agent,admin',
            'municipality' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->role = $request->role;
        if ($request->has('municipality')) {
            $user->municipality = $request->municipality;
        }
        $user->save();

        return response()->json($user);
    }

    
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }


    
    public function updateHelpRequestStatus(Request $request, $id)
    {
        $validator = \Validator::make($request->all(), [
            'verification_status' => 'required|in:pending,approved,rejected',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $helpRequest = CommunityHelpRequest::find($id);
        if (!$helpRequest) {
            return response()->json(['error' => 'Help request not found'], 404);
        }

        $helpRequest->verification_status = $request->verification_status;
        $helpRequest->save();

        return response()->json($helpRequest);
    }

    
    public function deleteHelpRequest($id)
    {
        $helpRequest = CommunityHelpRequest::find($id);
        if (!$helpRequest) {
            return response()->json(['error' => 'Help request not found'], 404);
        }

        $helpRequest->delete();

        return response()->json(['message' => 'Help request deleted']);
    }
}
