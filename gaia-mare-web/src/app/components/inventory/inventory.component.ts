import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { Inventory, InventoryCreate } from '../../models/inventory.model';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Inventario</h1>
          <p class="text-gray-500 mt-1">Control de stock y unidades físicas</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            {{ inStockCount }} disponibles
          </span>
          <span class="bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1.5 rounded-full">
            {{ soldCount }} vendidos
          </span>
          <button (click)="showForm = !showForm"
                  class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium 
                         transition-all shadow-sm hover:shadow-md flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo Ítem
          </button>
        </div>
      </div>

      <!-- Formulario nuevo ítem -->
      <div *ngIf="showForm" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Añadir Ítem al Inventario</h2>

        <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-sm text-green-700">{{ successMessage }}</span>
        </div>

        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="text-sm text-red-700">{{ errorMessage }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Producto *</label>
            <input [(ngModel)]="newItem.productId" type="number" placeholder="2"
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
            <input [(ngModel)]="newItem.quantity" type="number" min="1" placeholder="1"
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input [(ngModel)]="newItem.location" type="text" placeholder="Almacén Central - A1"
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button (click)="cancelForm()" class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium">
            Cancelar
          </button>
          <button (click)="saveItem()" 
                  [disabled]="!canSave()"
                  [class]="canSave() ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-gray-300 cursor-not-allowed'"
                  class="px-5 py-2.5 rounded-xl text-white transition-all font-medium">
            Guardar Ítem
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-wrap items-center gap-3">
          <span class="text-sm font-medium text-gray-600">Estado:</span>
          <button (click)="filterByStatus('')"
                  [class]="!currentFilter ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all">
            Todos
          </button>
          <button (click)="filterByStatus('Stock')"
                  [class]="currentFilter === 'Stock' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all">
            🟢 Stock
          </button>
          <button (click)="filterByStatus('Vendido')"
                  [class]="currentFilter === 'Vendido' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all">
            🟣 Vendido
          </button>
          <div class="ml-auto flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input [(ngModel)]="searchSku" type="text" placeholder="Buscar SKU..." 
                   (input)="searchBySku()"
                   class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-52">
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/80">
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha Llegada</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr *ngFor="let item of inventory" class="hover:bg-green-50/30 transition-colors">
                <td class="px-6 py-4 text-sm text-gray-500 font-mono">#{{ item.inventoryId }}</td>
                <td class="px-6 py-4">
                  <span class="text-sm font-semibold text-gray-900">{{ item.productName }}</span>
                  <p class="text-xs text-gray-500">Producto #{{ item.productId }}</p>
                </td>
                <td class="px-6 py-4">
                  <span [class]="item.status === 'Stock' ? 'bg-green-100 text-green-700' : 
                                 item.status === 'Vendido' ? 'bg-purple-100 text-purple-700' : 
                                 'bg-gray-100 text-gray-700'"
                        class="text-xs font-semibold px-2.5 py-1 rounded-full">
                    {{ item.status === 'Stock' ? '🟢' : item.status === 'Vendido' ? '🟣' : '⚪' }}
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ item.location || '—' }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ item.arrivalDate | date:'dd/MM/yyyy' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Vacío -->
        <div *ngIf="inventory.length === 0" class="p-12 text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <p class="text-gray-500 font-medium">No hay elementos en el inventario</p>
        </div>
      </div>

    </div>
  `
})
export class InventoryComponent implements OnInit {
  inventory: Inventory[] = [];
  currentFilter = '';
  searchSku = '';
  inStockCount = 0;
  soldCount = 0;
  showForm = false;
  successMessage = '';
  errorMessage = '';

  newItem: InventoryCreate = {
    productId: 0,
    quantity: 1,
    status: 'Stock',
    location: ''
  };

  constructor(
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInventory();
  }

  loadInventory() {
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.inventory = data;
        this.inStockCount = data.filter(i => i.status === 'Stock').length;
        this.soldCount = data.filter(i => i.status === 'Vendido').length;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando inventario:', err)
    });
  }

  filterByStatus(status: string) {
    this.currentFilter = status;
    this.searchSku = '';
    if (status) {
      this.inventoryService.getFiltered(status).subscribe({
        next: (data) => {
          this.inventory = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error filtrando:', err)
      });
    } else {
      this.loadInventory();
    }
  }

  searchBySku() {
    if (this.searchSku.length >= 3) {
      this.inventoryService.getBySku(this.searchSku).subscribe({
        next: (data) => this.inventory = [data],
        error: () => this.inventory = []
      });
    } else if (this.searchSku.length === 0) {
      this.loadInventory();
    }
  }

  canSave(): boolean {
    return this.newItem.productId > 0 && this.newItem.quantity > 0;
  }

  saveItem() {
    this.errorMessage = '';
    this.successMessage = '';

    this.inventoryService.create(this.newItem).subscribe({
      next: (response: any) => {
        this.successMessage = response.message || `${response.count} ítem(s) agregado(s) correctamente`;
        this.resetForm();
        this.loadInventory();
        setTimeout(() => {
          this.successMessage = '';
          this.showForm = false;
        }, 2500);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Error al crear el ítem';
        this.cdr.detectChanges();
      }
    });
  }

  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  resetForm() {
    this.newItem = {
      productId: 0,
      quantity: 1,
      status: 'Stock',
      location: ''
    };
    this.errorMessage = '';
  }
}
