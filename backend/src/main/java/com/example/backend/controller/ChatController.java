package com.example.backend.controller;

import com.example.backend.dto.ChatMessageDto;
import com.example.backend.dto.TaskDto;
import com.example.backend.service.ChatService;
import com.example.backend.service.auth.CustomUserDetails;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/chat")
@Slf4j
@AllArgsConstructor
public class ChatController {

    //@Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    private final ChatService chatService;

    @MessageMapping("chat.sendMessage")
    //@SendTo("/project/public")
    public void sendMessage(ChatMessageDto chatMessage, Principal principal) {
        CustomUserDetails user = (CustomUserDetails) ((UsernamePasswordAuthenticationToken) principal).getPrincipal();
        chatMessage.setSender(user.getId());
        chatMessage.setFullName(user.getFullName());
        chatMessage.setSent(LocalDateTime.now());

        try {
            ChatMessageDto message = chatService.save(chatMessage);
            simpMessagingTemplate.convertAndSend(
                    "/project/" + chatMessage.getProjectId(),
                    message
            );
        } catch (EntityNotFoundException e) {
            log.error(e.toString());
        }
    }

    @MessageMapping("chat.addUser")
    //@SendTo("/project/public")
    public void addUser(ChatMessageDto chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        simpMessagingTemplate.convertAndSend(
                "/project/" + chatMessage.getProjectId(),
                chatMessage
        );
    }

    /*
    @PostMapping
    public ResponseEntity<ChatMessageDto> save(ChatMessageDto save) {
        try {
            ChatMessageDto task = chatService.save(save);
            return ResponseEntity.status(HttpStatus.CREATED).body(task);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
*/
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ChatMessageDto>> getChatMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "sent") String sortBy,
            @RequestParam(defaultValue = "false") boolean ascending,
            @PathVariable Long projectId) {

        try {
            Sort.Direction direction = ascending ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            List<ChatMessageDto> tasks = chatService.findAllChat(projectId, pageable);

            return ResponseEntity.ok(tasks);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }


}
