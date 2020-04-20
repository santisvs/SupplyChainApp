/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { JamonService } from './Jamon.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-jamon',
  templateUrl: './Jamon.component.html',
  styleUrls: ['./Jamon.component.css'],
  providers: [JamonService]
})
export class JamonComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  jamonId = new FormControl('', Validators.required);
  cantidad = new FormControl('', Validators.required);
  divisa = new FormControl('', Validators.required);
  peso = new FormControl('', Validators.required);
  estatus_brida = new FormControl('', Validators.required);
  tiempoCuracion = new FormControl('', Validators.required);
  propietario = new FormControl('', Validators.required);

  constructor(public serviceJamon: JamonService, fb: FormBuilder) {
    this.myForm = fb.group({
      jamonId: this.jamonId,
      cantidad: this.cantidad,
      divisa: this.divisa,
      peso: this.peso,
      estatus_brida: this.estatus_brida,
      tiempoCuracion: this.tiempoCuracion,
      propietario: this.propietario
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceJamon.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.jamon.Jamon',
      'jamonId': this.jamonId.value,
      'precio': {
        $class: 'org.jamon.Dinero',
        'cantidad': this.cantidad.value,
        'divisa': this.divisa.value
      },
      'peso': this.peso.value,
      'estatus_brida': this.estatus_brida.value,
      'tiempoCuracion': this.tiempoCuracion.value,
      'propietario': this.propietario.value
    };

    this.myForm.setValue({
      'jamonId': null,
      'cantidad': null,
      'divisa': null,
      'peso': null,
      'estatus_brida': null,
      'tiempoCuracion': null,
      'propietario': null
    });

    return this.serviceJamon.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'jamonId': null,
        'cantidad': null,
        'divisa': null,
        'peso': null,
        'estatus_brida': null,
        'tiempoCuracion': null,
        'propietario': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.jamon.Jamon',
      'precio': {
        $class: 'org.jamon.Dinero',
        'cantidad': this.cantidad.value,
        'divisa': this.divisa.value
      },
      'peso': this.peso.value,
      'estatus_brida': this.estatus_brida.value,
      'tiempoCuracion': this.tiempoCuracion.value,
      'propietario': this.propietario.value
    };

    return this.serviceJamon.updateAsset(form.get('jamonId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceJamon.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceJamon.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'jamonId': null,
        'cantidad': null,
        'divisa': null,
        'peso': null,
        'estatus_brida': null,
        'tiempoCuracion': null,
        'propietario': null
      };

      if (result.jamonId) {
        formObject.jamonId = result.jamonId;
      } else {
        formObject.jamonId = null;
      }

      if (result.precio.cantidad) {
        formObject.cantidad = result.precio.cantidad;
      } else {
        formObject.cantidad = null;
      }

      if (result.precio.divisa) {
        formObject.divisa = result.precio.divisa;
      } else {
        formObject.divisa = null;
      }

      if (result.peso) {
        formObject.peso = result.peso;
      } else {
        formObject.peso = null;
      }

      if (result.estatus_brida) {
        formObject.estatus_brida = result.estatus_brida;
      } else {
        formObject.estatus_brida = null;
      }

      if (result.tiempoCuracion) {
        formObject.tiempoCuracion = result.tiempoCuracion;
      } else {
        formObject.tiempoCuracion = null;
      }

      if (result.propietario) {
        formObject.propietario = result.propietario;
      } else {
        formObject.propietario = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'jamonId': null,
      'precio': null,
      'cantidad': null,
      'divisa': null,
      'estatus_brida': null,
      'tiempoCuracion': null,
      'propietario': null
      });
  }

}
