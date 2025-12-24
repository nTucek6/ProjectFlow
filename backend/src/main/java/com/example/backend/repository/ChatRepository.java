package com.example.backend.repository;

import com.example.backend.model.table.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;



public interface ChatRepository extends JpaRepository<ChatRoom, Long> {

    //OrderBySentDesc
    Page<ChatRoom> findAllByProject_Id(Long projectId, Pageable pageable);
}
