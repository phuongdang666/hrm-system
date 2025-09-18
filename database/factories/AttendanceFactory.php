<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class AttendanceFactory extends Factory
{
    public function definition()
    {
        return [
            'employee_id' => \App\Models\Employee::factory(),
            'date' => $this->faker->date(),
            'check_in_at' => $this->faker->dateTimeThisYear(),
            'check_out_at' => $this->faker->dateTimeThisYear(),
            'regular_hours' => $this->faker->randomFloat(2, 4, 8),
            'overtime_hours' => $this->faker->randomFloat(2, 0, 4),
            'total_hours' => $this->faker->randomFloat(2, 4, 12),
            'day_type' => $this->faker->randomElement(['weekday', 'weekend', 'holiday']),
            'status' => $this->faker->randomElement(['present', 'absent', 'late', 'early_leave', 'half_day', 'work_from_home']),
            'approved_by' => null,
            'approved_at' => null,
            'approval_status' => 'pending',
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
