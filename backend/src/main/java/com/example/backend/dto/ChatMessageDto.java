package com.example.backend.dto;

import com.example.backend.enums.MessageType;
import jakarta.annotation.Nullable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDto {

    private Long id;
    private String content;
    private Long sender;
    private MessageType type;
    private String fullName;
    private Long projectId;
    private LocalDateTime sent;
    @Nullable
    private String fileUrl;
}
