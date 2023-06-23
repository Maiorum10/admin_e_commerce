import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/servicios/servicio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss']
})
export class DetallesComponent implements OnInit {

  cedula:any;
  id_paciente:any;
  nombre:any;
  apellido:any;
  s_nombre:any;
  s_apellido:any;
  celular:any;
  fecha_n:any;
  sexo:any;
  canton:any;
  provincia:any;
  ocupacion:any;
  empresa:any;
  seguro:any;
  referencia:any;
  tel_referencia:any;
  par_referencia:any;
  clave:any;
  direccion:any;
  parroquia:any;
  lug_nacimiento:any;
  est_civil:any;
  id_historia:any;
  edad:any;
  a:any;
  m:any;
  d:any;
  detalles:any;
  fecha:any;

  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit() {
    if(this.servicio.cedulaPaciente=='0'||this.servicio.cedulaPaciente==null){
      Swal.fire('','','warning')
      this.router.navigateByUrl("dashboard")
    }else{
      this.cedula=this.servicio.cedulaPaciente;

    }
  }



  getEdad(dateString) {
    let hoy = new Date()
    let fechaNacimiento = new Date(dateString)
    this.edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
    if (
      diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
    ) {
      this.edad--
    }
    return this.edad
  }

  nuevo(){
    this.servicio.atencion='0';
    this.router.navigateByUrl("icons")
  }

  consultar_detalles(){
    let body={
      'accion': 'detalle_historias',
      'historia_id_historia': this.id_historia
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.detalles=res.datos;
        }else{
          Swal.fire('No hay atenciones previas','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');
        console.log(err)
      });
    });
  }

  previsualizar(detalle){
    this.fecha=detalle.fecha;
    console.log(this.fecha)
    this.servicio.atencion=this.fecha
    this.router.navigateByUrl("icons")
  }

}
