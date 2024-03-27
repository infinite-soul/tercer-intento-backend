const ProductManager = require('./productManager.js');



const productManager = new ProductManager();

function generateRandomCode() {
    const min = 100; // Mínimo valor de tres dígitos
    const max = 999; // Máximo valor de tres dígitos
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
