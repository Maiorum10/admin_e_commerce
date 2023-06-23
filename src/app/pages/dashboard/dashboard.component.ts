import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { Router } from '@angular/router';
import { AccesoService } from 'src/app/servicios/servicio.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  reservas:any;
  id_empleado:any='0';
  id_tienda:any='0'
  id_reserva:any
  fecha:any='';
  total:any=0
  count:any
  detalles:any
  cantidad:any
  id_producto2:any
  subtotal2:any
  base_stock:any
  total_stock:any
  imagen:any
  nombre_u:any
  apellido_u:any
  cedula:any
  fecha_u:any
  buscador:any
  estado:any=0
  piezas:any
  estado2:any
  estado3:any
  combo_estado:any=false
  subtotaliva:any
  iva12:any
  iva8:any
  ivas:any='IVA 12%'
  talla2:any
  detalles2:any
  sucursal:any
  nombre_sur:any
  telefono_sur:any
  numero:any
  prenda:any=''
  prenda_estado:any=false
  direccion_emp:any
  direccion_usu:any
  telefono_usu:any
  total_final:any=0
  constructor(private servicio: AccesoService,
    private router: Router) { }

  ngOnInit() {

    this.id_tienda=localStorage.getItem('tienda')
    this.id_empleado=localStorage.getItem('id')
    this.fechajs();
    this.consultar_reservas();
    this.llenar_producto()
    if(localStorage.getItem('id')=='0' || localStorage.getItem('id')=='' || localStorage.getItem('id')==null){
      Swal.fire('Iniciar sesion','','warning')
      this.router.navigateByUrl("login")
    }
    document.getElementById('factura').style.display = 'none';
    document.getElementById('reservas').style.display = 'block';
    document.getElementById('factura_pdf').style.display = 'none';

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});

  }
  llenar_producto(){
    let body={
      'accion': 'consultar_sucursales_id',
      'id_sucursal': this.id_tienda
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.sucursal=res.datos;
          this.nombre_sur=this.sucursal[0].nombre_sucursal
          this.telefono_sur=this.sucursal[0].telefono
          this.direccion_emp=this.sucursal[0].direccion_dos
        }else{
        }
      });
    });
  }
  buscador_cedula(){
    let body={
      'accion': 'consultar_reservas_pendientes_cedula',
      'sucursales_id_sucursal': this.id_tienda,
      'cedula': '%'+this.buscador+'%',
      'estado': '%'+this.buscador+'%'
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let reserva=res.datos;
          this.reservas=reserva
        }else{
        }
      });
    });
  }
  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
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

    this.fecha = currentYear + "-" + mes + "-" + dia;
    //console.log(this.fecha)
  }

  consultar_reservas(){
      let body={
        'accion': 'consultar_reservas_pendientes',
        'sucursales_id_sucursal': this.id_tienda,
        'estado': 'pendiente'
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let reserva=res.datos;
            this.reservas=reserva
          }else{
          }
        });
      });
  }
  aprobar(){
    let body={
      'accion': 'actualizar_estado_reservas',
      'estado': 'aprobado',
      'id_reserva': this.id_reserva
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.consultar_reservas();
          this.regresar()
        }else{
        }
      });
    });
  }
  guardar_prenda(){
    let body={
      'accion': 'insertar_prenda',
      'prenda': this.prenda,
      'id_reserva': this.id_reserva
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Prenda guardada con exito',
            showConfirmButton: false,
            timer: 1500
          })
        }else{
        }
      });
    });
  }
  cancelar(){
    let body={
      'accion': 'actualizar_estado_reservas',
      'estado': 'cancelado',
      'id_reserva': this.id_reserva
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.consultar_reservas();
          this.aumentar_stock()
          this.regresar()
        }else{
        }
      });
    });
  }
  finalizar(){
    let body={
      'accion': 'actualizar_estado_reservas',
      'estado': 'finalizado',
      'id_reserva': this.id_reserva
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.consultar_reservas();
          this.aumentar_stock()
          this.regresar()
        }else{
        }
      });
    });
  }
  reenviar(){
    let body={
      'accion': 'actualizar_estado_reservas',
      'estado': 'reenviar',
      'id_reserva': this.id_reserva
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.consultar_reservas();
          this.regresar()
        }else{
        }
      });
    });
  }
  aumentar_stock(){
    let body={
      'accion': 'contar_detalle_reservas_pendientes',
      'sucursales_id_sucursal': this.id_tienda,
      'estado': 'pendiente',
      'id_reserva': this.id_reserva
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let reserva=res.datos;
          this.count=reserva[0].contar
          this.count=this.count*1+0
          let body={
            'accion': 'consultar_detalle_reservas_pendientes',
            'sucursales_id_sucursal': this.id_tienda,
            'estado': 'pendiente',
            'id_reserva': this.id_reserva
          }
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                let reserva=res.datos;
                this.detalles=reserva
                for(let i=0; i<this.count; i++){
                  this.cantidad=this.detalles[i].cantidad
                  this.id_producto2=this.detalles[i].conjuntos_id_conjunto
                  this.subtotal2=this.detalles[i].sub_total
                  this.estado2=this.detalles[i].estado
                  this.talla2=this.detalles[i].talla
                  if(this.estado2=='Malo'){

                  }else{
                    let body2={
                      'accion': 'consulta_stock',
                      'id_conjunto': this.id_producto2,
                      'talla': this.talla2
                    }
                    this.servicio.postData(body2).subscribe((res:any)=>{
                      this.id_producto2=this.detalles[i].conjuntos_id_conjunto
                      this.talla2=this.detalles[i].talla
                      this.cantidad=this.detalles[i].cantidad
                      let stocks= res.datos
                      this.base_stock= stocks[0].stock
                      this.total_stock=0
                      this.total_stock=this.base_stock*1+this.cantidad*1
                      console.log(this.total_stock+'---'+this.base_stock+'---'+this.cantidad+'-id-'+this.id_producto2+'-talla-'+this.talla2)
                      let body3={
                        'accion': 'actualizar_stock',
                        'stock': this.total_stock,
                        'id_conjunto': this.id_producto2,
                        'talla': this.talla2
                      }
                      console.log(body3)
                      this.servicio.postData(body3).subscribe((res:any)=>{
                      if(res.estado){
                      }else{
                      }
                      },(err)=>{
                      });
                    })
                  }

                }
              }else{
              }
            });
          });

        }else{
        }
      });
    });
  }
  iva(){
    if(this.ivas=='IVA 12%'){
      this.iva12=(this.total*1)*0.12
      this.subtotaliva=(this.total*1)-(this.iva12*1)
    }else if(this.ivas=='IVA 8%'){
      this.iva12=(this.total*1)*0.08
      this.subtotaliva=(this.total*1)-(this.iva12*1)
    }
  }
  consultar_detalle_reservas(){
    let body={
      'accion': 'contar_detalle_reservas_pendientes',
      'sucursales_id_sucursal': this.id_tienda,
      'id_reserva': this.id_reserva
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let reserva=res.datos;
          this.count=reserva[0].contar
          this.count=this.count*1+0
          let body={
            'accion': 'consultar_detalle_reservas_pendientes',
            'sucursales_id_sucursal': this.id_tienda,
            'id_reserva': this.id_reserva
          }
          console.log(body)
          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                let reserva=res.datos;
                this.detalles=reserva
                this.nombre_u=reserva[0].nombre_u
                this.apellido_u=reserva[0].apellido_u
                this.cedula=reserva[0].cedula
                this.fecha_u=reserva[0].fecha
                this.prenda=reserva[0].prenda
                this.direccion_usu=reserva[0].direccion
                this.telefono_usu=reserva[0].telefono
                for(let a=0; a<this.count; a++){
                  let b = 0
                  b=b*1+reserva[a].sub_total
                  if(this.estado3=='finalizado'){
                    if(reserva[a].estado=='Mantenimiento'){
                      this.combo_estado=false
                    }else{
                      this.combo_estado=true
                    }
                  }
                  this.total=this.total*1+b*1
                  this.iva()
                }
              }else{
              }
            });
          });

        }else{
        }
      });
    });
  }
  bueno(a){

    let body={
      'accion': 'actualizar_detalle',
      'estado': 'Bueno',
      'id_detalle_reserva': a
    }

    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.total=0
          this.estado=0
          this.consultar_detalle_reservas()
        }else{
        }
      });
    });
  }
  mantenimiento(a){

    let body={
      'accion': 'actualizar_detalle',
      'estado': 'Mantenimiento',
      'id_detalle_reserva': a
    }

    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.total=0
          this.estado=0
          this.consultar_detalle_reservas()
        }else{
        }
      });
    });
  }
  malo(a){

    let body={
      'accion': 'actualizar_detalle',
      'estado': 'Malo',
      'id_detalle_reserva': a
    }

    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.total=0
          this.estado=0
          this.consultar_detalle_reservas()
        }else{
        }
      });
    });
  }
  atrapar_id(a){
    this.id_reserva=a.id_reserva
    let estado=a.estado
    this.estado3=a.estado
    this.numero=a.id_reserva
    this.combo_estado=false
    this.prenda_estado=false
    this.imagen=a.imagen
    this.subtotaliva=0
    this.iva12=0
    this.estado=0;
    this.prenda=""
    this.total_final=a.total
    if(estado=='pendiente' || estado=='reenviar'){
      if(this.imagen==null){
        document.getElementById('btn_foto').style.display = 'none';
      }else{
        document.getElementById('btn_foto').style.display = 'block';
      }
      document.getElementById('factura').style.display = 'block';
      document.getElementById('reservas').style.display = 'none';
      document.getElementById('btn_aprobado').style.display = 'block';
      document.getElementById('btn_cancelado').style.display = 'block';
      document.getElementById('btn_finalizado').style.display = 'block';
      document.getElementById('btn_reenviar').style.display = 'block';
      document.getElementById('btn_reporte').style.display = 'none';
      document.getElementById('btn_prenda').style.display = 'block';
      this.consultar_detalle_reservas()
    }else if(estado=='cancelado'){
      if(this.imagen==null){
        document.getElementById('btn_foto').style.display = 'none';
      }else{
        document.getElementById('btn_foto').style.display = 'block';
      }
      document.getElementById('factura').style.display = 'block';
      document.getElementById('reservas').style.display = 'none';
      document.getElementById('btn_aprobado').style.display = 'none';
      document.getElementById('btn_cancelado').style.display = 'none';
      document.getElementById('btn_finalizado').style.display = 'none';
      document.getElementById('btn_reenviar').style.display = 'none';
      document.getElementById('btn_reporte').style.display = 'none';
      document.getElementById('btn_prenda').style.display = 'none';
      this.prenda_estado=true
      this.consultar_detalle_reservas()
    }else if(estado=='aprobado'){
      if(this.imagen==null){
        document.getElementById('btn_foto').style.display = 'none';
      }else{
        document.getElementById('btn_foto').style.display = 'block';
      }
      document.getElementById('factura').style.display = 'block';
      document.getElementById('reservas').style.display = 'none';
      document.getElementById('btn_aprobado').style.display = 'none';
      document.getElementById('btn_cancelado').style.display = 'none';
      document.getElementById('btn_finalizado').style.display = 'block';
      document.getElementById('btn_reenviar').style.display = 'block';
      document.getElementById('btn_reporte').style.display = 'block';
      document.getElementById('btn_prenda').style.display = 'block';
      this.prenda_estado=false
      this.consultar_detalle_reservas()
    }else if(estado=='finalizado'){
      if(this.imagen==null){
        document.getElementById('btn_foto').style.display = 'none';
      }else{
        document.getElementById('btn_foto').style.display = 'block';
      }
      document.getElementById('factura').style.display = 'block';
      document.getElementById('reservas').style.display = 'none';
      document.getElementById('btn_aprobado').style.display = 'none';
      document.getElementById('btn_cancelado').style.display = 'none';
      document.getElementById('btn_finalizado').style.display = 'none';
      document.getElementById('btn_reenviar').style.display = 'none';
      document.getElementById('btn_prenda').style.display = 'none';
      document.getElementById('btn_reporte').style.display = 'block';
      this.consultar_detalle_reservas()
      this.prenda_estado=true
    }
  }
  regresar(){
    this.total=0
    document.getElementById('factura').style.display = 'none';
    document.getElementById('reservas').style.display = 'block';
  }
  pdf(){
    document.getElementById('factura_pdf').style.display = 'block';
    let DATA: any = document.getElementById('factura_pdf');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = canvas.width;
      let fileHeight = canvas.height;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'pt', [canvas.width, 1150]);
      let position = 5;
      PDF.addImage(FILEURI, 'JPEG', 5, position, fileWidth, fileHeight);
      PDF.save('reporte disfraz general.pdf');
      console.log(fileHeight+' '+fileWidth)
    });
    document.getElementById('factura_pdf').style.display = 'none';
  }

}
