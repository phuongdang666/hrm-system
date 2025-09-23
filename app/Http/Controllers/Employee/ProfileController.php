<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;
use App\Http\Requests\Employee\ProfileRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Database\Eloquent\Builder;

class ProfileController extends Controller
{
    public function show()
    {
        /** @var \App\Models\Employee $employee */
        $employee = Auth::guard('employee')->user();

        // Clear remember token if it's causing issues
        if ($employee && $employee->getRememberToken()) {
            $employee->setRememberToken(null);
            $employee->save();
        }

        $employee->load('department', 'title');

        return Inertia::render('Employee/EmployeeProfile', [
            'employee' => array_merge($employee->toArray(), [
                'base_salary' => number_format($employee->base_salary, 0, ',', '.'),
                'join_date' => $employee->join_date?->format('Y-m-d'),
                'birth_date' => $employee->birth_date?->format('Y-m-d'),
            ]),
        ]);
    }

    public function update(Request $request)
    {
        /** @var \App\Models\Employee $employee */
        $employee = Auth::guard('employee')->user();

        // Ensure remember token is cleared
        $employee->setRememberToken(null);

        // Validate request
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email,' . $employee->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'avatar' => ['nullable', 'image', 'max:2048'], // 2MB max
        ]);

        // Handle password update
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar_path'] = Storage::url($path);

            // Delete old avatar if exists
            if ($employee->avatar_path) {
                $oldPath = str_replace('/storage/', '', $employee->avatar_path);
                if ($oldPath && Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
        }

        // Remove protected fields
        unset($data['department_id']);
        unset($data['title_id']);
        unset($data['base_salary']);
        unset($data['join_date']);

        $employee->fill($data);
        $employee->save();

        // // Clear remember me cookie
        // Cookie::queue(Cookie::forget(Auth::guard('employee')->getRecallerName()));
        // // Clear remember token to prevent issues
        // $employee->setRememberToken(null);
        // $employee->save();

        return redirect()->route('employee.profile')->with('success', 'Profile updated successfully.');
    }
}
