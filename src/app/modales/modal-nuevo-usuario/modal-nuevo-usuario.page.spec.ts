import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalNuevoUsuarioPage } from './modal-nuevo-usuario.page';

describe('ModalNuevoUsuarioPage', () => {
  let component: ModalNuevoUsuarioPage;
  let fixture: ComponentFixture<ModalNuevoUsuarioPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNuevoUsuarioPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalNuevoUsuarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
