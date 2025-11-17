import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-navigation',
  imports: [TranslatePipe, MatIcon],
  templateUrl: './top-navigation.html',
  styleUrl: './top-navigation.scss',
})
export class TopNavigation {
  @Output() sidebarToggle = new EventEmitter<boolean>();

  private authService = inject(AuthService);
  private router = inject(Router)

  isSidebarOpen: boolean = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebarToggle.emit(this.isSidebarOpen);
  }

  logout(){
    console.log("Called!")
    this.authService.logout().subscribe((response) => {
      console.log(response);
      this.authService.setUser(null);
      this.router.navigate(['/login']);
    });
  }

}
