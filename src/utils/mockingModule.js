// src/utils/mockingModule.js

import { faker } from '@faker-js/faker';
class MockingModule {
    generateMockProduct() {
        return {
            _id: faker.string.uuid(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: parseFloat(faker.commerce.price()),
            thumbnail: [faker.image.url()],
            stock: faker.number.int({ min: 0, max: 100 }),
            code: faker.string.uuid(),
            category: faker.commerce.department(),
            available: faker.datatype.boolean()
        };
    }

    generateMockProducts(count = 50) {
        return Array.from({ length: count }, () => this.generateMockProduct());
    }
}

export default new MockingModule();