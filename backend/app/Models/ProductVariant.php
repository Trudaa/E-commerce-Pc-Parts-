<?php

namespace App\Models;
use App\Models\Cart;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'stock',
        'color',
        'size',
    ];
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    
}