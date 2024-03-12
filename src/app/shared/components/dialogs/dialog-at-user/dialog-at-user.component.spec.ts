import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAtUserComponent } from './dialog-at-user.component';

describe('DialogAddUserComponent', () => {
  let component: DialogAtUserComponent;
  let fixture: ComponentFixture<DialogAtUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAtUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAtUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
