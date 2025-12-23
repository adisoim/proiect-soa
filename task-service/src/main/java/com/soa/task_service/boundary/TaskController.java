package com.soa.task_service.boundary;

import com.soa.task_service.control.TaskRepository;
import com.soa.task_service.entity.Task;
import com.soa.task_service.entity.TaskStatus;
import com.soa.task_service.entity.dto.TaskRequestDTO;
import com.soa.task_service.mapper.TaskMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    private final TaskRepository repository;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final TaskMapper taskMapper;
    private final ObjectMapper objectMapper;

    public TaskController(TaskRepository repository, KafkaTemplate<String, String> kafkaTemplate, TaskMapper taskMapper, ObjectMapper objectMapper) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
        this.taskMapper = taskMapper;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public Task createTask(@RequestBody TaskRequestDTO taskRequestDTO) {
        String currentUser = getCurrentUser();
        Task task = taskMapper.taskRequestDTOToTask(taskRequestDTO);
        task.setUsername(currentUser);
        task.setStatus(TaskStatus.PENDING);

        Task savedTask = repository.save(task);

        String jsonMessage = objectMapper.writeValueAsString(savedTask);

        kafkaTemplate.send("tasks", jsonMessage);

        return savedTask;
    }

    @GetMapping
    public List<Task> getMyTasks() {
        return repository.findByUsername(getCurrentUser());
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody TaskRequestDTO taskRequestDTO) {
        String currentUser = getCurrentUser();

        Task existingTask = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (!currentUser.equals(existingTask.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can't update this task!");
        }

        taskMapper.updateTaskFromDto(taskRequestDTO, existingTask);

        Task savedTask = repository.save(existingTask);

        if (TaskStatus.DONE.equals(savedTask.getStatus())) {
            String jsonMessage = objectMapper.writeValueAsString(savedTask);
            kafkaTemplate.send("tasks", jsonMessage);

            System.out.println("task done, notification sent to kafka: " + savedTask.getId());
        }

        return savedTask;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        String currentUser = getCurrentUser();
        Task existingTask = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        if (!currentUser.equals(existingTask.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can't delete this task!");
        }

        repository.delete(existingTask);
        return ResponseEntity.noContent().build();
    }

    private String getCurrentUser() {
        return Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
    }
}
