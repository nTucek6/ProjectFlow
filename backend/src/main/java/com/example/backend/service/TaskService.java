package com.example.backend.service;


import com.example.backend.dto.CreateTaskDto;
import com.example.backend.dto.TaskDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskService {

    TaskDto save(CreateTaskDto taskDto);

    TaskDto update(Long id,TaskDto taskDto);

    void reorder(List<TaskDto> tasksDto);

    void delete(Long id);

    List<TaskDto> findAllPagedAndFiltered(Pageable pageable, Long projectId);

    List<TaskDto> getAllTasks(Long projectId);

    List<TaskDto> findUserTasks(Long projectId ,Long userId);

}
