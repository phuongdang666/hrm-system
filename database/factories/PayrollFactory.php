<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class PayrollFactory extends Factory
{
    public function definition()
    {
        return [
            'employee_id' => \App\Models\Employee::factory(),
            'month' => $this->faker->numberBetween(1, 12),
            'year' => date('Y'),
            'status' => 'draft',
        ];
    }
}
