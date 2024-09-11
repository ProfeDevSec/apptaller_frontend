import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconAddUserComponent } from './icon-add-user.component';

describe('IconAddUserComponent', () => {
  let component: IconAddUserComponent;
  let fixture: ComponentFixture<IconAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconAddUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
