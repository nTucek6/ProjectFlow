import { TaskStatus } from "../task-status.enum";


export const TaskStatusLabel: Record<number, string> = {
  [TaskStatus.TODO]: 'To do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
};