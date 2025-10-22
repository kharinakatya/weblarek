import './scss/styles.scss';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { CommunicationLayer } from './components/CommunicationLayer';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const api = new Api(API_URL);
const productCatalog = new ProductCatalog();
const basket = new Basket();
const buyer = new Buyer();
const communicationLayer = new CommunicationLayer(api);

console.log('=== Тестирование ProductCatalog ===');
productCatalog.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', productCatalog.getItems());
const testProduct = productCatalog.getProduct('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('Товар по ID:', testProduct);
productCatalog.setPreview(testProduct!);
console.log('Товар для превью:', productCatalog.getPreview());

console.log('=== Тестирование Basket ===');
basket.addItem(testProduct!);
console.log('Товары в корзине после добавления:', basket.getItems());
console.log('Общая стоимость:', basket.getTotalPrice());
console.log('Количество товаров:', basket.getItemCount());
console.log('Есть ли товар в корзине:', basket.hasItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
basket.removeItem(testProduct!);
console.log('Товары в корзине после удаления:', basket.getItems());

console.log('=== Тестирование Buyer ===');
buyer.setEmail('test@example.com');
buyer.setPhone('123456789');
buyer.setAddress('Test Address');
buyer.setPayment('cash');
console.log('Данные покупателя:', buyer.getData());
console.log('Ошибки валидации (должны быть пустыми):', buyer.validate());
buyer.clear();
console.log('Данные после очистки:', buyer.getData());
console.log('Ошибки валидации после очистки:', buyer.validate());

communicationLayer.getProducts()
    .then(products => {
        productCatalog.setItems(products);
        console.log('=== Данные с сервера ===');
        console.log('Массив товаров из каталога (с сервера):', productCatalog.getItems());
    })
    .catch(error => {
        console.error('Ошибка при получении товаров с сервера:', error);
    });
