import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsAdminComponent } from './rooms-admin.component';

describe('RoomsAdminComponent', () => {
  let component: RoomsAdminComponent;
  let fixture: ComponentFixture<RoomsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
