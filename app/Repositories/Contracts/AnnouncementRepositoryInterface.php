<?php

namespace App\Repositories\Contracts;

interface AnnouncementRepositoryInterface
{
    public function getAll();
    public function findById($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
    public function getWithRecipients();
    public function createRecipients($announcementId, array $recipients);
    public function markAsRead($announcementId, $employeeId);
}