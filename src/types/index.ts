//index.ts
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';
export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

type TPayment = 'card' | 'cash';

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

import { CDN_URL } from '../utils/constants';
import { cloneTemplate } from '../utils/utils';

function renderBasketIntoNode(rootNode: HTMLElement, basketInstance: Basket) {
  const listEl = rootNode.querySelector('.basket__list') as HTMLElement | null;
  const priceEl = rootNode.querySelector('.basket__price') as HTMLElement | null;
  if (!listEl) return;

  listEl.innerHTML = '';

  const items = basketInstance.getItems();
  items.forEach((item, idx) => {
    const li = cloneTemplate<HTMLElement>('#card-basket');

    // заполняем поля
    const indexEl = li.querySelector('.basket__item-index') as HTMLElement | null;
    const titleEl = li.querySelector('.card__title') as HTMLElement | null;
    const priceItemEl = li.querySelector('.card__price') as HTMLElement | null;
    const imgEl = li.querySelector('.card__image') as HTMLImageElement | null;
    const delBtn = li.querySelector('.basket__item-delete') as HTMLButtonElement | null;

    if (indexEl) indexEl.textContent = String(idx + 1);
    if (titleEl) titleEl.textContent = item.title;
    if (priceItemEl) priceItemEl.textContent = item.price != null ? `${item.price} синапсов` : 'Бесплатно';

    if (imgEl) {
      imgEl.src = `${CDN_URL}${item.image}`;
      imgEl.alt = item.title;
    }

    if (delBtn) {
      delBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        basketInstance.removeItem(item);
        renderBasketIntoNode(rootNode, basketInstance);
        const counter = document.querySelector('.header__basket-counter') as HTMLElement | null;
        if (counter) counter.textContent = String(basketInstance.getCount());
      });
    }

    listEl.appendChild(li);
  });

  if (priceEl) priceEl.textContent = `${basketInstance.getTotal()} синапсов`;
}

  const headerBasketBtn = document.querySelector('.header__basket') as HTMLElement | null;
  if (headerBasketBtn) {
    headerBasketBtn.addEventListener('click', () => {
      modal.openTemplate('#basket', (node) => {
        renderBasketIntoNode(node, basket);

        const orderBtn = node.querySelector('.basket__button') as HTMLButtonElement | null;
        if (orderBtn) {
          orderBtn.addEventListener('click', () => {
            modal.openTemplate('#order', (orderNode) => {
            });
          });
        }
      });
    });
  }
