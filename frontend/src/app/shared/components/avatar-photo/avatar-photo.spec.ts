import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPhoto } from './avatar-photo';

describe('AvatarPhoto', () => {
  let component: AvatarPhoto;
  let fixture: ComponentFixture<AvatarPhoto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPhoto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarPhoto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
