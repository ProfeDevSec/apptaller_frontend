import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconRolesComponent } from './icon-roles.component';

describe('IconRolesComponent', () => {
  let component: IconRolesComponent;
  let fixture: ComponentFixture<IconRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconRolesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
