import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconNightComponent } from './icon-night.component';

describe('IconNightComponent', () => {
  let component: IconNightComponent;
  let fixture: ComponentFixture<IconNightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconNightComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IconNightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
