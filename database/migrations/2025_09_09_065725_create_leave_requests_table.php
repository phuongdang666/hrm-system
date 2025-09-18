<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->restrictOnDelete();
            $table->string('type'); // annual, sick, unpaid, ...  ?enum
            $table->date('start_date');
            $table->date('end_date'); // can check end_date >= start_date khong
            $table->decimal('days', 4, 1)->default(0);
            $table->text('reason');
            $table->string('status')->default('pending'); // pending|approved|rejected  ?enum
            $table->foreignId('approver_manager_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('approver_hr_id')->nullable()->constrained('employees')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['employee_id', 'status']);
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
