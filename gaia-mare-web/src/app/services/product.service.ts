import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductStock, ProductCreate } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private apiUrl = 'https://localhost:7230/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getWithStock(): Observable<ProductStock[]> {
    return this.http.get<ProductStock[]>(`${this.apiUrl}/stock`);
  }

  getFiltered(collection?: string, material?: string): Observable<Product[]> {
    let params = new HttpParams();
    if (collection) params = params.set('collection', collection);
    if (material) params = params.set('material', material);
    return this.http.get<Product[]>(`${this.apiUrl}/filter`, { params });
  }

  create(product: ProductCreate): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
}
