import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SaleCreate } from '../models/sale.model';

@Injectable({ providedIn: 'root' })
export class SaleService {

  private apiUrl = 'https://localhost:7230/api/sales';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  create(sale: SaleCreate): Observable<any> {
    return this.http.post(this.apiUrl, sale);
  }
}
