import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory, InventoryCreate } from '../models/inventory.model';

@Injectable({ providedIn: 'root' })
export class InventoryService {

  private apiUrl = 'https://localhost:7230/api/inventory';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  getBySku(sku: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/sku/${sku}`);
  }

  getByProduct(productId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/product/${productId}`);
  }

  getFiltered(status?: string): Observable<Inventory[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Inventory[]>(`${this.apiUrl}/filter`, { params });
  }

  create(item: InventoryCreate): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }
}
