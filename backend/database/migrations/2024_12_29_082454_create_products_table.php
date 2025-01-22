<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->integer('discount')->default(0);
            $table->string('image');
            $table->string('brand');
            $table->string('category');
            $table->decimal('rating', 3, 1);
            $table->timestamps();
        });

    }
            // $table->integer('stock')->default(0);
            // $table->string('color');
            // $table->string('size');



    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
        
    }
};
