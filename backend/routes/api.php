<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post ('/login', [AuthController::class, 'login']);
Route::post ('/signup', [AuthController::class, 'signup']);

Route::resource('products', ProductController::class);
Route::resource('carts', CartController::class);
