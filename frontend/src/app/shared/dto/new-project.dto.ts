import { NewProjectMilestoneDto } from './new-project-milestone.dto';

export type NewProjectDto = {
  name: string;
  description: string;
  membersId: number[];
  customMilestones: NewProjectMilestoneDto[];
  deadline:string;
  ownerId:number;
};
