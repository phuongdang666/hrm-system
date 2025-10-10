<?php

namespace App\Http\Requests\Employee;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization is handled by middleware
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^([0-9\s\-\+\(\)]*)$/'
            ],
            'address' => ['nullable', 'string', 'max:500'],
            'password' => [
                'nullable',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
                'confirmed'
            ],
        ];
    }
    
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your full name.',
            'name.max' => 'Full name must not exceed 255 characters.',
            'phone.max' => 'Phone number must not exceed 20 characters.',
            'phone.regex' => 'Phone number format is invalid.',
            'address.max' => 'Address must not exceed 500 characters.',
            'password.string' => 'Password must be a valid string.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}
