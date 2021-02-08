import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalDetalleProveedorPage } from './modal-detalle-proveedor.page';

describe('ModalDetalleProveedorPage', () => {
  let component: ModalDetalleProveedorPage;
  let fixture: ComponentFixture<ModalDetalleProveedorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetalleProveedorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDetalleProveedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
