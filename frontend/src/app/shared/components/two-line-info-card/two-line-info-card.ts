import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-two-line-info-card',
  imports: [],
  templateUrl: './two-line-info-card.html',
  styleUrl: './two-line-info-card.scss',
})
export class TwoLineInfoCard {

  @Input() first_line:string = '';
  @Input() second_line:string = '';

}
