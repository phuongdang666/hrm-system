<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DepartmentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Department;
use App\Models\Employee;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Department::query()
            ->with(['manager:id,name', 'employees.title:id,name'])
            ->when($request->input('name'), function ($query, $name) {
                $query->where('name', 'like', "%{$name}%");
            })
            ->when($request->input('manager_id'), function ($query, $managerId) {
                $query->where('manager_id', $managerId);
            });

        $departments = $query->latest()->paginate(10)->withQueryString();
        $employees = Employee::with('title:id,name')->get(['id', 'name', 'email', 'title_id']);

        return Inertia::render('Admin/DepartmentManage', [
            'departments' => $departments,
            'employees' => $employees,
            'filters' => $request->only(['name', 'manager_id']),
        ]);
    }

    public function store(DepartmentRequest $request)
    {
        $department = Department::create($request->validated());

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department created successfully.');
    }

    public function update(DepartmentRequest $request, Department $department)
    {
        $department->update($request->validated());

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        // Detach all employees from this department
        $department->employees()->update(['department_id' => null]);

        $department->delete();

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department deleted successfully.');
    }

    public function addEmployee(Request $request, Department $department)
    {
        $validated = $request->validate([
            'employee_ids' => 'required|array',
            'employee_ids.*' => 'exists:employees,id'
        ]);

        // Update department_id for all selected employees
        Employee::whereIn('id', $validated['employee_ids'])
            ->update(['department_id' => $department->id]);

        return back()->with('success', 'Employees assigned successfully.');
    }

    public function removeEmployee(Department $department, Employee $employee)
    {
        if ($employee->department_id === $department->id) {
            $employee->update(['department_id' => null]);
            return back()->with('success', 'Employee removed from department.');
        }

        return back()->with('error', 'Employee is not in this department.');
    }
}
