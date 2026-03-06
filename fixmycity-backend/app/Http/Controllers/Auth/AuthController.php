<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\UrbanIssue;
use App\Models\CommunityHelpRequest;

class AuthController extends Controller
{
    
    public function register(Request $request) 
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'municipality' => 'nullable|string|in:Agadir,Inezgane,Dcheira Al Jihadia,Aït Melloul,Lqliâa,Taghazout,Aourir,Drarga,Temsia',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'municipality' => $request->municipality,
            'role' => 'citizen',
            'is_active' => true,
            'language_preference' => $request->lang ?? 'fr',
            'theme_preference' => 'light',
            'stats' => [
                'urban_issues_created' => 0,
                'total_donated_amount' => 0,
                'total_boost_paid' => 0
            ],
            'notifications' => [
                'email' => true,
                'push' => true
            ],
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'token' => $token,
            'user' => $user
        ], 201);
    }

    
    public function login(Request $request) 
    {
        $credentials = $request->only('email', 'password');
        
        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'token' => $token,
            'user' => auth('api')->user()
        ]);
    }

    
    public function me() 
    {
        return response()->json(auth('api')->user());
    }

    
    public function logout() 
    {
        auth('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
    }

    
    public function refresh()
    {
        return response()->json([
            'token' => auth('api')->refresh()
        ]);
    }

    
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'municipality' => 'nullable|string|in:Agadir,Inezgane,Dcheira Al Jihadia,Aït Melloul,Lqliâa,Taghazout,Aourir,Drarga,Temsia',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        if ($request->has('phone')) {
            $user->phone = $request->phone;
        }
        if ($request->has('municipality')) {
            $user->municipality = $request->municipality;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    
    public function updateProfilePicture(Request $request) 
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar_url) {
                $oldPath = str_replace(url('storage') . '/', '', $user->avatar_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar_url = url('storage/' . $path);
            $user->save();

            return response()->json([
                'message' => 'Profile picture updated successfully',
                'user' => $user,
                'avatar_url' => $user->avatar_url
            ]);
        }

        return response()->json(['error' => 'No image provided'], 400);
    }

    
    public function deleteProfilePicture() 
    {
        $user = auth('api')->user();

        if ($user->avatar_url) {
            $oldPath = str_replace(url('storage') . '/', '', $user->avatar_url);
            Storage::disk('public')->delete($oldPath);
            
            $user->avatar_url = null;
            $user->save();

            return response()->json([
                'message' => 'Profile picture deleted successfully',
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'No profile picture to delete']);
    }

    
    public function deleteAccount()
    {
        $user = auth('api')->user();

        UrbanIssue::where('user_id', $user->id)->delete();
        CommunityHelpRequest::where('user_id', $user->id)->delete();

        $issuesUpvoted = UrbanIssue::where('upvoted_by', $user->id)->get();
        foreach ($issuesUpvoted as $issue) {
            $issue->pull('upvoted_by', $user->id);
            $issue->decrement('upvotes');
        }

        UrbanIssue::where('comments.user_id', $user->id)->pull('comments', ['user_id' => $user->id]);

        if ($user->avatar_url) {
            $oldPath = str_replace(url('storage') . '/', '', $user->avatar_url);
            Storage::disk('public')->delete($oldPath);
        }

        $user->delete();

        return response()->json(['message' => 'Account deleted successfully']);
    }
}