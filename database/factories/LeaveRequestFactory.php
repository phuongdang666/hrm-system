<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class LeaveRequestFactory extends Factory
{
    public function definition()
    {
        $start = $this->faker->dateTimeBetween('-2 months', '+2 months');
        $end = (clone $start)->modify('+' . rand(1, 5) . ' days');

        return [
            'employee_id' => \App\Models\Employee::factory(),
            'type' => $this->faker->randomElement(['annual', 'sick', 'unpaid']),
            'start_date' => $start,
            'end_date' => $end,
            'days' => rand(1, 5),
            'reason' => $this->faker->sentence(),
            'status' => 'pending',
        ];
    }
}
