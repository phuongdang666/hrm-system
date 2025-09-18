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
        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->constrained()->restrictOnDelete();

            $table->decimal('base_salary', 14, 2)->default(0);
            $table->decimal('working_hours', 8, 2)->default(0);
            $table->decimal('ot_hours', 8, 2)->default(0);
            $table->decimal('ot_rate', 14, 2)->default(0); 
            $table->decimal('unpaid_leave_hours', 8, 2)->default(0);
            $table->decimal('hourly_rate', 14, 2)->default(0); 
            $table->decimal('final_amount', 14, 2);

            $table->index('payroll_id');
 

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
    }
};
