<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmployeeLoginController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('AuthPages/SignInEmployee');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::guard('employee')->attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/employee/dashboard');
        }

        return back()->withErrors([
            'email' => 'Email hoặc mật khẩu không đúng.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('employee')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('employee.login');
    }
    public function showSignUpForm()
    {
        return Inertia::render('AuthPages/SignUpEmployee');
    }
    public function signup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:employees',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $employee = \App\Models\Employee::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        Auth::guard('employee')->login($employee);

        return redirect()->intended('/employee/dashboard');
    }       
}
