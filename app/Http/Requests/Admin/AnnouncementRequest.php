<?php
namespace App\Http\Requests\Admin;
use Illuminate\Foundation\Http\FormRequest;
class AnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware
    }   
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'departments' => 'array',
            'departments.*' => 'integer|exists:departments,id',
            'titles' => 'array',
            'titles.*' => 'integer|exists:titles,id',
            'employees' => 'array',
            'employees.*' => 'integer|exists:employees,id',
        ];
    }
}
