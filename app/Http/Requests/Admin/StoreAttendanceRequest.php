<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Cho phép tất cả admin dùng (tuỳ bạn có middleware hay policy không)
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date_format:Y-m-d',
            'check_in' => 'required|date_format:H:i',
            'check_out' => 'required|date_format:H:i|after:check_in',
            'overtime_hours' => 'nullable|numeric|min:0',
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'Employee is required.',
            'employee_id.exists' => 'Selected employee does not exist.',
            'date.required' => 'Date is required.',
            'date.date_format' => 'Date must be in Y-m-d format.',
            'check_in.required' => 'Check-in time is required.',
            'check_out.after' => 'Check-out time must be after check-in.',
        ];
    }
}
