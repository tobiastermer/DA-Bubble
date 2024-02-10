import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenueMessagesComponent } from './menue-messages.component';

describe('MenueMessagesComponent', () => {
  let component: MenueMessagesComponent;
  let fixture: ComponentFixture<MenueMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenueMessagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenueMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
