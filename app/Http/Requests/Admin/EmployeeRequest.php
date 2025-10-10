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
            'code' => ['required', 'string', 'max:50', 'unique:employees,code' . ($employeeId ? ",$employeeId" : '')],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email' . ($employeeId ? ",$employeeId" : '')],
            'password' => [$employeeId ? 'nullable' : 'required', 'string', 'min:6'],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^([0-9\s\-\+\(\)]*)$/'
            ],
            'address' => ['nullable', 'string', 'max:500'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'title_id' => ['nullable', 'exists:titles,id'],
            'base_salary' => ['nullable', 'numeric'],
            'join_date' => ['required', 'date'],
            'birth_date' => ['nullable', 'date'],
            'contract_end_at' => ['nullable', 'date', 'after_or_equal:join_date'],
            'status' => ['nullable', 'in:active,inactive,on_probation,terminated'],
        ];
    }
}
