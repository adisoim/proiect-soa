package com.soa.task_service.mapper;

import com.soa.task_service.entity.Task;
import com.soa.task_service.entity.dto.TaskRequestDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TaskMapper {
    @Mapping(target = "status", ignore = true)
    Task taskRequestDTOToTask(TaskRequestDTO taskRequestDTO);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateTaskFromDto(TaskRequestDTO dto, @MappingTarget Task existingTask);
}
