import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGuestsComponent } from './manage-guests.component';

describe('ManageGuestsComponent', () => {
  let component: ManageGuestsComponent;
  let fixture: ComponentFixture<ManageGuestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageGuestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageGuestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
