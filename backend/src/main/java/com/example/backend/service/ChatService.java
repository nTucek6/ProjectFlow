package com.example.backend.service;

import com.example.backend.dto.ChatMessageDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatService {
    List<ChatMessageDto> findAllChat(Long projectId, Pageable pageable);

    ChatMessageDto save(ChatMessageDto chatToSave);
}
