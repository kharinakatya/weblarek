// main.ts
import './scss/styles.scss';
import { Api } from './components/base/Api';
import { CommunicationLayer } from './components/Communication/CommunicationLayer';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { API_URL } from './utils/constants';
import { CatalogView } from './components/Views/CatalogView';
import { ModalView } from './components/Views/ModalView';
import { BasketView } from './components/Views/BasketView';
import { OrderFormView } from './components/Views/OrderFormView';
import { ContactsFormView } from './components/Views/ContactsFormView';
import { SuccessView } from './components/Views/SuccessView';
import { HeaderView } from './components/Views/HeaderView';
import { PreviewCardView } from './components/Views/PreviewCardView';
import { CatalogCardView } from './components/Views/CatalogCardView';

document.addEventListener('DOMContentLoaded', () => {
  const catalog = new ProductCatalog();
  const basket = new Basket();
  const buyer = new Buyer();

  const galleryEl = document.querySelector('.gallery') as HTMLElement;
  const modal = new ModalView();
  const catalogView = new CatalogView(galleryEl);
  const basketView = new BasketView();
  const headerView = new HeaderView();
  const orderFormView = new OrderFormView();
  const contactsFormView = new ContactsFormView();
  const successView = new SuccessView();

  const api = new Api(API_URL);
  const communicationLayer = new CommunicationLayer(api);

catalog.on('catalog:changed', ({ items }) => {
  const cardViews = items.map(item => {
    const card = new CatalogCardView();
    card.render(item);
    card.on('catalog:card-click', ({ product }) => {
      catalog.selectPreview(product);
    });
    return card;
  });
  catalogView.items = cardViews;
});

basket.on('basket:changed', ({ items }) => {
  headerView.updateCounter(items.length);
  if (modal.isActive && modal.getContentId && modal.getContentId() !== 'success') {
    modal.updateContent(basketView.render(items, basket.getTotalPrice()));
  }
});

  catalogView.on('catalog:card-click', ({ product }) => {
    catalog.selectPreview(product);
  });

  catalog.on('catalog:preview', ({ product }) => {
    modal.open(previewView.render(product));
  });

const previewView = new PreviewCardView();

catalog.on('catalog:preview', ({ product }) => {
  const isInBasket = basket.getItems().some(i => i.id === product.id);
  modal.open(previewView.render(product, isInBasket));
});

previewView.on('preview:add-to-basket', ({ product }) => {
  basket.addItem(product);
  modal.updateContent(previewView.render(product, true));
});

previewView.on('preview:remove-from-basket', ({ product }) => {
  basket.removeItem(product);
  modal.updateContent(previewView.render(product, false));
});

  basketView.on('basket:remove-item', ({ product }) => {
    basket.removeItem(product);
  });

basketView.on('basket:order-click', () => {
  const content = orderFormView.render();
  if (modal.isActive) {
    modal.updateContent(content);
  } else {
    modal.open(content);
  }
});

 headerView.on('header:basket-click', () => {
  modal.open(basketView.render(basket.getItems(), basket.getTotalPrice()));
});

  orderFormView.on('buyer:change', ({ key, value }) => {
    buyer.setData(key, value);
  });

  contactsFormView.on('buyer:change', ({ key, value }) => {
    buyer.setData(key, value);
  });

buyer.on('order:validate', (errors: Record<string, string>) => {
  const orderErrors: Record<string, string> = {};
  if (errors.address) orderErrors.address = errors.address;
  if (errors.payment) orderErrors.payment = errors.payment;

  const contactsErrors: Record<string, string> = {};
  if (errors.email) contactsErrors.email = errors.email;
  if (errors.phone) contactsErrors.phone = errors.phone;

  orderFormView.setValidationErrors(orderErrors);

  if (Object.keys(contactsErrors).length > 0) {
    (contactsFormView as any).setValidationErrors?.(contactsErrors);
  } else {
    (contactsFormView as any).clearErrors?.();
  }
});

 orderFormView.on('order:submit', ({ data }) => {
  if (data.address) buyer.setAddress(data.address);
  if (data.payment) buyer.setPayment(data.payment);
  modal.open(contactsFormView.render());
});

contactsFormView.on('contacts:submit', async () => {
  buyer.setEmail(buyer.getData().email);
  buyer.setPhone(buyer.getData().phone);

  const allItems = basket.getItems();

  const sellableItems = allItems.filter(i => {
    const p = typeof i.price === 'number' ? i.price : Number(i.price);
    return isFinite(p) && p > 0;
  });

  const sellableIds = sellableItems.map(i => i.id);
  const total = basket.getTotalPrice();

  if (sellableIds.length === 0) {
    modal.open(successView.render(0));
    basket.clear();
    buyer.clear();
    return;
  }

  const orderData = {
    payment: buyer.getData().payment,
    email: buyer.getData().email,
    phone: buyer.getData().phone,
    address: buyer.getData().address,
    total: total,
    items: sellableIds
  };

  try {
    await communicationLayer.sendOrder(orderData);
    modal.open(successView.render(orderData.total));
    basket.clear();
    buyer.clear();
  } catch (err) {
    console.error('Ошибка отправки заказа:', err);
  }
});

  successView.on('success:close', () => {
    modal.close();
  });

  (async () => {
    try {
      const products = await communicationLayer.fetchProducts();
      catalog.setItems(products);
    } catch (error) {
      console.error('Ошибка:', error);
    }
  })();
});