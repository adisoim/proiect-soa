package com.soa.notification_service;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class NotificationListener {
    private final RestTemplate restTemplate = new RestTemplate();

    private final String OPENFAAS_URL = "http://email-function:8080";

    @RabbitListener(queues = "email-jobs")
    public void processEmailJob(String jsonMessage) {
        System.out.println("rabbit message: " + jsonMessage);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(jsonMessage, headers);

            System.out.println("calling openfaas method:");
            String emailHtml = restTemplate.postForObject(OPENFAAS_URL, request, String.class);

            System.out.println(" =================================================== ");
            System.out.println("email generated and sent successfully: ");
            System.out.println(emailHtml);
            System.out.println(" =================================================== ");

        } catch (Exception e) {
            System.err.println("error calling the openfaas method: " + e.getMessage());
        }
    }
}
