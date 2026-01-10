import { ProjectRole } from "@shared/enums/project-role.enum";

export type ProjectDto = {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    deadline: Date;
    progress: number;
    totalTasks: number;
    membersCount: number;
    role?: ProjectRole;
}