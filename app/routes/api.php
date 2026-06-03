<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\TodolistController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('todolists', TodolistController::class);
    Route::apiResource('items', ItemController::class);
    Route::get('todolists/{todolist}/items', [TodolistController::class, 'items']);

});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Benvenuto admin!']);
    });
});