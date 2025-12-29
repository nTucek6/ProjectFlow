export type UserActivityDto = {
  id: number;
  userId: number;
  userFullName:string;
  projectId: number;
  projectName:string;
  action: string;
  description: string;
  createdAt: Date;
}