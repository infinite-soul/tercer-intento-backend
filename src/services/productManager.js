import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsFilePath = path.join(__dirname, '..', '..', 'memory', 'products.json');

class ProductManager {
    constructor() {
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(productsFilePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (err) {
            console.error('Error al leer el archivo de productos:', err);
        }
    }

    saveProducts() {
        try {
            const data = JSON.stringify(this.products, null, 2);
            fs.writeFileSync(productsFilePath, data);
        } catch (err) {
            console.error('Error al escribir el archivo de productos:', err);
        }
    }

    addProduct(productData) {
        const requiredFields = ['title', 'description', 'price', 'thumbnail', 'stock', 'code'];
        const missingFields = requiredFields.filter(field => !productData[field]);
        if (missingFields.length > 0) {
            console.log('Error al agregar el producto: Faltan los siguientes campos:', missingFields.join(', '));
            return;
        }
        if (this.products.some(product => product.code === productData.code)) {
            console.log('Error al agregar el producto: El código ya está en uso.');
            return;
        }
        const id = this.products.length + 1;
        const product = { id, ...productData };
        this.products.push(product);
        this.saveProducts();
        console.log('Producto agregado con éxito.');
    }

    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    getProductById(idProduct) {
        const product = this.products.find(product => product.id === idProduct);
        return product;
    }

    updateProduct(idProduct, updatedData) {
        const index = this.products.findIndex(product => product.id === idProduct);
        if (index === -1) {
            console.log("Producto no encontrado");
            return false;
        }
        const updatedProduct = { ...this.products[index], ...updatedData };
        this.products[index] = updatedProduct;
        this.saveProducts();
        console.log('Producto actualizado con éxito.');
        return true;
    }

    deleteProduct(idProduct) {
        const index = this.products.findIndex(product => product.id === idProduct);
        if (index === -1) {
            console.log("Producto no encontrado");
            return false;
        }
        this.products.splice(index, 1);
        this.saveProducts();
        console.log('Producto eliminado con éxito.');
        return true;
    }
}

export default ProductManager;