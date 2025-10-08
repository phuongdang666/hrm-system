<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
            Schema::create('announcement_recipients', function (Blueprint $table) {
                $table->id();
                // use unsignedBigInteger for announcement_id to avoid FK errors during partial migrations
                $table->unsignedBigInteger('announcement_id');
                $table->foreignId('employee_id')->nullable()->constrained('employees')->nullOnDelete();
                $table->foreignId('department_id')->nullable()->constrained('departments')->nullOnDelete();
                $table->foreignId('title_id')->nullable()->constrained('titles')->nullOnDelete();
                $table->string('email')->nullable();
                $table->timestamp('sent_at')->nullable();
                $table->timestamp('read_at')->nullable();
                $table->enum('status', ['pending', 'sent', 'failed'])->default('pending');
                $table->timestamps();
                
                $table->index(['announcement_id']);
                $table->index(['employee_id']);
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcement_recipients');
    }
};