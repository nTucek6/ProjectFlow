import { Component } from '@angular/core';
import { AvatarPhoto } from "../avatar-photo/avatar-photo";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-activity-card',
  imports: [AvatarPhoto, MatIcon],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss',
})
export class ActivityCard {

}
