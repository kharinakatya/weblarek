import { IProduct } from '../../types/index';

export class ProductCatalog {
  private _items: IProduct[] = [];
  private _preview: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this._items = items;
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct | undefined {
    return this._items.find(item => item.id === id);
  }

  setSelectedProduct(item: IProduct): void {
    this._preview = item;
  }

  getSelectedProduct(): IProduct | null {
    return this._preview;
  }
}