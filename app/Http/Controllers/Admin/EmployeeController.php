<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Title;
use App\Http\Requests\Admin\EmployeeRequest;
use App\Events\NewEmployee;

class EmployeeController extends Controller
{
    public function index()
    {
        $query = Employee::with(['department', 'title']);

        $filters = request()->only(['code', 'name', 'department', 'title', 'status']);

        if (!empty($filters['code'])) {
            $query->where('code', 'like', "%{$filters['code']}%");
        }

        if (!empty($filters['name'])) {
            $query->where('name', 'like', "%{$filters['name']}%");
        }

        if (!empty($filters['department'])) {
            $query->where('department_id', $filters['department']);
        }

        if (!empty($filters['title'])) {
            $query->where('title_id', $filters['title']);
        }

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        $employees = $query->orderBy('name')->paginate(15)->withQueryString();

        $departments = Department::orderBy('name')->get(['id', 'name']);
        $titles = Title::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/EmployeeManage', [
            'employees' => $employees,
            'filters' => $filters,
            'departments' => $departments,
            'titles' => $titles,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Employees/Create');
    }

    public function store(EmployeeRequest $request)
    {
        $data = $request->validated();

        // Hash password if it's provided
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        $employee = Employee::create($data);

        // Dispatch the NewEmployee event
        NewEmployee::dispatch($employee->id);

        return redirect()->route('admin.employees.index');
    }

    public function show($id)
    {
        $employee = Employee::findOrFail($id);
        return Inertia::render('Admin/Employees/Show', ['employee' => $employee]);
    }

    public function edit($id)
    {
        $employee = Employee::findOrFail($id);
        return Inertia::render('Admin/Employees/Edit', ['employee' => $employee]);
    }

    public function update(EmployeeRequest $request, $id)
    {
        $data = $request->validated();
        $employee = Employee::findOrFail($id);

        // Only hash password if it's provided in the request
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            // Remove password field if not provided to prevent overwriting with null
            unset($data['password']);
        }

        $employee->update($data);
        return redirect()->route('admin.employees.index');
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();
        return redirect()->route('admin.employees.index');
    }
}
