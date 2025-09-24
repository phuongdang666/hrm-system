<?php
/** @var \App\Models\Employee $employee */
?>
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Secomus</title>
</head>
<body>
    <h1>Welcome to Secomus, {{ $employee->name }}!</h1>
    <p>We are excited to have you on board.</p>
</body>
</html>