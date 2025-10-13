<?php

namespace App\Repositories;

use App\Models\Announcement;
use App\Models\AnnouncementRecipient;
use App\Repositories\Contracts\AnnouncementRepositoryInterface;
use Illuminate\Support\Facades\DB;

class AnnouncementRepository implements AnnouncementRepositoryInterface
{
    protected $model;
    protected $recipientModel;

    public function __construct(Announcement $announcement, AnnouncementRecipient $recipient)
    {
        $this->model = $announcement;
        $this->recipientModel = $recipient;
    }

    public function getAll()
    {
        return $this->model->orderBy('created_at', 'desc')->get();
    }

    public function findById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $announcement = $this->model->create([
                'title' => $data['title'],
                'body' => $data['body'],
                'sent_by' => auth()->id()
            ]);

            if (!empty($data['departments'])) {
                $this->createDepartmentRecipients($announcement->id, $data['departments']);
            }

            if (!empty($data['titles'])) {
                $this->createTitleRecipients($announcement->id, $data['titles']);
            }

            if (!empty($data['employees'])) {
                $this->createEmployeeRecipients($announcement->id, $data['employees']);
            }

            return $announcement;
        });
    }

    public function update($id, array $data)
    {
        $announcement = $this->findById($id);
        $announcement->update($data);
        return $announcement;
    }

    public function delete($id)
    {
        $announcement = $this->findById($id);
        return $announcement->delete();
    }

    public function getWithRecipients()
    {
        return $this->model->withCount([
            'recipients as read_count' => function ($q) {
                $q->whereNotNull('read_at');
            },
            'recipients as total_recipients'
        ])->orderBy('created_at', 'desc')->get();
    }

    public function createRecipients($announcementId, array $recipients)
    {
        $recipientData = collect($recipients)->map(function ($employeeId) use ($announcementId) {
            return [
                'announcement_id' => $announcementId,
                'employee_id' => $employeeId,
                'created_at' => now(),
                'updated_at' => now()
            ];
        })->toArray();

        return $this->recipientModel->insert($recipientData);
    }

    public function markAsRead($announcementId, $employeeId)
    {
        return $this->recipientModel
            ->where('announcement_id', $announcementId)
            ->where('employee_id', $employeeId)
            ->update(['read_at' => now()]);
    }

    protected function createDepartmentRecipients($announcementId, array $departmentIds)
    {
        $employees = DB::table('employees')
            ->whereIn('department_id', $departmentIds)
            ->pluck('id')
            ->toArray();

        if (!empty($employees)) {
            $this->createRecipients($announcementId, $employees);
        }
    }

    protected function createTitleRecipients($announcementId, array $titleIds)
    {
        $employees = DB::table('employees')
            ->whereIn('title_id', $titleIds)
            ->pluck('id')
            ->toArray();

        if (!empty($employees)) {
            $this->createRecipients($announcementId, $employees);
        }
    }

    protected function createEmployeeRecipients($announcementId, array $employeeIds)
    {
        $this->createRecipients($announcementId, $employeeIds);
    }
}