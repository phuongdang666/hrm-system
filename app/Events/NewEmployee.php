<?php
namespace App\Events;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;  

class NewEmployee
{
    use Dispatchable, SerializesModels;

    public $employeeId;

    // Truyền dữ liệu khi dispatch
    public function __construct(int $employeeId)
    {
        $this->employeeId = $employeeId;
    }
}