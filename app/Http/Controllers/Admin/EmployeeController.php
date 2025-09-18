<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Employee;
use App\Http\Requests\Admin\EmployeeRequest;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::paginate(15);
        return Inertia::render('Admin/EmployeeManage', [
            'employees' => $employees,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Employees/Create');
    }

    public function store(EmployeeRequest $request)
    {
        $data = $request->validated();
        Employee::create($data);
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
        $employee = Employee::findOrFail($id);
        $employee->update($request->validated());
        return redirect()->route('admin.employees.index');
    }

    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);
        $employee->delete();
        return redirect()->route('admin.employees.index');
    }
}
