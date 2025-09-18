<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\Employee;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::query()->with('employee');

        if ($request->filled('from')) {
            $query->whereDate('date', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('date', '<=', $request->input('to'));
        }

        $attendances = $query->paginate(25)->appends($request->query());

        return Inertia::render('Admin/Attendance', ['attendances' => $attendances]);
    }

    public function exportCsv(Request $request)
    {
        $response = new StreamedResponse(function () use ($request) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['employee', 'date', 'checkin_at', 'checkout_at', 'status']);

            $query = Attendance::with('employee');
            if ($request->filled('from')) {
                $query->whereDate('date', '>=', $request->input('from'));
            }
            if ($request->filled('to')) {
                $query->whereDate('date', '<=', $request->input('to'));
            }

            foreach ($query->cursor() as $row) {
                fputcsv($handle, [
                    $row->employee->name ?? '',
                    $row->date,
                    $row->checkin_at,
                    $row->checkout_at,
                    $row->status,
                ]);
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="attendances.csv"');
        return $response;
    }

    public function exportPdf(Request $request)
    {
        // PDF exporting is project-specific; provide a stub that returns a message or integrate a PDF library.
        return response()->json(['message' => 'PDF export not implemented.']);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        $validated = $request->validate([
            'checkin_at' => 'nullable|date_format:H:i:s',
            'checkout_at' => 'nullable|date_format:H:i:s',
            'status' => 'nullable|string',
        ]);

        $attendance->update($validated);
        return redirect()->route('admin.attendances.index');
    }
}
