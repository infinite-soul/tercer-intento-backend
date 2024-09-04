
# Backend Luis Alejandro Gallego Ching 3er intento

Este es mi proyecto de github para Backend con C0derH0use, en mi tercera cursada

## 1. Primer desafío entregable

- Hay dos archivos: productManager.js y test.js, uno se encarga de realizar los procesos y el otro de ejecutar lo que necesitamos probar
- Tiene instalado node js
- De momento no tiene node_modules porque no se usó ninguna dependencia que lo requiera
- Se prueba enviando el comando npm run test, se pueden revisar las dos pruebas al tiempo, o comentar cada parte que se quiera probar

## 2. Segundo desafío

- Hay tres archivos: productManager.js, test.js y products.json, uno se encarga de realizar los procesos y el otro de ejecutar lo que necesitamos probar, y el último de almacenar con el filesystem
- Tiene instalado node js
- Tiene node_modules, así que se instalarán las dependencias al instalar node
- Se prueba enviando el comando npm run test, se pueden revisar las diferentes pruebas al tiempo, o comentar cada parte que se quiera probar

## 3. Tercer desafío y primera preentrega

- Se corre con el comando npm run dev (con nodemon)
- Funciona con postman en el puerto 8080
- En la ruta base lleva /api, por ejemplo: http://localhost:8080/api/carts/1/product/3
- Incluye las entregas del tercer desafío y de la primera preentrega, ya que las diferencias eran pocas y preferí entregar ambas

## 4. Cuarto desafío

- Se corre con el comando npm run dev (con nodemon)
- Funciona con postman en el puerto 8080
- En la ruta base lleva /api, por ejemplo: http://localhost:8080/api/carts/1/product/3
- Incluye las entregas del tercer desafío y de la primera preentrega, ya que las diferencias eran pocas y preferí entregar ambas
- Incluye handlebars con una plantilla horrible de fea, nunca me gustó handlebars pero intentaré mejorarlo. Funciona en la ruta http://localhost:8080/api/realtimeproducts

## 5. Practica integradora

- Se corre con el comando npm run dev (con nodemon)
- Funciona con postman en el puerto 8080
- En la ruta base lleva /api, por ejemplo: http://localhost:8080/api/carts/1/product/3
- Incluye la integración con Mongo DB y el chat en http://localhost:8080/api/chat
- Continua con la plantilla horrible de fea. Funciona en la ruta http://localhost:8080/api/realtimeproducts
- El schema de los productos y carts está medio feo, los simplifiqué para que fuera más manejable, durante la semana mejoraré la estructura de datos pero requería hacer la entrega

## 6. Segunda Preentrega

- Se corre con el comando npm run dev (con nodemon)
- Funciona con postman en el puerto 8080
- En la ruta base lleva /api, por ejemplo: http://localhost:8080/api/carts/1/product/3
- La diferencia entre el postman y el handlebar es el idioma, en ingles es el api (http://localhost:8080/api/products?query=esacosa) en español es el handlebar (http://localhost:8080/api/productos?page=1&limit=10)
- Lo mismo ocurre con la vista del carrito, por ejemplo http://localhost:8080/api/carritos/664ab2439d45027a0e8d3f83 muestra una vista, mientras que http://localhost:8080/api/carts/664ab2439d45027a0e8d3f83 muestra el objeto del carrito

- ## Mocking de productos

- Se corre con el comando npm run dev (con nodemon)
- Funciona con postman en el puerto 8080
- En la ruta base lleva /api, por ejemplo: http://localhost:8080/api/carts/1/product/3
- La diferencia entre el postman y el handlebar es el idioma, en ingles es el api (http://localhost:8080/api/products?query=esacosa) en español es el handlebar (http://localhost:8080/api/productos?page=1&limit=10)
- Lo mismo ocurre con la vista del carrito, por ejemplo http://localhost:8080/api/carritos/664ab2439d45027a0e8d3f83 muestra una vista, mientras que http://localhost:8080/api/carts/664ab2439d45027a0e8d3f83 muestra el objeto del carrito
- El mocking se hace como indica la prueba descrita en el archivo, en la ruta http://localhost:8080/api/products/mockingproducts en postman con el metodo post

- ## Logger

- Se corre con el comando npm run dev (con nodemon)
- Funciona con postman en el puerto 8080
- En la ruta base lleva /api, por ejemplo: http://localhost:8080/api/carts/1/product/3
- La diferencia entre el postman y el handlebar es el idioma, en ingles es el api (http://localhost:8080/api/products?query=esacosa) en español es el handlebar (http://localhost:8080/api/productos?page=1&limit=10)
- Lo mismo ocurre con la vista del carrito, por ejemplo http://localhost:8080/api/carritos/664ab2439d45027a0e8d3f83 muestra una vista, mientras que http://localhost:8080/api/carts/664ab2439d45027a0e8d3f83 muestra el objeto del carrito
- El logger se puede probar en el registro y login de la app, con las rutas http://localhost:8080/register registrando cualquier usuario nuevo, o con http://localhost:8080/login. El contenido de .env lo envio en un comentario de la entrega en la plataforma de coderhouse.

## Integracion nodemailer y ethereal para reestablecer

- Funciona similar a los anteriores, se puede crear cualquier usuario en http://localhost:8080/register
- Se envia por postman en la ruta http://localhost:8080/api/auth/forgot-password el body json {
    "email": "<email\@email.com>"
}
- Esto envia un correo, y manda en postman la url de preview
- Allí sale la url para reestablecer contraseña, usarla

## Documentación Swagger
- Se abre en http://localhost:8080/api-docs/