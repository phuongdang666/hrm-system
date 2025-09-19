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

            $table->foreignId('created_by')->nullable()->constrained('employees')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('employees')->nullOnDelete();

            $table->timestamps();

            $table->unique(['employee_id', 'date']);
            $table->index(['date']);
            $table->index(['status']);
            $table->index(['day_type']);
            $table->softDeletes();
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
