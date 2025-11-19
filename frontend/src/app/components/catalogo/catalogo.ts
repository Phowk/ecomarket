import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { FormsModule } from '@angular/forms';
import productos from '../../../assets/productos.json';
import { ProductosService } from '../../services/productos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {

  productos: any[] = [];

  ngOnInit(): void {
    this.productosService.getProductos().subscribe(productos => {
      this.productos = productos;
      console.log("Productos cargados:", productos);
    });
  }

  constructor(private auth: AuthService, private productosService: ProductosService) {
    console.log('Catalogo component: Constructor called.');
  }
  cargarProductos() {
    productos.forEach(producto => {
      this.productosService.agregarProducto(producto)
        .then(() => console.log("Producto insertado:", producto.nombre))
        .catch(err => console.error(err));
    });
  }

  logout() {
    this.auth.signOut();
    window.location.href = '/login';
  }
}
