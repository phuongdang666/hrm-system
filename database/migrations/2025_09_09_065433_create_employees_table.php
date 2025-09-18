<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone')->nullable()->unique();
            $table->string('address')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
            $table->unsignedBigInteger('title_id')->nullable();
            $table->foreign('title_id')->references('id')->on('titles')->nullOnDelete();
            $table->decimal('base_salary', 14, 2)->default(0);
            $table->date('join_date')->nullable();
            $table->date('birth_date')->nullable();
            $table->date('contract_end_at')->nullable();
            $table->enum('status', ['active', 'inactive', 'on_probation', 'terminated'])->default('active');
            $table->string('avatar_path')->nullable();
            $table->json('meta')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['department_id', 'status']);
            $table->index(['title_id']);
            $table->index(['email']);
            $table->index(['code']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('employees');
    }
};
