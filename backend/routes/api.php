<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\RepairBookingController;

// Public routes
Route::post('/contact', 'App\Http\Controllers\ContactController@store');

// Repair booking routes (public)
Route::prefix('repair')->group(function () {
    Route::post('/book', [RepairBookingController::class, 'store']);
    Route::get('/track/{code}', [RepairBookingController::class, 'track']);
    Route::post('/test-notifications', [RepairBookingController::class, 'testNotifications']);
});

// Authentication routes
Route::post('/user/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function () {
        return auth()->user();
    });
    
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin routes
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::patch('/users/{id}', [AdminController::class, 'updateUser']);
    });
});
