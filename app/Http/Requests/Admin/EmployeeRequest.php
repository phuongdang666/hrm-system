<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Admin middleware protects routes, allow here
        return true;
    }

    public function rules(): array
    {
        $employeeId = $this->route('employee');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email' . ($employeeId ? ",$employeeId" : '')],
            'password' => [$employeeId ? 'nullable' : 'required', 'string', 'min:6'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'title_id' => ['nullable', 'exists:titles,id'],
            'base_salary' => ['nullable', 'numeric'],
            'status' => ['nullable', 'in:active,inactive,on_probation,terminated'],
        ];
    }
}
