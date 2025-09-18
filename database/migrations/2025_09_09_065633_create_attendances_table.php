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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->restrictOnDelete();
            $table->date('date');
            $table->timestamp('check_in_at')->nullable();
            $table->timestamp('check_out_at')->nullable();
            // Thông tin giờ làm
            $table->decimal('regular_hours', 5, 2)->default(0)->unsigned();
            $table->decimal('overtime_hours', 5, 2)->default(0)->unsigned();
            $table->decimal('total_hours', 5, 2)->default(0)->unsigned();
            // Phân loại
            $table->enum('day_type', ['weekday', 'weekend', 'holiday'])->default('weekday');
            $table->enum('status', ['present', 'absent', 'late', 'early_leave', 'half_day', 'work_from_home'])->default('present');
            // Approval workflow
            $table->foreignId('approved_by')->nullable()->constrained('employees')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            // Audit trail
            $table->foreignId('created_by')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('employees')->nullOnDelete();

            $table->timestamps();

            $table->unique(['employee_id', 'date']);
            $table->index(['date']);
            $table->index(['status']);
            $table->index(['day_type']);

            // $table->check('check_out_at IS NULL OR check_out_at > check_in_at');
            // $table->check('total_hours >= 0 AND total_hours <= 24');
            // $table->check('regular_hours >= 0 AND regular_hours <= 24');
            // $table->check('overtime_hours >= 0 AND overtime_hours <= 24');
            // $table->check('total_hours = regular_hours + overtime_hours');

            // // Status logic constraints  
            // $table->check('(status = "absent" AND check_in_at IS NULL) OR status != "absent"');
            // $table->check('(approved_at IS NULL AND approval_status = "pending") OR (approved_at IS NOT NULL AND approval_status != "pending")');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
