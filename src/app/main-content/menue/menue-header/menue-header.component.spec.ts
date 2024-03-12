import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenueHeaderComponent } from './menue-header.component';

describe('MenueHeaderComponent', () => {
  let component: MenueHeaderComponent;
  let fixture: ComponentFixture<MenueHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenueHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenueHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
