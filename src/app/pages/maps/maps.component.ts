import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/servicios/servicio.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  cedula:any;
  id_empleado:any;
  nombre:any;
  apellido:any;
  cargo:any;
  clave:any
  rol:any;
  bandera:any=0
  id_sucursal:any;
  empleados:any;
  id_empleados:any;
  sucursal:any;
  sucursales:any;
  buscador:any;
  validador:any
  nombre_sucursal:any='Seleccione'
  ciudad:any='sucursal'
  constructor(
    private servicio: AccesoService,
    private router: Router,
    public datepipe: DatePipe) { }

  ngOnInit() {
    if(localStorage.getItem('cargo')!='admin'){
      Swal.fire('Ventana administrativa','','warning')
      this.router.navigateByUrl("dashboard")
    }else{
      document.getElementById('formulario_empleados').style.display = 'none';
    this.consultar_empleados()
    }

  }

  nuevo(){
    if(this.bandera==0){
      document.getElementById('empleados').style.display = 'none';
      document.getElementById('formulario_empleados').style.display = 'block';
      this.nombre=""
      this.apellido=""
      this.cedula=""
      this.clave=""
      this.cargo='Seleccione'
      this.rol=""
      this.id_sucursal=""
      this.consultar_sucursales()
    }else{
      this.bandera=1
      document.getElementById('empleados').style.display = 'none';
      document.getElementById('formulario_empleados').style.display = 'block';
      this.consultar_sucursales()
    }

  }

  cambiar_cargo(cargo){
    this.cargo=cargo
  }

  click_sucursales(i){
    this.nombre_sucursal=i.nombre_sucursal
    this.ciudad=i.ciudad
    this.id_sucursal=i.id_sucursal
  }

  control_cedula(cedula: String){
    if(this.cedula==""){

    }else{
      let body={
        'accion': 'control_cedula',
        'cedula': this.cedula
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            Swal.fire('La Cedula ingresada ya existe','','warning')
            this.cedula=''
          }else{
            if(this.cedula=='0000000000'||this.cedula=='2222222222'||this.cedula=='4444444444'||this.cedula=='5555555555'){
              Swal.fire('Cédula inválida','','warning')
              this.cedula=''
            }else{
              let cedulaCorrecta = false;
              if (cedula.length == 10)
              {
                let tercerDigito = parseInt(cedula.substring(2, 3));
                if (tercerDigito < 6) {
                    // El ultimo digito se lo considera dígito verificador
                    let coefValCedula = [2, 1, 2, 1, 2, 1, 2, 1, 2];
                    let verificador = parseInt(cedula.substring(9, 10));
                    let suma:number = 0;
                    let digito:number = 0;
                    for (let i = 0; i < (cedula.length - 1); i++) {
                        digito = parseInt(cedula.substring(i, i + 1)) * coefValCedula[i];
                        suma += ((parseInt((digito % 10)+'') + (parseInt((digito / 10)+''))));
                  //      console.log(suma+" suma"+coefValCedula[i]);
                    }
                    suma= Math.round(suma);
                  //  console.log(verificador);
                  //  console.log(suma);
                  //  console.log(digito);
                    if ((Math.round(suma % 10) == 0) && (Math.round(suma % 10)== verificador)) {
                        cedulaCorrecta = true;
                    } else if ((10 - (Math.round(suma % 10))) == verificador) {
                        cedulaCorrecta = true;
                    } else {
                        cedulaCorrecta = false;
                        Swal.fire('Cédula inválida','','warning')

                    }
                  } else {
                    cedulaCorrecta = false;
                    Swal.fire('Cédula inválida','','warning')

                  }
              } else {
                    cedulaCorrecta = false;
                    Swal.fire('Cédula inválida','','warning')

              }
              this.validador= cedulaCorrecta;
            }
          }
        });
      });
    }

  }
  consultar_sucursales(){
    let body={
      'accion': 'consultar_sucursales'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let sucursal=res.datos;
          this.sucursales=sucursal
        }else{
        }
      });
    });
}
consultar_sucursales_id(){
  let body={
    'accion': 'consultar_sucursales_id',
    'id_sucursal': this.id_sucursal
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let sucursal=res.datos;
        this.sucursales=sucursal
      }else{
      }
    });
  });
}
  consultar_empleados(){
    let body={
      'accion': 'consultar_empleados'
    }
    //console.log(body)
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let empleado=res.datos;
          this.empleados=empleado
          //console.log(empleado[0].id_empleado)
        }else{
        }
      });
    });
}
atrapar_id(a){
  this.id_empleados=a.id_empleado
  this.bandera=1
  this.nuevo()
  this.llenar_empleados()
}
llenar_empleados(){
  let body={
    'accion': 'consultar_empleados_id',
    'id_empleado': this.id_empleados
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let empleados=res.datos;
        this.nombre=empleados[0].nombre
        this.apellido=empleados[0].apellido
        this.cedula=empleados[0].cedula
        this.clave=empleados[0].clave
        this.cargo=empleados[0].cargo
        this.rol=empleados[0].rol
        this.id_sucursal=empleados[0].sucursales_id_sucursales
        let body={
          'accion': 'consultar_sucursales_id',
          'id_sucursal': this.id_sucursal
        }
        return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            if(res.estado){
              let sucursal=res.datos;
              this.nombre_sucursal=sucursal[0].nombre_sucursal
              this.ciudad=sucursal[0].ciudad
            }else{
            }
          });
        });
      }else{
      }
    });
  });
}

guardar_empleado(){
  if(this.nombre==''){
    Swal.fire('Ingrese el nombre','','warning')
  }else if(this.apellido==''){
    Swal.fire('Ingrese el apellido','','warning')
  }else if(this.cedula==''){
    Swal.fire('Ingrese la cedula','','warning')
  }else if(this.clave==''){
    Swal.fire('Ingrese la clave','','warning')
  }else if(this.id_sucursal==''){
    Swal.fire('Ingrese la sucursal','','warning')
  }else if(this.cargo=='Seleccione'){
    Swal.fire('Ingrese el cargo','','warning')
  }else{
    if(this.bandera==0){
      let body={
        'accion': 'crear_empleado',
        'nombre': this.nombre,
        'apellido': this.apellido,
        'cedula': this.cedula,
        'clave': this.clave,
        'cargo': this.cargo,
        'rol': this.rol,
        'sucursales_id_sucursales': this.id_sucursal
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            document.getElementById('empleados').style.display = 'block';
            document.getElementById('formulario_empleados').style.display = 'none';
            this.consultar_empleados()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Empleado Creado con Éxito ',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            Swal.fire('','Error al guardar','info')
          }
        });
      });
    }else if(this,this.bandera==1){
      let body={
        'accion': 'actualizar_empleados',
        'nombre': this.nombre,
        'apellido': this.apellido,
        'cedula': this.cedula,
        'clave': this.clave,
        'cargo': this.cargo,
        'rol': this.rol,
        'sucursales_id_sucursales': this.id_sucursal,
        'id_empleado': this.id_empleados
      }
      //console.log(body)
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            document.getElementById('empleados').style.display = 'block';
            document.getElementById('formulario_empleados').style.display = 'none';
            this.consultar_empleados()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Empleado Actualizado con Éxito ',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
            Swal.fire('','Error al actualizar','info')
          }
        });
      });
    }
  }

}
buscador_empleados(){
  let body={
    'accion': 'buscador_empleados',
    'cedula': '%'+this.buscador+'%',
    'nombre': '%'+this.buscador+'%',
    'apellido': '%'+this.buscador+'%'
  }
  //console.log(body)
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let empleado=res.datos;
        this.empleados=empleado
      }else{
      }
    });
  });
}
}
