package com.example.backend.mapper;

import com.example.backend.dto.task.TaskDto;
import com.example.backend.enums.TaskStatus;
import com.example.backend.model.table.Task;
import com.example.backend.model.table.User;

import java.util.List;

public class TaskMapper {

    public static TaskDto mapTaskToTaskDto(Task task) {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setCreatedAt(task.getCreatedAt());
        taskDto.setStatus(task.getStatus());
        taskDto.setStatusText(convertStatus(task.getStatus()));
        taskDto.setOrder(task.getOrder());
        taskDto.setAssignees(task.getAssignees().stream().map(UserMapper::mapUserToSelectDto).toList());
        return taskDto;
    }


    private static String convertStatus(TaskStatus status) {
        return switch (status) {
            case TODO -> "To do";
            case IN_PROGRESS -> "In progress";
            case DONE -> "Done";
            default -> status.name();
        };
    }

}
