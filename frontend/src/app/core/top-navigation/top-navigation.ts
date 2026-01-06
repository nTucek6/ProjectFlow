import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '@shared/services/api/auth.service';
import { Router } from '@angular/router';
import { AvatarPhoto } from '../../shared/components/avatar-photo/avatar-photo';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-top-navigation',
  imports: [TranslatePipe, MatIcon, AvatarPhoto, MatMenuModule],
  templateUrl: './top-navigation.html',
  styleUrl: './top-navigation.scss',
})
export class TopNavigation {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() sidebarToggle = new EventEmitter<boolean>();

  isSidebarOpen: boolean = true;

  userFullname = '';

  isProfileOpen: boolean = false;

  ngOnInit() {
    this.userFullname = this.authService.getUserFullName();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggle.emit(this.isSidebarOpen);
  }

  logout() {
    console.log('Called!');
    this.authService.logout().subscribe((response) => {
      console.log(response);
      this.authService.setUser(null);
      this.router.navigate(['/login']);
    });
  }
}
