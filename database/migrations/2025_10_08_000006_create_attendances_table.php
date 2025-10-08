<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('check_in_at')->nullable();
            $table->time('check_out_at')->nullable();
            $table->decimal('regular_hours', 5, 2)->default(0);
            $table->decimal('overtime_hours', 5, 2)->default(0);
            $table->decimal('total_hours', 5, 2)->default(0);
            $table->enum('status', ['present', 'absent', 'late', 'early_leave'])->default('present');
            $table->timestamps();

            $table->index(['employee_id']);
            $table->index(['date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};