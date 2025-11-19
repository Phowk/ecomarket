import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  constructor(private firestore: Firestore){}
    agregarProducto(producto: any) {
    const ref = collection(this.firestore, 'productos');
    return addDoc(ref, producto);
  }
  getProductos(): Observable<any[]> {
    const ref = collection(this.firestore, 'productos');
    return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
  }
  
}
