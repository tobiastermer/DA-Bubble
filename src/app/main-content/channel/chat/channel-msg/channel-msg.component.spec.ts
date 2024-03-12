import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMsgComponent } from './channel-msg.component';

describe('ChannelMsgComponent', () => {
  let component: ChannelMsgComponent;
  let fixture: ComponentFixture<ChannelMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelMsgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
