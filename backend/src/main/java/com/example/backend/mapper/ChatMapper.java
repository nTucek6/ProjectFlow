package com.example.backend.mapper;

import com.example.backend.dto.ChatMessageDto;
import com.example.backend.enums.MessageType;
import com.example.backend.model.ChatRoom;

public class ChatMapper {

    public static ChatMessageDto mapChatRoomToChatMessageDto(ChatRoom chat)
    {
        ChatMessageDto chatDto = new ChatMessageDto();
        chatDto.setId(chat.getId());
        chatDto.setSender(chat.getSender().getId());
        chatDto.setProjectId(chat.getProject().getId());
        chatDto.setContent(chat.getContent());
        chatDto.setFullName(chat.getSender().getFullName());
        chatDto.setType(MessageType.SEND);
        chatDto.setSent(chat.getSent());
        return chatDto;
    }

}
