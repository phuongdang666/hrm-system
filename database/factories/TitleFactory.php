<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class TitleFactory extends Factory
{
    public function definition()
    {
        return [
            'name' => $this->faker->unique()->jobTitle(),
            'description' => $this->faker->sentence(),
        ];
    }
}
