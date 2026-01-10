import { Directive, HostBinding, inject, Input, OnChanges } from '@angular/core';
import { Action } from '@shared/enums/action.enum';
import { PermissionsService } from '@shared/services/permission.service';

@Directive({
  selector: '[blockPermission]',
  standalone: true,
})
export class BlockPermissionDirective implements OnChanges {
  @Input('blockPermission') action!: Action;

  @HostBinding('attr.disabled') @HostBinding('attr.aria-disabled') disabled = false;
  @HostBinding('style.pointer-events') pointer = 'auto';
  @HostBinding('style.opacity') opacity = 1;
  @HostBinding('style.cursor') cursor = 'grab';

  private permissionService = inject(PermissionsService);

  ngOnChanges() {
    const can = this.permissionService.can(this.action);
    this.disabled = !can;
    this.pointer = can ? 'auto' : 'none'; // Blocks CDK drag
    this.opacity = can ? 1 : 0.6;
    this.cursor = can ? 'grab' : 'not-allowed';
  }
}
