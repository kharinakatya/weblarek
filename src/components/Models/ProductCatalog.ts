import { IProduct } from '../../types/index';

export class ProductCatalog {
    private items: IProduct[] = [];
    private preview: IProduct | null = null;

    setItems(items: IProduct[]): void {
        this.items = items;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getProduct(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setPreview(product: IProduct): void {
        this.preview = product;
    }

    getPreview(): IProduct | null {
        return this.preview;
    }
}
