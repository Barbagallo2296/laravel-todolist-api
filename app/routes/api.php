<?php

use App\Http\Controllers\ItemController;
use App\Http\Controllers\TodolistController;

use Illuminate\Support\Facades\Route;

Route::apiResource('todolists', TodolistController::class);
Route::apiResource('items', ItemController::class);

Route::get('todolists/{todolist}/items', [TodolistController::class, 'items']);