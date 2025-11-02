// Basket.ts
import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types/index';

export class Basket extends EventEmitter {
  private _items: IProduct[] = [];

  addItem(item: IProduct): void {
    this._items.push(item);
    this.emit('basket:changed', { items: this._items });
  }

  removeItem(item: IProduct): void {
    this._items = this._items.filter(i => i.id !== item.id);
    this.emit('basket:changed', { items: this._items });
  }

  clear(): void {
    this._items = [];
    this.emit('basket:changed', { items: this._items });
  }

getTotalPrice(): number {
    return this._items.reduce((total, item) => total + item.price, 0);
  }

  getItems(): IProduct[] {
    return [...this._items];
  }
}
