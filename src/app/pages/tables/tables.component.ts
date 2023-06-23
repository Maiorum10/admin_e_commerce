import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/servicios/servicio.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  id_sucursal:any
  fecha:any
  a:any
  m:any
  d:any
  fecha_r:any=''
  nombre:any
  direccion:any
  telefono:any
  cuenta:any
  ciudad:any
  sucursales:any
  id_tienda:any
  bandera:any=0
  buscador:any
  informes:any
  informes2:any
  count:any
  total:any=0
  bandera_r:any=0
  rol:any
  direccion_dos:any
  constructor(private servicio: AccesoService,
    private router: Router,
    public datepipe: DatePipe
    ) { }

  ngOnInit() {
    if(localStorage.getItem('cargo')!='admin'){
      Swal.fire('Ventana administrativa','','warning')
      this.router.navigateByUrl("dashboard")
    }else{
      this.id_tienda=localStorage.getItem('tienda')
      this.rol=localStorage.getItem('rol')
      document.getElementById('formulario_sucursal').style.display = 'none';
      document.getElementById('pdf').style.display = 'none';
      document.getElementById('pdf2').style.display = 'none';
      this.consultar_sucursales()
      this.fechajs()
    }

  }
  trans_fecha(){
    if(this.fecha_r==''){
      Swal.fire('Ingrese una fecha','','warning')
    }else{
      this.a=this.datepipe.transform(this.fecha_r, 'yyyy')
      //console.log(this.a)
      this.m=this.datepipe.transform(this.fecha_r, 'M')
      //console.log(this.m)
      if(this.m==1 || this.m==2 || this.m==3 || this.m==4 || this.m==5 || this.m==6 || this.m==7 || this.m==8 || this.m==9){
        this.m='-0'+this.m
      }
      this.bandera_r='1'
      this.consultar_reportes()
    }
  }
  nuevo(){
    if(this.bandera==0){
      document.getElementById('sucursal').style.display = 'none';
      document.getElementById('formulario_sucursal').style.display = 'block';
      this.nombre=""
      this.direccion=""
      this.telefono=""
      this.cuenta=""
      this.ciudad=""
    }else{
      this.bandera=1
      document.getElementById('sucursal').style.display = 'none';
      document.getElementById('formulario_sucursal').style.display = 'block';
    }

  }
  regresar(){
    document.getElementById('sucursal').style.display = 'block';
    document.getElementById('formulario_sucursal').style.display = 'none';
    this.bandera=0
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
  fechajs(){
    let dia;
    let mes;
    const currentDate = new Date();

    const currentDayOfMonth = currentDate.getDate();
    const currentMonth = currentDate.getMonth()+1; // Be careful! January is 0, not 1
    const currentYear = currentDate.getFullYear();
    if(currentDayOfMonth<=9){
      dia='0'+currentDayOfMonth
    }else{
      dia=currentDayOfMonth
    }
    if(currentMonth<=9){
      mes='0'+currentMonth
    }else{
      mes=currentMonth
    }

    this.fecha_r = currentYear + "-" + mes + "-" + dia;
    this.fecha = currentYear + "-" + mes + "-" + dia;
    //console.log(this.fecha)
  }
  atrapar_id(a){
    this.id_sucursal=a.id_sucursal
    this.bandera=1
    this.nuevo()
    this.llenar_producto()
  }
  atrapar_id_reportes(a){
    this.id_sucursal=a.id_sucursal
    console.log(this.id_sucursal)
  }
  atrapar_id_reportes2(a){
    this.id_sucursal=a.id_sucursal
    this.consultar_reportes()
  }
  consulta_general(){
    this.bandera_r=0
    this.total=0
    this.consultar_reportes()
  }
  consultar_reportes(){
    if(this.bandera_r==1){

    }else{
      this.a=''
      this.m=''
    }
    let body={
      'accion': 'contar_reportes_sucursal',
      'sucursales_id_sucursal': this.id_sucursal,
      'fecha': '%'+this.a+this.m+'%'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let reserva=res.datos;
          this.count=reserva[0].contar
          this.count=this.count*1+0
          //console.log(this.count)
          let body={
            'accion': 'consultar_reportes_sucursal',
            'sucursales_id_sucursal': this.id_sucursal,
            'fecha': '%'+this.a+this.m+'%'
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                let reserva=res.datos;
                this.informes=reserva
                for(let a=1, c=0; a<=this.count; a++, c++){
                  let b = 0
                  b=b*1+reserva[c].total
                  this.total=this.total*1+b*1
                }
              }else{
                Swal.fire('NO EXISTEN REPORTES PARA LA FECHA SELECCIONADA','','warning')
                this.informes=[]
              }
            });
          });

        }else{
        }
      });
    });
  }
  reportes_diarios(){
    let body={
      'accion': 'contar_reportes_sucursal',
      'sucursales_id_sucursal': this.id_sucursal,
      'fecha': '%'+this.fecha+'%'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let reserva=res.datos;
          this.count=reserva[0].contar
          this.count=this.count*1+0
          //console.log(this.count)
          let body={
            'accion': 'consultar_reportes_sucursal',
            'sucursales_id_sucursal': this.id_sucursal,
            'fecha': '%'+this.fecha+'%'
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                let reserva=res.datos;
                this.informes=reserva
                for(let a=1, c=0; a<=this.count; a++, c++){
                  let b = 0
                  b=b*1+reserva[c].total
                  this.total=this.total*1+b*1
                }
              }else{
                Swal.fire('NO EXISTEN REPORTES PARA LA FECHA SELECCIONADA','','warning')
                this.informes=[]
              }
            });
          });

        }else{
        }
      });
    });
  }
  consulta_mas_vendido(){
    this.bandera_r=3
    this.total=0
    this.a=''
    this.m=''
    this.consultar_reportes_mas_menos()
  }

  consultar_reportes_mas_menos(){
    if(this.bandera_r==3){
      let body={
        'accion': 'consultar_reportes_mas_vendido',
        'sucursales_id_sucursal': this.id_sucursal
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let reserva=res.datos;
            this.informes2=reserva
          }else{
            this.informes2=[]
          }
        });
      });
    }
  }
  llenar_producto(){
    let body={
      'accion': 'consultar_sucursales_id',
      'id_sucursal': this.id_sucursal
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let sucursal=res.datos;
          this.nombre=sucursal[0].nombre_sucursal
          this.direccion=sucursal[0].direccion
          this.telefono=sucursal[0].telefono
          this.cuenta=sucursal[0].cuenta
          this.ciudad=sucursal[0].ciudad
          this.direccion_dos=sucursal[0].direccion_dos
        }else{
        }
      });
    });
  }
  buscador_sucursal(){
    let body={
      'accion': 'buscador_sucursales',
      'nombre_sucursal': '%'+this.buscador+'%',
      'ciudad': '%'+this.buscador+'%'
    }
    //console.log(body)
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
  guardar_sucursal(){
    if(this.bandera==0){
      let body={
        'accion': 'crear_sucursal',
        'nombre_sucursal': this.nombre,
        'direccion': this.direccion,
        'telefono': this.telefono,
        'cuenta': this.cuenta,
        'ciudad': this.ciudad,
        'direccion_dos': this.direccion_dos
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            document.getElementById('sucursal').style.display = 'block';
            document.getElementById('formulario_sucursal').style.display = 'none';
            this.consultar_sucursales()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Sucursal Creada con Éxito ',
              showConfirmButton: false,
              timer: 1500
            })
          }else{
          }
        });
      });
    }else if(this,this.bandera==1){
      let body={
        'accion': 'actualizar_sucursal',
        'nombre_sucursal': this.nombre,
        'direccion': this.direccion,
        'telefono': this.telefono,
        'cuenta': this.cuenta,
        'ciudad': this.ciudad,
        'direccion_dos': this.direccion_dos,
        'id_sucursal': this.id_sucursal
      }
      //console.log(body)
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            document.getElementById('sucursal').style.display = 'block';
            document.getElementById('formulario_sucursal').style.display = 'none';
            this.consultar_sucursales()
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Sucursal Actualizada con Éxito ',
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
  pdf(){
    if(this.bandera_r==0 || this.bandera_r==1){
      document.getElementById('pdf').style.display = 'block';
      let DATA: any = document.getElementById('pdf');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = canvas.width;
        let fileHeight = canvas.height;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'pt', [canvas.width, 750]);
        let position = 5;
        PDF.addImage(FILEURI, 'JPEG', 5, position, fileWidth, fileHeight);
        PDF.save('reporte.pdf');
        console.log(fileHeight+' '+fileWidth)
      });
      document.getElementById('pdf').style.display = 'none';
      this.total=0
    }else if(this.bandera_r==3 || this.bandera_r==4){
      document.getElementById('pdf2').style.display = 'block';
      let DATA: any = document.getElementById('pdf2');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = canvas.width;
        let fileHeight = canvas.height;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'pt', [canvas.width, 950]);
        let position = 5;
        PDF.addImage(FILEURI, 'JPEG', 5, position, fileWidth, fileHeight);
        PDF.save('reporte.pdf');
        console.log(fileHeight+' '+fileWidth)
      });
      document.getElementById('pdf2').style.display = 'none';
      this.total=0
    }

  }
}
