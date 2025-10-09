<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EmployeeFactory extends Factory
{
    public function definition()
    {
        $name = $this->faker->name();
        return [
            'code' => 'EMP' . $this->faker->unique()->numerify('####'),
            'name' => $name,
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'department_id' => null,
            'title_id' => null,
            'base_salary' => $this->faker->numberBetween(3000000, 50000000),
            'join_date' => $this->faker->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'birth_date' => $this->faker->dateTimeBetween('-50 years', '-20 years')->format('Y-m-d'),
            'status' => 'active',
            'avatar' => null,
            'meta' => null,
        ];
    }
}
