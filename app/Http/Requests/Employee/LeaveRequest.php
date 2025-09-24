<?php
namespace App\Http\Requests\Employee;
use Illuminate\Foundation\Http\FormRequest;
class LeaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware
    }

    public function rules(): array
    {
        return [
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'max:1000'],
            'type' => ['required', 'string', 'max:100'],
        ];
    }
}