package com.soa.task_service.entity.dto;

import com.soa.task_service.entity.TaskStatus;

public record TaskRequestDTO(String description, String title, TaskStatus status) {
}
