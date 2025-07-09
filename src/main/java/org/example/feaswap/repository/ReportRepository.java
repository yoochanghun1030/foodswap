package org.example.feaswap.repository;

import org.example.feaswap.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findByReporter_UserId(Integer reporterId);
    List<Report> findByReportedUser_UserId(Integer reportedUserId);
    List<Report> findByReportedMessage_MessageId(Integer messageId);
}
