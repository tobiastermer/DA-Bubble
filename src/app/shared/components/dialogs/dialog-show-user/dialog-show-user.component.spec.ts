import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogShowUserComponent } from './dialog-show-user.component';

describe('DialogShowUserComponent', () => {
  let component: DialogShowUserComponent;
  let fixture: ComponentFixture<DialogShowUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogShowUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogShowUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
