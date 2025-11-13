import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [MatSidenavModule,RouterOutlet,Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
}
