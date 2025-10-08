<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('title_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('base_salary', 10, 2)->default(0);
            $table->date('join_date');
            $table->date('birth_date')->nullable();
            $table->date('contract_end_at')->nullable();
            $table->string('status')->default('active');
            $table->string('avatar')->nullable();
            $table->json('meta')->nullable();
            $table->enum('role', ['staff', 'manager'])->default('staff');
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['department_id']);
            $table->index(['title_id']);
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};