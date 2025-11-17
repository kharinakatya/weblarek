import { IApi } from '../../types/index';
import { IProduct } from '../../types/index';

export interface IOrderData {
  payment: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];

}
export class CommunicationLayer {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<IProduct[]> {
    const response = await this.api.get<{ total: number; items: IProduct[] }>('/product/');
    return response.items;
  }

  async sendOrder(orderData: IOrderData): Promise<{ id: string; total: number }> {
    return this.api.post<{ id: string; total: number }>('/order', orderData);
  }
}