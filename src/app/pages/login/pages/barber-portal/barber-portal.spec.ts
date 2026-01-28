import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarberPortal } from './barber-portal';

describe('BarberPortal', () => {
  let component: BarberPortal;
  let fixture: ComponentFixture<BarberPortal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarberPortal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarberPortal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
