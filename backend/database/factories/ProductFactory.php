<?php

namespace Database\Factories;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;


class ProductFactory extends Factory
{
    protected $model = Product::class;
    public function definition(): array
    {
        return [
            'name' => fake()->word(),
            'price' => fake()->randomFloat(2, 0, 1000),
            'image' => fake()->imageUrl(),
            'discount' => fake()->numberBetween(0, 99),
            'brand' => $this->faker->randomElement(['asus', 'msi', 'gigabyte']),
            'category' => $this->faker->randomElement(['processor', 'motherboard', 'ram', 'videocard', 'storage']),
            'rating' => fake()->randomFloat(1, 0.0, 5.0),
            // 'stock' => fake()->numberBetween(0, 100),
            // 'color' => $this->faker->randomElement(['black', 'white', 'pink']),
            // 'size' => $this->faker->randomElement(['1TB', '500GB', '256GB', '128GB', '512GB']),
        ];
    }

    
}
