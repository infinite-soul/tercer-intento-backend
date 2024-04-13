import ProductManager, { productsFilePath } from './productManager.js';
import path from 'path';


const productManager = new ProductManager(productsFilePath);

function generateRandomCode() {
    const min = 100; 
    const max = 999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

productManager.addProduct({
    title: 'Producto 1',
    description: 'Descripción del producto 1',
    price: 100,
    thumbnail: 'https://rickandmortyapi.com/api/character/avatar/8.jpeg',
    stock: 4,
    code: generateRandomCode()
});
productManager.addProduct({
    title: 'Producto 2',
    description: 'Descripción del producto 2',
    price: 200,
    thumbnail: 'https://rickandmortyapi.com/api/character/avatar/14.jpeg',
    stock: 7,
    code: generateRandomCode()
});


console.log('Todos los productos:', productManager.getProducts());


const productId = 1;
console.log(`Producto con ID ${productId}:`, productManager.getProductById(productId));

const updatedData = {
    title: 'Producto 1 Actualizado',
    price: 150,
    stock: 10
};
productManager.updateProduct(productId, updatedData);
console.log(`Producto con ID ${productId} después de la actualización:`, productManager.getProductById(productId));

const productToDeleteId = 2;
productManager.deleteProduct(productToDeleteId);
console.log(`Producto con ID ${productToDeleteId} ha sido eliminado.`);
console.log('Productos restantes:', productManager.getProducts());
