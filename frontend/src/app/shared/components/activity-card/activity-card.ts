import { Component, Input } from '@angular/core';
import { AvatarPhoto } from "../avatar-photo/avatar-photo";
import { MatIcon } from "@angular/material/icon";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity-card',
  imports: [AvatarPhoto, MatIcon, DatePipe],
  templateUrl: './activity-card.html',
  styleUrl: './activity-card.scss',
})
export class ActivityCard {

  @Input() userFullName : string = '';
  @Input() action : string = '';
  @Input() description : string = '';
  @Input() projectName : string = '';
  @Input() createdAt : Date = new Date();
  @Input() includeIcon : boolean = true;

}
