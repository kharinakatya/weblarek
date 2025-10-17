import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { CommunicationLayer } from './components/Communication/CommunicationLayer';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { API_URL } from './utils/constants';
import { ProductCatalogView } from './components/Models/ProductCatalogView';
import { ModalController } from './components/Communication/Modal';
import { IProduct } from './types/index';
import { BasketView } from './components/Models/BasketView';

document.addEventListener('DOMContentLoaded', () => {
  const catalog = new ProductCatalog();
  const basket = new Basket();
  const buyer = new Buyer(); //не нужно пока что

  const galleryEl = document.querySelector('.gallery') as HTMLElement | null;
  if (!galleryEl) throw new Error('.gallery не найден');

  const catalogView = new ProductCatalogView(galleryEl);
  const modal = new ModalController('#modal-container');

  const basketView = new BasketView(basket);

  const basketButton = document.querySelector('.header__basket') as HTMLElement;
  if (basketButton) {
    basketButton.addEventListener('click', () => {
      const basketContent = basketView.render();
      modal.openContent(basketContent);
    });
  }

  basketView.on('basket:remove-item', ({ product }: { product: IProduct }) => {
    basket.removeItem(product);

    const counter = document.querySelector('.header__basket-counter') as HTMLElement;
    if (counter) counter.textContent = String(basket.getCount());

    if (modal.modalRoot.classList.contains('is-open')) {
      const updatedContent = basketView.render();
      modal.openContent(updatedContent);
    }
  });

  basketView.on('basket:order-click', () => {
    console.log('Переход к оформлению заказа');
    modal.close();
  });

  catalogView.on('catalog:card-click', ({ product }: { product: IProduct }) => {
    console.log('catalog:card-click -> modal.open', product.title);
    modal.open(product, '#card-preview');
  });

  window.addEventListener('modal:add-to-basket', (ev: Event) => {
    const product = (ev as CustomEvent).detail.product as IProduct;
    if (!product) return;
    basket.addItem(product);
    const counter = document.querySelector('.header__basket-counter') as HTMLElement | null;
    if (counter) counter.textContent = String(basket.getCount());
    modal.close();
  });

  catalogView.render(catalog.getItems());

  (async () => {
    try {
      const api = new Api(API_URL);
      const communicationLayer = new CommunicationLayer(api);
      const products = await communicationLayer.fetchProducts();
      catalog.setItems(products);
      catalogView.render(catalog.getItems());
    } catch (error) {
      console.error('Ошибка при работе с сервером:', error);
      catalog.setItems(apiProducts.items);
      catalogView.render(catalog.getItems());
    }
  })();
});