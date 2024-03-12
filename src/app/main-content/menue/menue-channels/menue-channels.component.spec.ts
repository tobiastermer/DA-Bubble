import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenueChannelsComponent } from './menue-channels.component';

describe('MenueChannelsComponent', () => {
  let component: MenueChannelsComponent;
  let fixture: ComponentFixture<MenueChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenueChannelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenueChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
