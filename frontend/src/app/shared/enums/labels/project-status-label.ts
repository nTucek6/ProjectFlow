import { ProjectStatus } from "../project-status.enum";

export const ProjectStatusLabel: Record<ProjectStatus, string> = {
  [ProjectStatus.BACKLOG]: 'Backlog',
  [ProjectStatus.PLANNED]: 'Planned',
  [ProjectStatus.IN_PROGRESS]: 'In Progress',
  [ProjectStatus.BLOCKED]: 'Blocked',
  [ProjectStatus.IN_REVIEW]: 'In Review',
  [ProjectStatus.DONE]: 'Done',
  [ProjectStatus.ARCHIVED]: 'Archived'
};