import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { Action } from '@shared/enums/action.enum';
import { PermissionsService } from '@shared/services/permission.service';

@Directive({
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  public templateRef = inject(TemplateRef);
  public viewContainer = inject(ViewContainerRef);
  private permissionService = inject(PermissionsService);

  @Input() set hasPermission(action: Action) {
    if (this.permissionService.can(action)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
