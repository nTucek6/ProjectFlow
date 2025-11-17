import { Component, inject } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { TwoLineInfoCard } from "../../shared/components/two-line-info-card/two-line-info-card";

@Component({
  selector: 'app-home',
  imports: [TwoLineInfoCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private authService = inject(AuthService);

  user_name = '';

  ngOnInit(): void {
    const temp = this.authService.getUserFirstName();
    console.log(temp)

    if (temp != null) this.user_name = temp;
  }
}
