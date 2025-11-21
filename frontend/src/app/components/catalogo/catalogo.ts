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

  // filtros
  categoriaFiltro: string = 'Todas';
  productorFiltro: string = 'Todas';
  precioMaxFiltro: number | null = null;


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


  get productosFiltrados(): any[] {
    return this.productos.filter(p => {
      const cumpleCategoria = this.categoriaFiltro === 'Todas' || p.categoria === this.categoriaFiltro;
      const cumpleProductor = this.productorFiltro === 'Todas' || p.productor === this.productorFiltro;
      const cumplePrecio = !this.precioMaxFiltro || p.precio <= this.precioMaxFiltro;

      return cumpleCategoria && cumpleProductor && cumplePrecio;
    });
  }

}
