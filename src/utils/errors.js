export class CustomError extends Error {
    constructor(message, code, details = {}) {
        super(message);
        this.code = code;
        this.details = details;
    }
}

export const errorDictionary = {
    PRODUCT_CREATION_ERROR: {
        message: "Error al crear el producto",
        code: "PRODUCT_001"
    },
    MISSING_REQUIRED_FIELDS: {
        message: "Faltan campos requeridos",
        code: "PRODUCT_002"
    },
    PRODUCT_NOT_FOUND: {
        message: "Producto no encontrado",
        code: "PRODUCT_003"
    },
    INVALID_PRODUCT_DATA: {
        message: "Datos de producto inválidos",
        code: "PRODUCT_004"
    }
};

export const createError = (errorType, additionalDetails = {}) => {
    const error = errorDictionary[errorType];
    return new CustomError(error.message, error.code, additionalDetails);
};