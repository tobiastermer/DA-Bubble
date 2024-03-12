import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAddUserComponent } from './input-add-user.component';

describe('InputAddUserComponent', () => {
  let component: InputAddUserComponent;
  let fixture: ComponentFixture<InputAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputAddUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
