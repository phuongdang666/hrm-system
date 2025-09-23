<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\ProfileRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Inertia\Inertia;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    /**
     * Display employee profile.
     */
    public function show()
    {
        $employee = $this->getAuthEmployee();
        $employee->load(['department', 'title']);

        return Inertia::render('Employee/EmployeeProfile', [
            'employee' => array_merge($employee->toArray(), [
                'formatted_salary' => number_format($employee->base_salary, 0, ',', '.'),
                'base_salary' => $employee->base_salary,
                'join_date' => $employee->join_date?->format('Y-m-d'),
                'birth_date' => $employee->birth_date?->format('Y-m-d'),
                'avatar_url' => $employee->avatar ? URL::to('storage/' . $employee->avatar) : null,
            ]),
        ]);
    }

    /**
     * Update employee profile information.
     */
    public function update(ProfileRequest $request)
    {
        $employee = $this->getAuthEmployee();
        $data = $request->validated();

        // Handle password update
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // Protect sensitive fields
        $this->removeProtectedFields($data);

        // Update employee
        $employee->update($data);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Update employee avatar.
     */
    public function updateAvatar(Request $request)
    {
        try {
            Log::info('Avatar upload request received', [
                'files' => $request->allFiles(),
                'hasFile' => $request->hasFile('avatar'),
                'content-type' => $request->header('Content-Type'),
                'request_content' => $request->all()
            ]);

            $validator = Validator::make($request->all(), [
                'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,gif', 'max:2048']
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            if (!$request->hasFile('avatar') || !$request->file('avatar')->isValid()) {
                return back()->withErrors(['avatar' => 'No valid file was uploaded.']);
            }

            $employee = $this->getAuthEmployee();
            $file = $request->file('avatar');

            if (!$file->isValid()) {
                return back()->withErrors(['avatar' => 'The uploaded file is not valid.']);
            }

            // Generate unique filename
            $filename = sprintf(
                'avatar-%s-%s.%s',
                $employee->id,
                Str::random(10),
                $file->getClientOriginalExtension()
            );

            // Prepare storage path
            $path = 'avatars/' . $filename;

            // Ensure avatars directory exists
            if (!Storage::disk('public')->exists('avatars')) {
                Storage::disk('public')->makeDirectory('avatars');
            }

            // Create temp directory if it doesn't exist
            $tempPath = storage_path('app/temp');
            if (!file_exists($tempPath)) {
                mkdir($tempPath, 0755, true);
            }

            // Process image in temp location first
            $manager = ImageManager::gd();
            $processedImage = $manager->read($file->getRealPath())
                ->cover(400, 400)
                ->toJpeg(80);

            // Save to temp location
            $tempFile = $tempPath . '/' . $filename;
            $processedImage->save($tempFile);

            // Verify the processed image
            if (!file_exists($tempFile) || filesize($tempFile) === 0) {
                return back()->withErrors(['avatar' => 'Failed to process the image.']);
            }

            // Move to final location
            Storage::disk('public')->put($path, file_get_contents($tempFile));

            // Clean up temp file
            @unlink($tempFile);

            // Delete old avatar if exists
            if ($employee->avatar) {
                Storage::disk('public')->delete($employee->avatar);
            }

            // Update employee record
            $employee->update(['avatar' => $path]);

            return back()->with('success', 'Avatar updated successfully.');
        } catch (\Exception $e) {
            report($e); // Log the error
            return back()->withErrors(['avatar' => 'Failed to update avatar. Please try again.']);
        }
    }

    /**
     * Get authenticated employee.
     */
    protected function getAuthEmployee(): Employee
    {
        return Auth::guard('employee')->user();
    }

    /**
     * Remove protected fields from data array.
     */
    protected function removeProtectedFields(array &$data): void
    {
        $protectedFields = [
            'department_id',
            'title_id',
            'base_salary',
            'join_date',
            'employee_code',
            'status',
        ];

        foreach ($protectedFields as $field) {
            unset($data[$field]);
        }
    }
}
