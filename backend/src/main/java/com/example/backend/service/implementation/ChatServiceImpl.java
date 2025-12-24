package com.example.backend.service.implementation;

import com.example.backend.dto.ChatMessageDto;
import com.example.backend.mapper.ChatMapper;
import com.example.backend.model.table.ChatRoom;
import com.example.backend.model.table.Project;
import com.example.backend.model.table.User;
import com.example.backend.repository.ChatRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ChatService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@AllArgsConstructor
@Service
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public List<ChatMessageDto> findAllChat(Long projectId, Pageable pageable) {

        Page<ChatRoom> t = chatRepository.findAllByProject_Id(projectId, pageable);


        List<ChatMessageDto> messages = new ArrayList<>(t.getContent().
                stream()
                .map(ChatMapper::mapChatRoomToChatMessageDto).toList());
        Collections.reverse(messages); // oldest first
        return messages;
    }

    @Override
    public ChatMessageDto save(ChatMessageDto chatToSave) {

        Project project = projectRepository.findById(chatToSave.getProjectId()).orElseThrow(() -> new RuntimeException("Project not found"));

        User user = userRepository.findById(chatToSave.getSender()).orElseThrow(() -> new RuntimeException("User not found"));

        ChatRoom chat = new ChatRoom();
        chat.setProject(project);
        chat.setContent(chatToSave.getContent());
        chat.setSender(user);
        chat.setSent(chatToSave.getSent());

        if (chatToSave.getFileUrl() != null) {
            chat.setFileUrl(chatToSave.getFileUrl());
        }
        return ChatMapper.mapChatRoomToChatMessageDto(chatRepository.save(chat));
    }

}
