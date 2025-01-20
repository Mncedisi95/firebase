import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailsAdminComponent } from './room-details-admin.component';

describe('RoomDetailsAdminComponent', () => {
  let component: RoomDetailsAdminComponent;
  let fixture: ComponentFixture<RoomDetailsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomDetailsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomDetailsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
