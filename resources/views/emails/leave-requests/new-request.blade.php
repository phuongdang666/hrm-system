<x-mail::message>
# New Leave Request

{{ $leaveRequest->employee->name }} has submitted a leave request.

**Request Details:**
- Type: {{ $leaveRequest->type }}
- Start Date: {{ $leaveRequest->start_date }}
- End Date: {{ $leaveRequest->end_date }}
- Days: {{ $leaveRequest->days }}
- Reason: {{ $leaveRequest->reason }}

<x-mail::button :url="$url">
View Request
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>