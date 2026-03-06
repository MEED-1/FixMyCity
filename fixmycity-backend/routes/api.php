<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UrbanIssueController;
use App\Http\Controllers\CommunityHelpController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\BoostController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificationController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/urban-issues', [UrbanIssueController::class, 'index']);
Route::get('/urban-issues/{id}', [UrbanIssueController::class, 'show']);
Route::get('/community-help', [CommunityHelpController::class, 'index']);
Route::get('/community-help/{id}', [CommunityHelpController::class, 'show']);
Route::get('/categories', [AdminController::class, 'categories']);
Route::get('/municipalities', [AdminController::class, 'municipalities']);

Route::post('/webhook/stripe', [StripeWebhookController::class, 'handle']);

Route::middleware(['jwt.auth'])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::post('/auth/profile-picture', [AuthController::class, 'updateProfilePicture']);
    Route::delete('/auth/profile-picture', [AuthController::class, 'deleteProfilePicture']);
    Route::delete('/auth/account', [AuthController::class, 'deleteAccount']);

    Route::post('/urban-issues', [UrbanIssueController::class, 'store']);
    Route::patch('/urban-issues/{id}', [UrbanIssueController::class, 'update']);
    Route::delete('/urban-issues/{id}', [UrbanIssueController::class, 'destroy']);
    Route::post('/urban-issues/{id}/upvote', [UrbanIssueController::class, 'upvote']);
    Route::post('/urban-issues/{id}/comments', [UrbanIssueController::class, 'addComment']);

    Route::post('/community-help', [CommunityHelpController::class, 'store']);
    Route::patch('/community-help/{id}', [CommunityHelpController::class, 'update']);
    Route::delete('/community-help/{id}', [CommunityHelpController::class, 'destroy']);

    Route::post('/donations/create-session', [DonationController::class, 'createSession']);
    Route::get('/donations/my-donations', [DonationController::class, 'myDonations']);

    Route::post('/boost/create-session', [BoostController::class, 'createSession']);
    Route::get('/boost/my-boosts', [BoostController::class, 'myBoosts']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    Route::middleware(['role:agent'])->prefix('agent')->group(function () {
        Route::get('/issues', [AgentController::class, 'assignedIssues']);
        Route::patch('/issues/{id}/status', [AgentController::class, 'updateStatus']);
        Route::get('/reports', [AgentController::class, 'reports']);
    });

    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'dashboardStats']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/transactions', [AdminController::class, 'transactions']);
        Route::post('/issues/{id}/assign', [AdminController::class, 'assignIssue']);

        Route::get('/categories', [AdminController::class, 'categories']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [AdminController::class, 'destroyCategory']);

        Route::get('/municipalities', [AdminController::class, 'municipalities']);
        Route::post('/municipalities', [AdminController::class, 'storeMunicipality']);
        Route::put('/municipalities/{id}', [AdminController::class, 'updateMunicipality']);
        Route::delete('/municipalities/{id}', [AdminController::class, 'destroyMunicipality']);

        Route::patch('/issues/{id}/status', [AdminController::class, 'updateIssueStatus']);
        Route::delete('/issues/{id}', [AdminController::class, 'deleteIssue']);
        Route::delete('/issues/{issueId}/comments/{index}', [AdminController::class, 'deleteComment']);

        Route::patch('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);

        Route::patch('/help-requests/{id}/status', [AdminController::class, 'updateHelpRequestStatus']);
        Route::delete('/help-requests/{id}', [AdminController::class, 'deleteHelpRequest']);
    });
});