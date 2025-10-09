<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DepartmentRequest;
use App\Http\Requests\Admin\StoreDepartmentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Department;
use App\Models\Employee;
use App\Services\DepartmentService;
use App\Http\Requests\Admin\AddEmployeeToDepartmentRequest;
use App\Http\Requests\Admin\SetDepartmentManagerRequest;

class DepartmentController extends Controller
{
    protected $departmentService;

    public function __construct(DepartmentService $departmentService)
    {
        $this->departmentService = $departmentService;
    }

    public function index(Request $request)
    {
        $query = Department::query()
            ->with(['manager:id,name,role', 'employees.title:id,name'])
            ->when($request->input('name'), function ($query, $name) {
                $query->where('name', 'like', "%{$name}%");
            })
            ->when($request->input('manager_id'), function ($query, $managerId) {
                $query->where('manager_id', $managerId);
            });

        $departments = $query->latest()->paginate(10)->withQueryString();
        $employees = Employee::whereNull('department_id')
            ->with('title:id,name')
            ->get(['id', 'name', 'email', 'title_id', 'role']);

        return Inertia::render('Admin/DepartmentManage', [
            'departments' => $departments,
            'availableEmployees' => $employees,
            'filters' => $request->only(['name', 'manager_id']),
        ]);
    }

    public function show(Department $department)
    {
        $departmentDetails = $this->departmentService->getDepartmentDetails($department);
        
        return Inertia::render('Admin/DepartmentShow', [
            'department' => $departmentDetails
        ]);
    }

    public function edit(Department $department)
    {
        $department = $department->load(['manager', 'employees']);
        $availableEmployees = Employee::whereNull('department_id')->get();
        
        return Inertia::render('Admin/DepartmentEdit', [
            'department' => $department,
            'availableEmployees' => $availableEmployees
        ]);
    }

    public function destroy(Department $department)
    {
        $this->departmentService->deleteDepartment($department);

        return redirect()->route('admin.departments.index')
            ->with('success', 'Department deleted successfully.');
    }

    public function addEmployee(Department $department, AddEmployeeToDepartmentRequest $request)
    {
        $employee = Employee::findOrFail($request->employee_id);
        $this->departmentService->addEmployee($department, $employee);

        return redirect()->back()->with('success', 'Employee added to department successfully.');
    }

    public function removeEmployee(Department $department, Employee $employee)
    {
        if ($employee->department_id !== $department->id) {
            return redirect()->back()->with('error', 'Employee does not belong to this department.');
        }

        $this->departmentService->removeEmployee($employee);

        return redirect()->back()->with('success', 'Employee removed from department successfully.');
    }

    public function setManager(Department $department, SetDepartmentManagerRequest $request)
    {
        $employee = Employee::findOrFail($request->employee_id);
        $this->departmentService->setManager($department, $employee);

        return redirect()->back()->with('success', 'Department manager updated successfully.');
    }

    public function store(StoreDepartmentRequest $request)
    {
        $department = $this->departmentService->createDepartment($request->validated());

        return redirect()->back()->with('success', 'Department created successfully.');
    }
}
