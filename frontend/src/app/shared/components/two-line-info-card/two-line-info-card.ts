import { Component, Input } from '@angular/core';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-two-line-info-card',
  imports: [MatIcon],
  templateUrl: './two-line-info-card.html',
  styleUrl: './two-line-info-card.scss',
})
export class TwoLineInfoCard {

  @Input() first_line:string = '';
  @Input() second_line:string = '';
  @Input() icon:string = '';
  @Input() iconColor:string = '';

}
