// Models/Buyer.ts
import { EventEmitter } from '../base/Events';
import { IBuyer, TPayment } from '../../types/index';

export class Buyer extends EventEmitter {
  private _payment: TPayment | null = null;
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';

  constructor() {
    super();
  }

  setPayment(payment: TPayment): void {
    this._payment = payment;
    this.emit('buyer:changed', this.getData());
  }

  setAddress(address: string): void {
    this._address = address;
    this.emit('buyer:changed', this.getData());
  }

  setEmail(email: string): void {
    this._email = email;
    this.emit('buyer:changed', this.getData());
  }

  setPhone(phone: string): void {
    this._phone = phone;
    this.emit('buyer:changed', this.getData());
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
