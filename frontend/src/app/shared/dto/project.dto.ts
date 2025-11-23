export type ProjectDto = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    deadline: Date;
    progress: number;
    totalTasks: number;
    membersCount: number;
}