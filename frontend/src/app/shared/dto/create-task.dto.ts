import { Select } from "@shared/model/select";

export type CreateTaskDto = {
    projectId: number;
    title:string;
    description:string;
    assignees: Select[];
    projectMilestoneId?:number;
}