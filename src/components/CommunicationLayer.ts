import { IApi, IOrderData, IProduct } from '../types/index';

export class CommunicationLayer {
    constructor(private api: IApi) {}

    async getProducts(): Promise<IProduct[]> {
        const response = await this.api.get<{ items: IProduct[] }>('/product/');
        return response.items;
    }


    async placeOrder(orderData: IOrderData): Promise<any> {
        return await this.api.post('/order/', orderData);
    }
}
