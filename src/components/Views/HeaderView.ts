//HeaderView.ts
import { EventEmitter } from '../base/Events';

export class HeaderView extends EventEmitter {
  private basketBtn: HTMLElement;
  private counterEl: HTMLElement;

  constructor() {
    super();
    this.basketBtn = document.querySelector('.header__basket') as HTMLElement;
    this.counterEl = this.basketBtn.querySelector('.header__basket-counter') as HTMLElement;
    this.basketBtn.addEventListener('click', () => this.emit('header:basket-click'));
  }

  updateCounter(count: number): void {
    this.counterEl.textContent = String(count);
  }
}