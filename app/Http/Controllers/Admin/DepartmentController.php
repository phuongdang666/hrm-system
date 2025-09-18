<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Department;
use App\Models\Employee;

class DepartmentController extends Controller
{
    public function index()
    {
        $departments = Department::with('employees')->paginate(15);
        return Inertia::render('Admin/DepartmentManage', ['departments' => $departments]);
    }

    public function create()
    {
        return Inertia::render('Admin/Departments/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Department::create($validated);
        return redirect()->route('admin.departments.index');
    }

    public function show($id)
    {
        $department = Department::with('employees')->findOrFail($id);
        return Inertia::render('Admin/Departments/Show', ['department' => $department]);
    }

    public function edit($id)
    {
        $department = Department::findOrFail($id);
        return Inertia::render('Admin/Departments/Edit', ['department' => $department]);
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'manager_id' => 'nullable|exists:employees,id',
        ]);

        $department->update($validated);
        return redirect()->route('admin.departments.index');
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return redirect()->route('admin.departments.index');
    }

    // Assign manager to department
    public function assignManager(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        $validated = $request->validate([
            'manager_id' => 'nullable|exists:employees,id',
        ]);

        $department->update(['manager_id' => $validated['manager_id'] ?? null]);
        return redirect()->route('admin.departments.show', $department->id);
    }
}
