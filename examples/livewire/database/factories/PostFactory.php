<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(rand(3, 8)),
            'content' => fake()->paragraphs(rand(1, 3), true),
            'published_at' => fake()->optional(0.8)->dateTimeThisYear(), // %80 ihtimalle bir tarih verir
            'is_published' => fake()->boolean(90), // %90 ihtimalle true
            'status' => fake()->randomElement(['draft', 'published', 'archived']),
        ];
    }
}
