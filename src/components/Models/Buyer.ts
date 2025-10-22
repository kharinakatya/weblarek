import { IBuyer, TPayment } from '../../types/index';

export class Buyer {
    private data: IBuyer = {
        payment: 'card',
        email: '',
        phone: '',
        address: ''
    };

    setPayment(payment: TPayment): void {
        this.data.payment = payment;
    }

    setEmail(email: string): void {
        this.data.email = email;
    }

    setPhone(phone: string): void {
        this.data.phone = phone;
    }

    setAddress(address: string): void {
        this.data.address = address;
    }

    getData(): IBuyer {
        return { ...this.data };
    }

    clear(): void {
        this.data = {
            payment: 'card',
            email: '',
            phone: '',
            address: ''
        };
    }


    validate(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        if (!this.data.email.trim()) {
            errors.email = 'Укажите email';
        }
        if (!this.data.phone.trim()) {
            errors.phone = 'Укажите телефон';
        }
        if (!this.data.address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        return errors;
    }
}
