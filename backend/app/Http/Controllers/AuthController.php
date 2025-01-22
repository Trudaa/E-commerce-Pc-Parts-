<?php

namespace App\Http\Controllers;


use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Container\Attributes\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request) 
    {
     /** @var User $user */
     $data = $request->validated();
    
     if (!Auth::attempt($data)) {
         return response(['message' => 'Wrong email or password'], 422);
     }
     
     $user = Auth::user();   
     $token = $user->createToken('main')->plainTextToken;
     
     return response()->json([
         'user' => $user,
         'token' => $token
     ]);
    }

    public function signup(SignupRequest $request) 
{
    $data = $request->validated();
    
    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => bcrypt($data['password']),
        'role' => 'staff'
    ]);
    
    $token = $user->createToken('main')->plainTextToken;
    
    return response()->json([
        'user' => $user,
        'token' => $token
    ]);
}
    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

}
