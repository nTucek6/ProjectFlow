import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-avatar-photo',
  imports: [NgStyle],
  templateUrl: './avatar-photo.html',
  styleUrl: './avatar-photo.scss',
})
export class AvatarPhoto {
  @Input() photoUrl: string = '';

  @Input() name: string = '';
  @Input() size: number = 32;

  public showInitials = false;
  public initials: string = '';
  public circleColor: string = '';

  private colors = [
    '#EB7181', // red
    '#468547', // green
    '#FFD558', // yellow
    '#3670B2', // blue
  ];

  ngOnInit() {
    if (!this.photoUrl) {
      this.showInitials = true;
      this.createInitials();

     // const randomIndex = Math.floor(Math.random() * Math.floor(this.colors.length));
     // this.circleColor = this.colors[randomIndex];
      this.circleColor = this.getColorForName(this.name);
    }
  }

    private createInitials(): void {
    let initials = '';
    const words = this.name.trim().split(/\s+/);
    initials = words[0]?.charAt(0).toUpperCase() || '';
    if (words[1]) initials += words[1].charAt(0).toUpperCase();
    this.initials = initials.substring(0, 2);  // Cleaner version
  }

  /*private createInitials(): void {
    let initials = '';

    for (let i = 0; i < this.name.length; i++) {
      if (this.name.charAt(i) === ' ') {
        continue;
      }

      if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
        initials += this.name.charAt(i);

        if (initials.length == 2) {
          break;
        }
      }
    }

    this.initials = initials;
  }*/

 private getColorForName(name: string): string {
  if (!name) return this.colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash + char) >>> 0;  // Unsigned 32-bit (>>>0 fixes)
  }
  const index = hash % this.colors.length;
  return this.colors[index];
}
}
