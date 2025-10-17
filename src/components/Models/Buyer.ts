import { IBuyer, TPayment } from '../../types/index';

export class Buyer {
  private _payment: TPayment | null = null;
  private _email: string = '';
  private _phone: string = '';
  private _address: string = '';

  setPayment(payment: TPayment): void {
    this._payment = payment;
  }

  setEmail(email: string): void {
    this._email = email;
  }

  setPhone(phone: string): void {
    this._phone = phone;
  }

  setAddress(address: string): void {
    this._address = address;
  }

  getData(): IBuyer {
    return {
      payment: this._payment as TPayment,
      email: this._email,
      phone: this._phone,
      address: this._address,
    };
  }

  clear(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this._payment) errors.payment = 'Не выбран вид оплаты';
    if (!this._email) errors.email = 'Укажите email';
    if (!this._phone) errors.phone = 'Укажите телефон';
    if (!this._address) errors.address = 'Укажите адрес';
    return errors;
  }
}
