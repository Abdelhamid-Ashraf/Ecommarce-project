import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatProdComponent } from './cat-prod.component';

describe('CatProdComponent', () => {
  let component: CatProdComponent;
  let fixture: ComponentFixture<CatProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatProdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
