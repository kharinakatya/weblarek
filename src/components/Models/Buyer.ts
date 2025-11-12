import { EventEmitter } from '../base/Events';
import { IBuyer, TPayment } from '../../types/index';

export class Buyer extends EventEmitter {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  setData(key: string, value: TPayment | string): void {
    (this as any)[`_${key}`] = value;
    this.validate();
  }

  validate(): void {
    const errors: Record<string, string> = {};
    if (!this._address.trim()) errors.address = 'Необходимо указать адрес';
    if (!this._payment) errors.payment = 'Выберите способ оплаты';
    if (!this._email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.email = 'Введите корректный email';
    if (!this._phone.trim()) errors.phone = 'Введите телефон';
    this.emit('order:validate', errors);
  }

  setPayment(payment: TPayment): void {
    this.setData('payment', payment);
  }

  setAddress(address: string): void {
    this.setData('address', address);
  }

  setEmail(email: string): void {
    this.setData('email', email);
  }

  setPhone(phone: string): void {
    this.setData('phone', phone);
  }

  clear(): void {
    this._payment = null;
    this._address = '';
    this._email = '';
    this._phone = '';
    this.emit('buyer:changed', this.getData());
  }

  getData(): IBuyer {
    return {
      payment: this._payment,
      address: this._address,
      email: this._email,
      phone: this._phone
    };
  }
}