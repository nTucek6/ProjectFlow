import { Injectable, signal } from '@angular/core';
import { Action } from '@shared/enums/action.enum';
import { ProjectRole } from '@shared/enums/project-role.enum';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private role = signal<ProjectRole | null>(null);

  setProjectRole(role: ProjectRole) {
    this.role.set(role);
  }

  reset() {
    this.role.set(null);
  }

  can(action: Action): boolean {
    const r = this.role();

    if (!r) return false;

    const perms: Record<ProjectRole, Action[]> = {
      [ProjectRole.OWNER]: [
        Action.VIEW,
        Action.CREATE,
        Action.EDIT,
        Action.DELETE,
        Action.ASSIGN,
        Action.MANAGE_MEMBERS,
        Action.EDIT_PROJECT,
        Action.MOVE_TASK,
        Action.READ_CHAT
      ],
      [ProjectRole.MENTOR]: [
        Action.VIEW,
        Action.CREATE,
        Action.EDIT,
        Action.ASSIGN,
        Action.MANAGE_MEMBERS,
         Action.READ_CHAT
      ],
      [ProjectRole.MEMBER]: [
        Action.VIEW,
        Action.CREATE,
        Action.EDIT,
        Action.ASSIGN,
        Action.MOVE_TASK,
        Action.READ_CHAT
      ],
      [ProjectRole.VIEWER]: [Action.VIEW],
    };
    if (r != null) {
      return perms[r].includes(action) ?? false;
    }
    return false;
  }
}
