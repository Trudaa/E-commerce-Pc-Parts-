<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post ('/signup', [AuthController::class, 'signup']);
Route::post ('/login', [AuthController::class, 'login']);
Route::post ('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


Route::resource('products', ProductController::class);
Route::resource('carts', CartController::class);
Route::resource('users', UserController::class);
