<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
            Schema::create('announcements', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('body');
                $table->foreignId('sender_id')->nullable()->constrained('employees')->nullOnDelete();
                $table->timestamp('sent_at')->nullable();
                $table->json('meta')->nullable();
                $table->timestamps();

                $table->index(['sender_id']);
                
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};