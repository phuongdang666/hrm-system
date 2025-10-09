<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:departments,name']
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The department name is required.',
            'name.max' => 'The department name must not exceed 255 characters.',
            'name.unique' => 'This department name already exists.'
        ];
    }
}