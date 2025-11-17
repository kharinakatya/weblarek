// ProductCatalog.ts
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types/index';

export class ProductCatalog extends EventEmitter {
  private _items: IProduct[] = [];
  private _preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this._items = [...items];
    this.emit('catalog:changed', { items: this._items });
  }

  selectPreview(product: IProduct): void {
    this._preview = product;
    this.emit('catalog:preview', { product });
  }

  getItems(): IProduct[] {
    return [...this._items];
  }

  getPreview(): IProduct | null {
    return this._preview;
  }

}