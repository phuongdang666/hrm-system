<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class PayrollItemFactory extends Factory
{
    public function definition()
    {
        return [
            'payroll_id' => \App\Models\Payroll::factory(),
            'base_salary' => $this->faker->numberBetween(3000000, 50000000),
            'working_hours' => $this->faker->randomFloat(2, 140, 200),
            'ot_hours' => $this->faker->randomFloat(2, 0, 20),
            'ot_rate' => $this->faker->randomFloat(2, 1, 5),
            'unpaid_leave_hours' => $this->faker->randomFloat(2, 0, 8),
            'hourly_rate' => $this->faker->randomFloat(2, 10000, 200000),
            'final_amount' => $this->faker->numberBetween(1000000, 5000000),
        ];
    }
}
