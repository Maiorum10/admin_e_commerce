import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AccesoService } from '../../servicios/servicio.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  cedula:any=""
  clave:any=""
  id:any
  usuarios:any
  p_nombre:any
  p_apellido:any
  constructor(
    private servicio:AccesoService,
    private router:Router
  ) {}

  ngOnInit() {
  }
  ingresar(){
    if(this.cedula==''){
      Swal.fire('Error','Ingrese la cédula','error');
    }else if(this.clave==''){
      Swal.fire('Error','Ingrese la clave','error');
    }else{
      let body={
        'accion': 'login_empleados',
        'cedula': this.cedula,
        'clave' : this.clave
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            this.usuarios=res.datos;
            localStorage.setItem('id', this.usuarios[0].id_empleado)
            this.p_nombre=this.usuarios[0].nombre;
            this.p_apellido=this.usuarios[0].apellido;
            localStorage.setItem('nombre', this.p_nombre+' '+this.p_apellido)
            localStorage.setItem('tienda', this.usuarios[0].sucursales_id_sucursales)
            localStorage.setItem('cargo', this.usuarios[0].cargo)
            localStorage.setItem('rol', this.usuarios[0].rol)
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'Bienvenido '+this.p_nombre+' '+this.p_apellido,
              showConfirmButton: false,
              timer: 1500
            })
            this.router.navigateByUrl("inicio")
          }else{
            Swal.fire('Error','Datos incorrectos','error');
          }
        },(err)=>{
          Swal.fire('Error','Error de conexión','error');
        });
      });
    }
  }

}
