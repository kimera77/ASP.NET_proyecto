import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { InventoryService } from '../../services/inventory.service';
import { ProductStock } from '../../models/product.model';
import { Inventory } from '../../models/inventory.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">

      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-500 mt-1">Resumen general de GaiaMare</p>
      </div>

      <!-- Tarjetas KPI -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Productos</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalProducts }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Stock Disponible</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalInStock }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Vendidos</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalSold }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Inventario</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalInventory }}</p>
            </div>
            <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos con Stock -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Productos con Stock</h2>
            <p class="text-sm text-gray-500">Vista rápida del catálogo</p>
          </div>
          <a routerLink="/products" class="text-sm text-green-600 hover:text-green-700 font-medium">Ver todos →</a>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let product of productsStock.slice(0, 6)" 
                 class="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-all">
              <div class="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <img *ngIf="product.imageUrl" [src]="getImageUrl(product.imageUrl)" 
                     class="w-12 h-12 object-cover rounded-lg" [alt]="product.name">
                <span *ngIf="!product.imageUrl" class="text-green-600 font-bold text-lg">
                  {{ product.name.charAt(0) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-medium text-gray-900 truncate">{{ product.name }}</p>
                <p class="text-sm text-gray-500">{{ product.price | currency:'EUR' }}</p>
              </div>
              <div class="text-right">
                <span [class]="product.totalStock > 3 ? 'bg-green-100 text-green-700' : product.totalStock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'"
                      class="text-xs font-semibold px-2.5 py-1 rounded-full">
                  {{ product.totalStock }} uds
                </span>
              </div>
            </div>
          </div>
          <div *ngIf="productsStock.length === 0" class="text-center py-12 text-gray-400">
            <p>No hay productos disponibles</p>
          </div>
        </div>
      </div>

    </div>
  `
})
export class DashboardComponent implements OnInit {
  productsStock: ProductStock[] = [];
  inventory: Inventory[] = [];
  totalProducts = 0;
  totalInStock = 0;
  totalSold = 0;
  totalInventory = 0;

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return '';
    // Si ya empieza con 'images/', devolver tal cual
    if (imageUrl.startsWith('images/')) return imageUrl;
    // Si es una ruta completa (http/https), devolver tal cual
    if (imageUrl.startsWith('http')) return imageUrl;
    // Si no, asumir que es solo el nombre del archivo y añadir 'images/'
    return `images/${imageUrl}`;
  }

  ngOnInit() {
    console.log('🔵 Dashboard ngOnInit ejecutado');
    console.log('🔵 ProductService:', this.productService);
    console.log('🔵 InventoryService:', this.inventoryService);

    this.productService.getWithStock().subscribe({
      next: (data) => {
        console.log('✅ Productos recibidos:', data);
        this.productsStock = data;
        this.totalProducts = data.length;
        this.totalInStock = data.reduce((sum, p) => sum + p.totalStock, 0);
        console.log('📊 totalProducts asignado:', this.totalProducts);
        console.log('📊 totalInStock asignado:', this.totalInStock);
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (err) => {
        console.error('❌ Error cargando productos:', err);
      }
    });

    this.inventoryService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Inventario recibido:', data);
        this.inventory = data;
        this.totalInventory = data.length;
        this.totalSold = data.filter(i => i.status === 'Vendido').length;
        console.log('📊 totalInventory asignado:', this.totalInventory);
        console.log('📊 totalSold asignado:', this.totalSold);
        this.cdr.detectChanges(); // Forzar detección de cambios
      },
      error: (err) => {
        console.error('❌ Error cargando inventario:', err);
      }
    });
  }
}
