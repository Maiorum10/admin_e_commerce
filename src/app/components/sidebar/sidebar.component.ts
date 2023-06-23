import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/servicios/servicio.service';
import Swal from 'sweetalert2';
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Inicio',  icon: 'ni-tv-2 text-warning', class: '' },
    { path: '/icons', title: 'Productos',  icon:'ni-box-2 text-warning', class: ''},
    { path: '/maps', title: 'Empleados',  icon:'ni-badge text-warning', class: ''},
    { path: '/tables', title: 'Sucursales',  icon:'ni-building text-warning', class: ''}
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  nombre:any;
  cargo:any
  id_tienda:any
  sucursal:any
  constructor(private router: Router, private servicio: AccesoService) { }

  ngOnInit() {
    this.nombre=localStorage.getItem('nombre')
    this.cargo=localStorage.getItem('cargo')
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
   if(localStorage.getItem('id')=='0' || localStorage.getItem('id')=='' || localStorage.getItem('id')==null){
    Swal.fire('Iniciar sesion','','warning')
    this.router.navigateByUrl("login")
    }
    this.id_tienda=localStorage.getItem('tienda')
    this.nombre_tienda()
  }
  nombre_tienda(){
    let body={
      'accion': 'consultar_sucursales_id',
      'id_sucursal': this.id_tienda
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let sucursal=res.datos;
          this.sucursal=sucursal[0].nombre_sucursal
        }else{
        }
      });
    });
  }
  set(){
    this.servicio.pacienteId='0'
  }
}
