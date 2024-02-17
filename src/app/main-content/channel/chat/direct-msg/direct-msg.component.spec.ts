import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectMsgComponent } from './direct-msg.component';

describe('DirectMsgComponent', () => {
  let component: DirectMsgComponent;
  let fixture: ComponentFixture<DirectMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectMsgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DirectMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
