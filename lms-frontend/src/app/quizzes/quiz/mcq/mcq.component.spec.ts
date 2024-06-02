import { ComponentFixture, TestBed } from '@angular/core/testing';

import { McqComponent } from './mcq.component';

describe('McqComponent', () => {
  let component: McqComponent;
  let fixture: ComponentFixture<McqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ McqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(McqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
