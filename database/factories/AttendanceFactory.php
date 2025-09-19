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
        $date = $this->faker->dateTimeBetween('-30 days', 'now');
        $checkInAt = (clone $date)->setTime(rand(8, 10), rand(0, 59), rand(0, 59));
        $checkOutAt = (clone $date)->setTime(rand(17, 19), rand(0, 59), rand(0, 59));

        $regularHours = 8.00;
        $overtimeHours = $checkOutAt->diff($checkInAt)->h - 8;
        $overtimeHours = max(0, $overtimeHours);
        $totalHours = $regularHours + $overtimeHours;

        return [
            'employee_id' => \App\Models\Employee::factory(),
            'date' => $date,
            'check_in_at' => $checkInAt,
            'check_out_at' => $checkOutAt,
            'regular_hours' => $regularHours,
            'overtime_hours' => $overtimeHours,
            'total_hours' => $totalHours,
            'day_type' => $this->faker->randomElement(['weekday', 'weekend', 'holiday']),
            'status' => $this->faker->randomElement(['present', 'absent', 'late', 'early_leave', 'half_day', 'work_from_home']),
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}
