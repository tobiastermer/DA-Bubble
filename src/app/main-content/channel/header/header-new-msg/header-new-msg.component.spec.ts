import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderNewMsgComponent } from './header-new-msg.component';

describe('HeaderNewMsgComponent', () => {
  let component: HeaderNewMsgComponent;
  let fixture: ComponentFixture<HeaderNewMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderNewMsgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderNewMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
