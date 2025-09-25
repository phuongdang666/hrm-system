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
        // $CheckinTime = '09:00:00';
        // $CheckoutTime = '18:00:00';
        $date = $this->faker->dateTimeBetween('-60 days', 'now');
        $checkInAt = (clone $date)->setTime(rand(8, 9), rand(0, 59), rand(0, 59));
        $checkOutAt = (clone $date)->setTime(rand(17, 18), rand(0, 59), rand(0, 59));

        $regularHours = min(8, $checkOutAt->diff($checkInAt)->h);
        $overtimeHours = $checkOutAt->diff($checkInAt)->h - 8;
        $overtimeHours = max(0, $overtimeHours);
        $totalHours = $regularHours + $overtimeHours;
        $status = 'present';
        if ($checkInAt > (clone $date)->setTime(9, 0, 0)) {
            $status = 'late';
        }
        if ($checkOutAt < (clone $date)->setTime(18, 0, 0)) {
            $status = 'early_leave';
        }

        return [
            'employee_id' => \App\Models\Employee::factory(),
            'date' => $date,
            'check_in_at' => $checkInAt,
            'check_out_at' => $checkOutAt,
            'regular_hours' => $regularHours,
            'overtime_hours' => $overtimeHours,
            'total_hours' => $totalHours,
            'status' => $status,
        ];
    }
}
