import dotenv from 'dotenv';
import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

import app from '../app.js';
import UserService from '../services/userService.js';
import ProductService from '../services/productService.js';
import CartService from '../services/cartService.js';
import { UserModel } from '../dao/MongoDB/User.model.js';
import { ProductModel } from '../dao/MongoDB/products.model.js';
import { CartModel } from '../dao/MongoDB/carts.model.js';

describe('E-commerce Tests', function() {
  this.timeout(10000);
  let userToken;
  let adminToken;
  let productId;
  let cartId;
  let userId;
  let agent;

  before(async function() {
    try {
      await mongoose.connect(process.env.DB_URL_QA);
      console.log('Conectado a la base de datos de prueba');
      agent = request.agent(app);
    } catch (error) {
      console.error('Error conectando a la base de datos:', error);
      throw error;
    }
  });

  after(async function() {
    await mongoose.connection.close();
    console.log('Conexión a la base de datos cerrada');
  });

  beforeEach(async function() {
    await UserModel.deleteMany({});
    await ProductModel.deleteMany({});
    await CartModel.deleteMany({});
  });

  describe('Autenticación - Pruebas de Integración', function() {
    it('debería registrar un nuevo usuario', async function() {
      const res = await agent
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Registro exitoso');
    });

    it('debería iniciar sesión exitosamente', async function() {
      await UserService.register({ email: 'test@example.com', password: 'password123', name: 'Test User' });
      const res = await agent
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Inicio de sesión exitoso');
      userToken = res.headers['set-cookie'][0].split(';')[0].split('=')[1];
    });

    it('debería obtener el perfil del usuario o redirigir si no está autenticado', async function() {
      const res = await agent
        .get('/api/auth/profile')
        .set('Cookie', `token=${userToken}`);
      
      if (res.status === 302) {
        expect(res.header.location).to.equal('/login');
      } else {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('email');
        expect(res.body.email).to.equal('test@example.com');
      }
    });
  });

  describe('Productos - Pruebas de Integración', function() {
    beforeEach(async function() {
      // Crear un producto de prueba
      const product = await ProductModel.create({
        title: 'Producto de Prueba',
        description: 'Descripción de prueba',
        price: 100,
        thumbnail: ['http://example.com/image.jpg'],
        stock: 10,
        code: 'TEST123',
        category: 'Testing'
      });
      productId = product._id;
    });

    it('debería obtener todos los productos', async function() {
      const res = await agent.get('/api/products');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('payload');
      expect(res.body.payload).to.be.an('array').that.is.not.empty;
    });

    it('debería obtener un producto por ID', async function() {
      const res = await agent.get(`/api/products/${productId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', productId.toString());
    });

    it('debería manejar el caso de producto no encontrado', async function() {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await agent.get(`/api/products/${fakeId}`);
      expect(res.status).to.equal(404);
    });
  });

  describe('Carrito - Pruebas de Integración', function() {
    beforeEach(async function() {
      const user = await UserService.register({ email: 'user@example.com', password: 'user123', name: 'Regular User' });
      userId = user._id;

      // Crear un carrito para el usuario
      const cart = await CartModel.create({ user: userId, products: [] });
      cartId = cart._id;

      await agent
        .post('/api/auth/login')
        .send({ email: 'user@example.com', password: 'user123' });
    });

    it('debería agregar un producto al carrito', async function() {
      // Crear un producto de prueba
      const productResponse = await agent
        .post('/api/products')
        .send({
          title: 'Producto de prueba',
          description: 'Descripción de prueba',
          price: 100,
          thumbnail: ['http://example.com/image.jpg'],
          stock: 10,
          code: 'TEST123',
          category: 'test'
        })
        .set('Cookie', `token=${userToken}`);
    
      expect(productResponse.status).to.equal(201);
      const productId = productResponse.body._id;
    
      // Agregar el producto al carrito
      const cartResponse = await agent
        .post(`/api/carts/${cartId}/product/${productId}`)
        .send({ quantity: 2 })
        .set('Cookie', `token=${userToken}`);
    
      expect(cartResponse.status, `Respuesta inesperada: ${JSON.stringify(cartResponse.body)}`).to.equal(200);
      expect(cartResponse.body.products).to.be.an('array');
      expect(cartResponse.body.products[0].product.toString()).to.equal(productId);
      expect(cartResponse.body.products[0].quantity).to.equal(2);
    });

    it('debería obtener el contenido del carrito', async function() {
      const res = await agent
        .get(`/api/carts/${cartId}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('_id', cartId.toString());
      expect(res.body.products).to.be.an('array');
    });
  });

  describe('Funcionalidades Adicionales - Pruebas de Integración', function() {
    it('debería generar productos mock', async function() {
      const res = await agent
        .post('/api/products/mockingproducts')
        .set('Cookie', `token=${userToken}`);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('products');
      expect(res.body.products).to.be.an('array');
      expect(res.body.products).to.have.lengthOf(50);
    });

    it('debería manejar la recuperación de contraseña', async function() {
      await UserService.register({ email: 'test@example.com', password: 'password123', name: 'Test User' });
      const res = await agent
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message');
      expect(res.body).to.have.property('previewURL');
    });
  });
});
