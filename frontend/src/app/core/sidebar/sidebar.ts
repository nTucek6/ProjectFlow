import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, MatIcon, TranslatePipe, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() isSidebarOpen:boolean = true;

  private router = inject(Router);

  isProjectsActive(): boolean {
    return this.router.url.startsWith('/projects') || this.router.url.startsWith('/project/');
  }

  isProjectActive(): boolean {
    return this.router.url.startsWith('/project/');
  }
}
