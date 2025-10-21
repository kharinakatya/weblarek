export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash';

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IOrderData {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

export interface IBasket {
  items: IProduct[];
  addItem(item: IProduct): void;
  removeItem(item: IProduct): void;
  clear(): void;
  getItems(): IProduct[];
  getTotal(): number;
  getCount(): number;
  hasItem(id: string): boolean;
}

export interface IBuyerModel {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  setPayment(payment: TPayment): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  setAddress(address: string): void;
  getBuyerData(): IBuyer;
  validate(): boolean;
  clear(): void;
}

export interface IProductCatalog {
  items: IProduct[];
  selectedProduct: IProduct | null;
  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getItem(id: string): IProduct | undefined;
  setSelectedProduct(product: IProduct): void;
  getSelectedProduct(): IProduct | null;
}

export interface IProductCatalogView {
  render(items: IProduct[]): void;
}

export interface IBasketView {
  render(): HTMLElement;
}
