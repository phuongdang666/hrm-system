<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->onDelete('cascade');
            $table->string('month', 7); // Format: YYYY-MM
            $table->decimal('base_salary', 10, 2);
            $table->decimal('total_worked_hours', 5, 2);
            $table->decimal('total_overtime_hours', 5, 2);
            $table->unsignedInteger('unpaid_leave_days');
            $table->decimal('net_salary', 10, 2);
            $table->timestamps();

            $table->index(['employee_id']);
            $table->index(['month']);
            $table->unique(['employee_id', 'month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};