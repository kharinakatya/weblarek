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
  return this._items.reduce((total, item) => {
    const priceNum = typeof item.price === 'number'
      ? item.price
      : Number(item.price);

    return total + (isFinite(priceNum) ? priceNum : 0);
  }, 0);
}

  getItems(): IProduct[] {
    return [...this._items];
  }

hasItem(id: string): boolean {
  return this._items.some(i => i.id === id);
  }

}