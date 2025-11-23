package com.example.backend.service.implementation;

import com.example.backend.dto.TaskDto;
import com.example.backend.mapper.ProjectMapper;
import com.example.backend.mapper.TaskMapper;
import com.example.backend.model.Project;
import com.example.backend.model.Task;
import com.example.backend.repository.TaskRepository;
import com.example.backend.service.TaskService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    @Override
    public List<TaskDto> findAllPagedAndFiltered(Pageable pageable, Long projectId) {
        Page<Task> t = taskRepository
                .findFilteredAndPaged(
                        projectId,
                        pageable);

        return new ArrayList<>(t.getContent().
                stream()
                .map(TaskMapper::mapTaskToTaskDto).toList());
    }
}
