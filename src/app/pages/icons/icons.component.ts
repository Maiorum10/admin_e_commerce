import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../../servicios/servicio.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss']
})
export class IconsComponent implements OnInit {

  public copy: string;
  id_producto:any
  fecha:any
  nombre:any
  descripcion:any
  stock:any
  talla:any=''
  p_dia:any
  total:any
  imagen_1:any
  imagen_2:any
  imagen_3:any
  imagen_4:any
  imagen_5:any
  productos:any
  id_tienda:any
  bandera:any=0
  buscador:any
  imagen:any
  img:any
  imagenes:any
  id_imagen:any
  piezas:any
  productos_general:any
  productos_malos:any
  bandera_pdf:any=0
  categorias:any
  bandera_talla:any=0
  id_talla:any
  codigo_esetado:any=false
  constructor(
    private servicio:AccesoService,
    private router:Router
  ) { }

  ngOnInit() {
    this.id_tienda=localStorage.getItem('tienda')
    this.fechajs()
    document.getElementById('formulario_productos').style.display = 'none';
    document.getElementById('reporte_general').style.display = 'none';
    document.getElementById('reporte_malo').style.display = 'none';
    document.getElementById('reporte_uso').style.display = 'none';
    this.consultar_productos()

  }
  control_producto(){
    if(this.total==""){

    }else{
      let body={
        'accion': 'control_producto',
        'total': this.total
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let producto=res.datos;
            let id=producto[0].sucursales_id_sucursal
            if(id==this.id_tienda){
              Swal.fire('Producto ya existe','','warning')
              this.nombre=''
              this.talla=''
              this.total=''
            }
          }else{
          }
        });
      });
    }
  }
  nuevo(){
    if(this.bandera==0){
      document.getElementById('productos').style.display = 'none';
      document.getElementById('formulario_productos').style.display = 'block';
      this.nombre=""
      this.descripcion=""
      this.stock=""
      this.p_dia=""
      this.total=""
      this.talla=""
      this.categorias=""
      this.piezas=""
      this.codigo_esetado=false
    }else{
      this.bandera=1
      this.codigo_esetado=true
      document.getElementById('productos').style.display = 'none';
      document.getElementById('formulario_productos').style.display = 'block';
    }

  }
  regresar(){
    document.getElementById('productos').style.display = 'block';
    document.getElementById('formulario_productos').style.display = 'none';
    this.bandera=0
  }
  consultar_productos(){
    let body={
      'accion': 'consultar_productos_surcursal',
      'sucursales_id_sucursal': this.id_tienda
    }
    console.log(body)
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let producto=res.datos;
          this.productos=producto
        }else{
        }
      });
    });
}
consultar_productos_general(){
  this.bandera_pdf=2;
  let body={
    'accion': 'consultar_productos_general',
    'id_sucursal': this.id_tienda=localStorage.getItem('tienda')
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let producto=res.datos;
        this.productos_general=producto
      }else{
      }
    });
  });
}
consultar_productos_rentados(){
  this.bandera_pdf=3;
  let body={
    'accion': 'consultar_productos_rentados',
    'id_sucursal': this.id_tienda=localStorage.getItem('tienda')
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let producto=res.datos;
        this.productos_malos=producto
      }else{
        Swal.fire('No hay productos rentados','','warning')
      }
    });
  });
}
consultar_productos_habilitados(){
  this.bandera_pdf=2;
  let body={
    'accion': 'consultar_productos_habilitados',
    'id_sucursal': this.id_tienda=localStorage.getItem('tienda')
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let producto=res.datos;
        this.productos_general=producto
      }else{
        Swal.fire('No hay productos activos','','warning')
      }
    });
  });
}
consultar_productos_malos(){
  this.bandera_pdf=1;
  let body={
    'accion': 'consultar_productos_malos'
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let producto=res.datos;
        this.productos_malos=producto
      }else{
      }
    });
  });
}
consultar_productos_mantenimiento(){
  this.bandera_pdf=1;
  let body={
    'accion': 'consultar_productos_mantenimiento'
  }
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let producto=res.datos;
        this.productos_malos=producto
      }else{
      }
    });
  });
}
buscador_productos(){
  let body={
    'accion': 'buscador_productos',
    'nombre': '%'+this.buscador+'%'
  }
  console.log(body)
  return new Promise(resolve=>{
    this.servicio.postData(body).subscribe((res:any)=>{
      if(res.estado){
        let producto=res.datos;
        this.productos=producto
        console.log(producto)
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

    this.fecha = currentYear + "-" + mes + "-" + dia;

  }
  atrapar_id(a){
    this.id_producto=a.id_producto
    this.bandera=1
    this.nuevo()
    this.llenar_producto()
  }
  consulta_talla(){
    if(this.bandera==0){

    }else{
      let body={
        'accion': 'consultar_tallas_id_productos',
        'talla': this.talla,
        'id_producto': this.id_producto
      }
      return new Promise(resolve=>{
        this.servicio.postData(body).subscribe((res:any)=>{
          if(res.estado){
            let tallas=res.datos;
            this.id_talla=tallas[0].id_conjunto
            this.talla=tallas[0].talla
            this.stock=tallas[0].stock
            this.p_dia=tallas[0].precio_dia
            this.bandera_talla=1
          }else{
            Swal.fire('No existe productos con la talla '+this.talla,'Porfavor registre productos con la talla '+this.talla,'info')
            this.stock=''
            this.p_dia=''
            this.bandera_talla=2
          }
        });
      });
    }
  }
  llenar_producto(){
    let body={
      'accion': 'consultar_productos_id',
      'id_producto': this.id_producto
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let producto=res.datos;
          this.nombre=producto[0].nombre
          this.descripcion=producto[0].descripcion
          this.total=producto[0].total
          this.piezas=producto[0].piezas
          this.categorias=producto[0].categorias
        }else{
        }
      });
    });
  }
  guardar_producto(){
    if(this.nombre=='' || this.descripcion=='' || this.p_dia=='' || this.stock=='' || this.talla=='' || this.total=='' || this.piezas==''){
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Ingrese todos los campos',
        showConfirmButton: false,
        timer: 1500
      })
    }else{
      if(this.bandera==0){
        let body={
          'accion': 'crear_producto',
          'descripcion': this.descripcion,
          'nombre': this.nombre,
          'sucursales_id_sucursal': this.id_tienda,
          'total': this.total,
          'piezas': this.piezas,
          'categorias': this.categorias,
        }
        return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            if(res.estado){
              let body={
                'accion': 'consulta_ultimo_producto'
              }

              return new Promise(resolve=>{
                this.servicio.postData(body).subscribe((res:any)=>{
                  if(res.estado){
                    let producto= res.datos
                    this.id_producto=producto[0].id_producto
                    let body={
                      'accion': 'crear_tallas',
                      'precio_dia': this.p_dia,
                      'stock': this.stock,
                      'talla': this.talla,
                      'productos_id_producto': this.id_producto
                    }
                    return new Promise(resolve=>{
                      this.servicio.postData(body).subscribe((res:any)=>{
                        if(res.estado){
                          document.getElementById('productos').style.display = 'block';
                          document.getElementById('formulario_productos').style.display = 'none';
                          this.consultar_productos()
                          this.insertar_imagen()
                          Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Producto Creado con Éxito ',
                            showConfirmButton: false,
                            timer: 1500
                          })
                        }else{
                          Swal.fire('','Error al subir la imágen','info')
                        }
                      });
                    });

                  }else{
                    Swal.fire('Error al subir la imágen','','warning');
                  }
                },(err)=>{
                  Swal.fire('','Error de conexión','error');

                });
              });
            }else{
              Swal.fire('','Error al guardar','info')
            }
          });
        });
      }else if(this.bandera==1){
        let body={
          'accion': 'actualizar_producto',
          'descripcion': this.descripcion,
          'nombre': this.nombre,
          'precio_dia': this.p_dia,
          'stock': this.stock,
          'talla': this.talla,
          'sucursales_id_sucursal': this.id_tienda,
          'total': this.total,
          'piezas': this.piezas,
          'id_producto': this.id_producto
        }
        return new Promise(resolve=>{
          this.servicio.postData(body).subscribe((res:any)=>{
            if(res.estado){
              if(this.bandera_talla==1){
                let body={
                  'accion': 'actualizar_tallas',
                  'precio_dia': this.p_dia,
                  'stock': this.stock,
                  'talla': this.talla,
                  'id_conjunto': this.id_talla
                }
                return new Promise(resolve=>{
                  this.servicio.postData(body).subscribe((res:any)=>{
                    if(res.estado){
                      document.getElementById('productos').style.display = 'block';
                      document.getElementById('formulario_productos').style.display = 'none';
                      this.consultar_productos()
                      this.insertar_imagen()
                      Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Porducto Actualizado con Éxito ',
                        showConfirmButton: false,
                        timer: 1500
                      })
                    }else{
                      Swal.fire('','Error al subir la imágen','info')
                    }
                  });
                });
              }else if(this.bandera_talla==2){
                let body={
                  'accion': 'crear_tallas',
                  'precio_dia': this.p_dia,
                  'stock': this.stock,
                  'talla': this.talla,
                  'productos_id_producto': this.id_producto
                }
                return new Promise(resolve=>{
                  this.servicio.postData(body).subscribe((res:any)=>{
                    if(res.estado){
                      document.getElementById('productos').style.display = 'block';
                      document.getElementById('formulario_productos').style.display = 'none';
                      this.consultar_productos()
                      this.insertar_imagen()
                      Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Porducto Actualizado con Éxito ',
                        showConfirmButton: false,
                        timer: 1500
                      })
                    }else{
                      Swal.fire('','Error al subir la imágen','info')
                    }
                  });
                });
              }
            }else{
              Swal.fire('','Error al actualizar','info')
            }
          });
        });
      }
    }
  }
  consultar_imagenes(producto){
    this.stock=0
    this.id_imagen = producto.id_producto
    let body={
      'accion': 'consultar_fotos',
      'id_producto': this.id_imagen
    }
    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          this.imagenes=res.datos;
        }else{

        }
      },(err)=>{

      });
    });
  }
  get(event: any){
    this.imagen = event.target.files[0]
    this.img = event.target.files[0]
    this.servicio.guardarImagen(this.img).subscribe()
  }
  actualizar_imagen(c){
    let body={
      'accion': 'consultar_foto_portada',
      'productos_id_producto': this.id_imagen
    }

    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let imagen=res.datos;
          let id_foto=imagen[0].id_foto

          let body={
            'accion': 'actualizar_foto_portada',
            'detalle': this.imagen.name,
            'id_foto': id_foto
          }

          return new Promise(resolve=>{
            this.servicio.postData(body).subscribe((res:any)=>{
              if(res.estado){
                Swal.fire('Portada Actualizada con exito','','success')
              }else{
                Swal.fire('Error al subir la imágen','','warning');
              }
            },(err)=>{
              Swal.fire('','Error de conexión','error');

            });
          });
        }else{
          Swal.fire('Error al subir la imágen','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');

      });
    });
  }
  insertar_imagen_2(b){
    let id=b.id_producto
    let body={
      'accion': 'crear_imagen',
      'detalle': this.imagen.name,
      'productos_id_producto': this.id_imagen
    }

    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let imagen=res.datos;
        }else{
          Swal.fire('Error al subir la imágen','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');

      });
    });
  }
  insertar_imagen(){
    let body={
      'accion': 'crear_imagen',
      'detalle': this.imagen.name,
      'productos_id_producto': this.id_producto
    }

    return new Promise(resolve=>{
      this.servicio.postData(body).subscribe((res:any)=>{
        if(res.estado){
          let imagen=res.datos;
        }else{
          Swal.fire('Error al subir la imágen','','warning');
        }
      },(err)=>{
        Swal.fire('','Error de conexión','error');

      });
    });
  }
  pdf(){
    if(this.bandera_pdf==0){
      Swal.fire('No a seleccionado una opción','','warning')
    }else{
      if(this.bandera_pdf==1){
        document.getElementById('reporte_malo').style.display = 'block';
      let DATA: any = document.getElementById('reporte_malo');
      html2canvas(DATA).then((canvas) => {
        let fileWidth = canvas.width;
        let fileHeight = canvas.height;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'pt', [canvas.width, 1150]);
        let position = 5;
        PDF.addImage(FILEURI, 'JPEG', 5, position, fileWidth, fileHeight);
        PDF.save('reporte disfraz bajas.pdf');
        console.log(fileHeight+' '+fileWidth)
      });
      document.getElementById('reporte_malo').style.display = 'none';
      this.bandera_pdf=0
      this.total=0
      }else if(this.bandera_pdf==2){
        document.getElementById('reporte_general').style.display = 'block';
        let DATA: any = document.getElementById('reporte_general');
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
        document.getElementById('reporte_general').style.display = 'none';
        this.bandera_pdf=0
        this.total=0
      }else if(this.bandera_pdf==3){
        document.getElementById('reporte_uso').style.display = 'block';
        let DATA: any = document.getElementById('reporte_uso');
        html2canvas(DATA).then((canvas) => {
          let fileWidth = canvas.width;
          let fileHeight = canvas.height;
          const FILEURI = canvas.toDataURL('image/png');
          let PDF = new jsPDF('p', 'pt', [canvas.width, 1150]);
          let position = 5;
          PDF.addImage(FILEURI, 'JPEG', 5, position, fileWidth, fileHeight);
          PDF.save('reporte disfraz en uso.pdf');
          console.log(fileHeight+' '+fileWidth)
        });
        document.getElementById('reporte_uso').style.display = 'none';
        this.bandera_pdf=0
        this.total=0
      }
    }
  }
}
