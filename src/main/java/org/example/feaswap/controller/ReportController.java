package org.example.feaswap.controller;

import org.example.feaswap.dto.ReportRequestDto;
import org.example.feaswap.dto.ReportResponseDto;
import org.example.feaswap.dto.ReportStatusUpdateDto;
import org.example.feaswap.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponseDto> create(@RequestBody ReportRequestDto dto) {
        ReportResponseDto created = reportService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponseDto> getOne(@PathVariable Integer id) {
        return ResponseEntity.ok(reportService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ReportResponseDto>> getAll() {
        return ResponseEntity.ok(reportService.getAll());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReportResponseDto> updateStatus(
            @PathVariable Integer id,
            @RequestBody ReportStatusUpdateDto dto) {
        return ResponseEntity.ok(reportService.updateStatus(id, dto));
    }

    @PatchMapping("/{reportId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateReportStatus(
            @PathVariable Integer reportId,
            @RequestBody ReportStatusUpdateDto dto
    ) {
        reportService.updateReportStatus(reportId, dto.getStatus());
        return ResponseEntity.ok().build();
    }

}
