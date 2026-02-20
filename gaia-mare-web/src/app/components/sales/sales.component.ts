import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../services/sale.service';
import { InventoryService } from '../../services/inventory.service';
import { Sale, SaleCreate } from '../../models/sale.model';
import { Inventory } from '../../models/inventory.model';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Ventas</h1>
          <p class="text-gray-500 mt-1">Registro y gestión de ventas</p>
        </div>
        <button (click)="showNewSale = !showNewSale"
                class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium 
                       transition-all shadow-sm hover:shadow-md flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nueva Venta
        </button>
      </div>

      <!-- Formulario nueva venta -->
      <div *ngIf="showNewSale" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-6">Registrar Nueva Venta</h2>

        <!-- Paso 1: Seleccionar item disponible -->
        <div class="mb-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">1. Selecciona un ítem disponible</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
            <button *ngFor="let item of availableItems"
                    (click)="selectItem(item)"
                    [class]="newSale.inventoryId === item.inventoryId ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'"
                    class="border rounded-xl p-3 text-left transition-all">
              <p class="text-sm font-semibold text-gray-900">{{ item.productName }}</p>
              <p class="text-xs text-gray-500 mt-1">Producto #{{ item.productId }} · {{ item.location || 'Sin ubicación' }}</p>
            </button>
          </div>
          <p *ngIf="availableItems.length === 0" class="text-sm text-gray-400 mt-2">
            No hay ítems disponibles. Todos están vendidos.
          </p>
        </div>

        <!-- Paso 2: Detalles de la venta -->
        <div *ngIf="newSale.inventoryId > 0">
          <h3 class="text-sm font-semibold text-gray-700 mb-3">2. Detalles de la venta</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Precio Final (€)</label>
              <input [(ngModel)]="newSale.finalPrice" type="number" step="0.01" min="0.01" placeholder="89.99"
                     class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Método de Pago</label>
              <select [(ngModel)]="newSale.paymentMethod"
                      class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all bg-white">
                <option value="">Seleccionar...</option>
                <option value="Efectivo">💵 Efectivo</option>
                <option value="Tarjeta">💳 Tarjeta</option>
                <option value="Transferencia">🏦 Transferencia</option>
                <option value="Bizum">📱 Bizum</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Descuento (€)</label>
              <input [(ngModel)]="newSale.discountApplied" type="number" step="0.01" placeholder="0.00"
                     class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">ID Cliente (opcional)</label>
              <input [(ngModel)]="newSale.clientId" type="number" placeholder="—"
                     class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-3 mt-6">
            <button (click)="cancelSale()" 
                    class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium">
              Cancelar
            </button>
            <button (click)="submitSale()"
                    [disabled]="!canSubmit()"
                    [class]="canSubmit() ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-gray-300 cursor-not-allowed'"
                    class="px-5 py-2.5 rounded-xl text-white transition-all font-medium">
              Confirmar Venta
            </button>
          </div>
        </div>
      </div>

      <!-- Mensaje de éxito -->
      <div *ngIf="successMessage" class="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 flex items-center gap-3">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-medium">{{ successMessage }}</span>
      </div>

      <!-- Mensaje de error -->
      <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-center gap-3">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="font-medium">{{ errorMessage }}</span>
      </div>

      <!-- Tabla de Ventas Registradas -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Ventas Registradas</h2>
          <p class="text-sm text-gray-500">Historial completo de ventas con detalles</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/80">
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID Venta</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventario ID</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio Final</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Método Pago</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Descuento</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente ID</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let sale of sales" class="hover:bg-green-50/30 transition-colors">
                <td class="px-6 py-4 text-sm font-mono text-gray-500">#{{ sale.saleId }}</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">#{{ sale.inventoryId }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ sale.saleDate | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="px-6 py-4">
                  <span class="text-sm font-semibold text-green-600">{{ sale.finalPrice | currency:'EUR' }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                    {{ sale.paymentMethod || '—' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ sale.discountApplied ? (sale.discountApplied | currency:'EUR') : '—' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ sale.clientId || '—' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="sales.length === 0" class="p-12 text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="text-gray-500 font-medium">No hay ventas registradas aún</p>
          <p class="text-gray-400 text-sm mt-1">Registra tu primera venta con el botón de arriba</p>
        </div>
      </div>

      <!-- Ítems vendidos recientemente -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-lg font-semibold text-gray-900">Ítems Vendidos</h2>
          <p class="text-sm text-gray-500">Últimas unidades marcadas como vendidas</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/80">
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto ID</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let item of soldItems" class="hover:bg-purple-50/30 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-500 font-mono">#{{ item.inventoryId }}</td>
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded font-mono">{{ item.sku }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ item.productId }}</td>
                <td class="px-6 py-4">
                  <span class="text-xs font-semibold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                    🟣 Vendido
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ item.location || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div *ngIf="soldItems.length === 0" class="p-12 text-center">
          <p class="text-gray-500 font-medium">No hay ítems vendidos</p>
          <p class="text-gray-400 text-sm mt-1">Los ítems aparecerán aquí cuando realices una venta</p>
        </div>
      </div>

    </div>
  `
})
export class SalesComponent implements OnInit {
  showNewSale = false;
  availableItems: Inventory[] = [];
  soldItems: Inventory[] = [];
  sales: Sale[] = [];
  successMessage = '';
  errorMessage = '';

  newSale: SaleCreate = {
    inventoryId: 0,
    finalPrice: 0,
    paymentMethod: '',
    discountApplied: undefined,
    clientId: undefined
  };

  constructor(
    private saleService: SaleService,
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.inventoryService.getFiltered('Stock').subscribe({
      next: (data) => {
        this.availableItems = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando disponibles:', err)
    });

    this.inventoryService.getFiltered('Vendido').subscribe({
      next: (data) => {
        this.soldItems = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando vendidos:', err)
    });

    this.saleService.getAll().subscribe({
      next: (data) => {
        this.sales = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando ventas:', err)
    });
  }

  selectItem(item: Inventory) {
    this.newSale.inventoryId = item.inventoryId;
  }

  canSubmit(): boolean {
    return this.newSale.inventoryId > 0 &&
           this.newSale.finalPrice > 0 &&
           this.newSale.paymentMethod !== '';
  }

  submitSale() {
    this.successMessage = '';
    this.errorMessage = '';

    this.saleService.create(this.newSale).subscribe({
      next: (res) => {
        this.successMessage = `¡Venta registrada! Inventario #${this.newSale.inventoryId} marcado como vendido.`;
        this.showNewSale = false;
        this.resetForm();
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error || 'Error al registrar la venta';
      }
    });
  }

  cancelSale() {
    this.showNewSale = false;
    this.resetForm();
  }

  resetForm() {
    this.newSale = {
      inventoryId: 0,
      finalPrice: 0,
      paymentMethod: '',
      discountApplied: undefined,
      clientId: undefined
    };
  }
}
