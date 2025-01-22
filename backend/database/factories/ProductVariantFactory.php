<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),  
            'color' => $this->faker->randomElement(['black', 'white', 'pink']),
            'size' => $this->faker->randomElement(['1TB', '500GB', '256GB', '128GB', '512GB']),  
            'stock' => fake()->numberBetween(0, 100),
        ];
    }
}
