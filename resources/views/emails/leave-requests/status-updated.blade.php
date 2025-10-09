<x-mail::message>
# Leave Request {{ ucfirst($leaveRequest->status) }}

Dear {{ $leaveRequest->employee->name }},

Your leave request has been **{{ $leaveRequest->status }}** by {{ $manager->name }}.

**Request Details:**
- Type: {{ $leaveRequest->type }}
- Start Date: {{ $leaveRequest->start_date }}
- End Date: {{ $leaveRequest->end_date }}
- Days: {{ $leaveRequest->days }}
- Reason: {{ $leaveRequest->reason }}

<x-mail::button :url="$url" :color="$leaveRequest->status === 'approved' ? 'success' : 'error'">
View Details
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>