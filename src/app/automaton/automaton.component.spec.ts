import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatonComponent } from './automaton.component';

describe('AutomatonComponent', () => {
  let component: AutomatonComponent;
  let fixture: ComponentFixture<AutomatonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomatonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
