package org.example.feaswap.service;

import org.example.feaswap.dto.ReportRequestDto;
import org.example.feaswap.dto.ReportResponseDto;
import org.example.feaswap.dto.ReportStatusUpdateDto;
import org.example.feaswap.entity.Message;
import org.example.feaswap.entity.Report;
import org.example.feaswap.entity.ReportStatus;
import org.example.feaswap.entity.User;
import org.example.feaswap.repository.MessageRepository;
import org.example.feaswap.repository.ReportRepository;
import org.example.feaswap.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @Transactional
    public ReportResponseDto create(ReportRequestDto dto) {
        User reporter = userRepository.findById(dto.getReporterId())
                .orElseThrow(() -> new RuntimeException("User not found: " + dto.getReporterId()));
        User reportedUser = null;
        if (dto.getReportedUserId() != null) {
            reportedUser = userRepository.findById(dto.getReportedUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + dto.getReportedUserId()));
        }
        Message reportedMessage = null;
        if (dto.getReportedMessageId() != null) {
            reportedMessage = messageRepository.findById(dto.getReportedMessageId())
                    .orElseThrow(() -> new RuntimeException("Message not found: " + dto.getReportedMessageId()));
        }

        Report report = Report.builder()
                .reporter(reporter)
                .reportedUser(reportedUser)
                .reportedMessage(reportedMessage)
                .reason(dto.getReason())
                .status(ReportStatus.OPEN)
                .build();

        Report saved = reportRepository.save(report);
        return ReportResponseDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public ReportResponseDto getById(Integer id) {
        return reportRepository.findById(id)
                .map(ReportResponseDto::fromEntity)
                .orElseThrow(() -> new RuntimeException("Report not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<ReportResponseDto> getAll() {
        return reportRepository.findAll().stream()
                .map(ReportResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportResponseDto updateStatus(Integer id, ReportStatusUpdateDto dto) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found: " + id));
        report.setStatus(dto.getStatus());
        report.setResolvedAt(LocalDateTime.now());
        Report updated = reportRepository.save(report);
        return ReportResponseDto.fromEntity(updated);
    }

    @Transactional
    public void updateReportStatus(Integer reportId, ReportStatus newStatus) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(newStatus);
        report.setResolvedAt(LocalDateTime.now());
    }

}
