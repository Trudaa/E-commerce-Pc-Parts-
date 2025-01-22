<?php

namespace App\Models;

use App\Models\Cart;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'discount',    
        'image',         
        'brand',         
        'category',     
        'rating',        
    ];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
}