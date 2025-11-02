//ProductCatalog.ts
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types/index';

export class ProductCatalog extends EventEmitter {
  private _items: IProduct[] = [];
  private _preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this._items = [...items];
    this.emit('catalog:changed', { items: this._items });
  }
}

