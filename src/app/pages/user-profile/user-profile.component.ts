import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/servicios/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  clave:any
  cedula:any
  nombre:any
  apellido:any
  constructor(
    private servicio: AccesoService,
    private router: Router
  ) { }

  ngOnInit() {
    if(localStorage.getItem('id')=='0'||localStorage.getItem('id')==null){
      Swal.fire('Inicie sesión por favor','', 'warning');
      this.router.navigateByUrl("login")
    }
    this.consultarUsuario();
  }
  consultarUsuario(){
    let body={
      'accion': 'consultar_empleados',
      'id_empleado': localStorage.getItem('id')
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let usuario=res.datos;
          this.cedula = usuario[0].cedula;
          this.nombre = usuario[0].nombre;
          this.apellido = usuario[0].apellido;
          this.clave = usuario[0].clave;
        }else{
          Swal.fire('No existe el empleado');
        }
      }, (err)=>{
        Swal.fire('Error','Error de conexión','error');
      });
    });
  }
  actualizarUsuario(){
    if(this.clave==''){
      Swal.fire('Ingrese una clave');
    }else{
      let body={
        'accion': 'actualizar_clave',
        'id_empleado': localStorage.getItem('id'),
        'clave': this.clave
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            Swal.fire('Clave actualizada','', 'success');
            this.router.navigateByUrl("dashboard")
          }else{
            Swal.fire('Error al actualizar');
            this.router.navigateByUrl("dashboard")
          }
        }, (err)=>{
          Swal.fire('Error','Error de conexión','error');
        });
      });
    }
  }

}
