<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


    class Cart extends Model
    {
        use HasFactory;
    
        protected $fillable = [
            'product_id',
            'user_id',
            'quantity',
        
        ];
    
        public function product()
        {
            return $this->belongsTo(Product::class);
          
        }
        public function user()
        {
            return $this->belongsTo(User::class);
          
        }

}

