<x-mail::message>
# Payroll Statement

Dear {{ $employee->name }},

Your payroll for **{{ $month }}/{{ $year }}** has been generated.

<x-mail::panel>
## Salary Details

**Basic Salary:** ${{ number_format($payroll->basic_salary, 2) }}  
**Allowances:** ${{ number_format($payroll->allowances, 2) }}  
**Overtime Pay:** ${{ number_format($payroll->overtime_pay, 2) }}  
**Deductions:** ${{ number_format($payroll->deductions, 2) }}  

-----------------------------------
**Total Net Amount:** ${{ $totalAmount }}
</x-mail::panel>

@if($payroll->note)
**Note:**  
{{ $payroll->note }}
@endif

For more details about your payroll or if you have any questions, please contact the HR department.


Thanks,<br>
{{ config('app.name') }}
</x-mail::message>