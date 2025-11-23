package com.example.backend.mapper;

import com.example.backend.dto.TaskDto;
import com.example.backend.model.Task;

public class TaskMapper {

    public static TaskDto mapTaskToTaskDto(Task task) {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setCreatedAt(task.getCreatedAt());
        taskDto.setStatus(task.getStatus());
        return taskDto;
    }

}
