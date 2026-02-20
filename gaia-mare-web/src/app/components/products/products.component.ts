import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductStock, ProductCreate } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Productos</h1>
          <p class="text-gray-500 mt-1">Catálogo de productos de GaiaMare</p>
        </div>
        <button (click)="showForm = !showForm"
                class="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium 
                       transition-all shadow-sm hover:shadow-md flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo Producto
        </button>
      </div>

      <!-- Formulario nuevo producto -->
      <div *ngIf="showForm" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Añadir Producto</h2>

        <!-- Mensaje de éxito -->
        <div *ngIf="successMessage" class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span class="text-sm text-green-700">{{ successMessage }}</span>
        </div>

        <!-- Mensaje de error -->
        <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span class="text-sm text-red-700">{{ errorMessage }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input [(ngModel)]="newProduct.name" type="text" placeholder="Ej: Bolso Tote Marrón" 
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio Base (€) *</label>
            <input [(ngModel)]="newProduct.basePrice" type="number" placeholder="89.99"
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Colección</label>
            <input [(ngModel)]="newProduct.collection" type="text" placeholder="Ej: Verano"
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <input [(ngModel)]="newProduct.material" type="text" placeholder="Ej: Piel"
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input [(ngModel)]="newProduct.color" type="text" placeholder="Ej: Marrón"
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
            <input [(ngModel)]="newProduct.imageUrl" type="text" placeholder="images/producto.jpg"
                   class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all">
          </div>
        </div>
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea [(ngModel)]="newProduct.description" rows="2" placeholder="Descripción del producto..."
                    class="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none">
          </textarea>
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <button (click)="cancelNewProduct()" class="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all font-medium">
            Cancelar
          </button>
          <button (click)="saveProduct()"
                  [disabled]="!canSaveProduct() || isSaving"
                  [class]="canSaveProduct() && !isSaving ? 'bg-green-600 hover:bg-green-700 shadow-sm' : 'bg-gray-300 cursor-not-allowed'"
                  class="px-5 py-2.5 rounded-xl text-white transition-all font-medium">
            {{ isSaving ? 'Guardando...' : 'Guardar Producto' }}
          </button>
        </div>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
            </svg>
            <span class="text-sm font-medium text-gray-600">Filtros:</span>
          </div>
          <input [(ngModel)]="filterCollection" type="text" placeholder="Colección..." 
                 (input)="applyFilters()"
                 class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-40">
          <input [(ngModel)]="filterMaterial" type="text" placeholder="Material..." 
                 (input)="applyFilters()"
                 class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-40">
          <button *ngIf="filterCollection || filterMaterial" (click)="clearFilters()"
                  class="text-sm text-red-500 hover:text-red-600 font-medium">
            ✕ Limpiar
          </button>
          <span class="ml-auto text-sm text-gray-400">{{ products.length }} productos</span>
        </div>
      </div>

      <!-- Lista de productos como tarjetas -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div *ngFor="let product of products" 
             class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
          
          <!-- Imagen del producto -->
          <div class="h-48 bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center overflow-hidden">
            <img *ngIf="product.imageUrl" [src]="getImageUrl(product.imageUrl)" 
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" [alt]="product.name">
            <div *ngIf="!product.imageUrl" class="text-center">
              <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span class="text-2xl font-bold text-green-600">{{ product.name.charAt(0) }}</span>
              </div>
              <p class="text-xs text-gray-400">Sin imagen</p>
            </div>
          </div>

          <!-- Info -->
          <div class="p-5">
            <h3 class="font-semibold text-gray-900 text-lg">{{ product.name }}</h3>
            <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ product.description || 'Sin descripción' }}</p>
            
            <div class="flex flex-wrap gap-2 mt-3">
              <span *ngIf="product.collection" class="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                {{ product.collection }}
              </span>
              <span *ngIf="product.material" class="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full font-medium">
                {{ product.material }}
              </span>
              <span *ngIf="product.color" class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                {{ product.color }}
              </span>
            </div>

            <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span class="text-2xl font-bold text-green-600">{{ product.price | currency:'EUR' }}</span>
              <span class="text-xs text-gray-400">{{ product.createdAt | date:'dd/MM/yyyy' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vacío -->
      <div *ngIf="products.length === 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
        </svg>
        <p class="text-gray-500 font-medium">No se encontraron productos</p>
        <p class="text-gray-400 text-sm mt-1">Comprueba que la API esté en ejecución</p>
      </div>

    </div>
  `
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showForm = false;
  filterCollection = '';
  filterMaterial = '';
  isSaving = false;
  successMessage = '';
  errorMessage = '';

  newProduct: ProductCreate = {
    name: '',
    basePrice: 0,
    collection: '',
    material: '',
    color: '',
    description: '',
    imageUrl: ''
  };

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  getImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('images/')) return imageUrl;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `images/${imageUrl}`;
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando productos:', err)
    });
  }

  applyFilters() {
    if (this.filterCollection || this.filterMaterial) {
      this.productService.getFiltered(this.filterCollection, this.filterMaterial).subscribe({
        next: (data) => {
          this.products = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error filtrando:', err)
      });
    } else {
      this.loadProducts();
    }
  }

  clearFilters() {
    this.filterCollection = '';
    this.filterMaterial = '';
    this.loadProducts();
  }

  canSaveProduct(): boolean {
    return !!this.newProduct.name && this.newProduct.basePrice > 0;
  }

  saveProduct() {
    if (!this.canSaveProduct()) return;

    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.create(this.newProduct).subscribe({
      next: (product) => {
        this.successMessage = `Producto "${product.name}" creado correctamente`;
        this.isSaving = false;
        this.resetNewProduct();
        this.loadProducts();
        setTimeout(() => {
          this.successMessage = '';
          this.showForm = false;
        }, 2000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = `Error al crear producto: ${err.error?.message || err.message}`;
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelNewProduct() {
    this.showForm = false;
    this.resetNewProduct();
    this.errorMessage = '';
    this.successMessage = '';
  }

  resetNewProduct() {
    this.newProduct = {
      name: '',
      basePrice: 0,
      collection: '',
      material: '',
      color: '',
      description: '',
      imageUrl: ''
    };
  }
}
