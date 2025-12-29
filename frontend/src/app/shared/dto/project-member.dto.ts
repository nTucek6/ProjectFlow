import { ProjectRole } from '../enums/project-role.enum';

export type ProjectMemberDto = {
  id: number;
  fullName: string;
  email: string;
  role: ProjectRole;
  roleValue: String;
  joinedAt: string;
};
