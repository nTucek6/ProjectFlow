import { Select } from "@shared/model/select";

export type TaskDto = {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  status: string;
  statusText:string;
  order:number;
  assignees: Select[];
};
