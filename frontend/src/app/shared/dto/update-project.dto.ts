import { ProjectMemberDto } from "./project-member.dto";

export type UpdateProjectDto = {
  name: string;
  members?: ProjectMemberDto[];
  //customMilestones: UpdateCustomMilestoneDto[];
  deadline: Date;   
  startDate: Date;  
  updatedAt: Date;  
}
