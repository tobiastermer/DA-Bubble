import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddMembersToNewChannelComponent } from './dialog-add-members-to-new-channel.component';

describe('DialogAddMembersToNewChannelComponent', () => {
  let component: DialogAddMembersToNewChannelComponent;
  let fixture: ComponentFixture<DialogAddMembersToNewChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogAddMembersToNewChannelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogAddMembersToNewChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
