import CartDao from '../dao/cartDao.js';
import ProductDao from '../dao/productDao.js';
import UserDao from '../dao/userDao.js';

class DaoFactory {
  static getDao(type) {
    switch (type) {
      case 'cart':
        return new CartDao();
      case 'product':
        return new ProductDao();
      case 'user':
        return new UserDao();
      default:
        throw new Error('Invalid DAO type');
    }
  }
}

export default DaoFactory;