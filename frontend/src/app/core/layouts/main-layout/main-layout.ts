import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Sidebar } from '../../sidebar/sidebar';
import { TopNavigation } from "../../top-navigation/top-navigation";

@Component({
  selector: 'app-main-layout',
  imports: [MatSidenavModule, RouterOutlet, Sidebar, TopNavigation],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

  isSidebarOpen: boolean = true;

  onSidebarToggle(toggle: boolean) {
    this.isSidebarOpen = toggle;
  }
}
