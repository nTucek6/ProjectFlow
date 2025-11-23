package com.example.backend.service;


import com.example.backend.dto.TaskDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskService {

    List<TaskDto> findAllPagedAndFiltered(Pageable pageable, Long projectId);

}
