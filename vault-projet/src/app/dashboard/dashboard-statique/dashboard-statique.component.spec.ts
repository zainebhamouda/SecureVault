import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatiqueComponent } from './dashboard-statique.component';

describe('DashboardStatiqueComponent', () => {
  let component: DashboardStatiqueComponent;
  let fixture: ComponentFixture<DashboardStatiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatiqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
