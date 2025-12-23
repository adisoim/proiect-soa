package com.soa.task_service.orchestrator;

import com.soa.task_service.config.RabbitConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class TaskOrchestrator {
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    public TaskOrchestrator(RabbitTemplate rabbitTemplate, ObjectMapper objectMapper) {
        this.rabbitTemplate = rabbitTemplate;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "tasks", groupId = "orchestrator-group")
    public void processTaskEvent(String message) {
        System.out.println("kafka: " + message);

        try {
            JsonNode jsonPayload = objectMapper.readTree(message);

            long id = jsonPayload.get("id").asLong();
            String user = jsonPayload.get("username").asText();
            String title = jsonPayload.get("title").asText();

            rabbitTemplate.convertAndSend(RabbitConfig.EMAIL_QUEUE, message);

            System.out.println("sent to rabbitmq id: " + id);

        } catch (Exception e) {
            System.err.println("orchestrator error: " + e.getMessage());
        }
    }
}
