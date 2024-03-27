class ProductManager {
    constructor() {
        this.products = [];
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
        console.log('Producto agregado con éxito.');
    }

    getProducts() {
        return this.products;
    }

    getProductById(idProduct) {
        const product = this.products.find(product => product.id === idProduct);
        if (!product) {
            console.log("Producto no encontrado");
        }
        return product;
    }
}

module.exports = ProductManager;
