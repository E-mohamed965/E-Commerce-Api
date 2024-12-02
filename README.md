
# E-Commerce Backend API

This project is a Node.js-based backend API for an e-commerce platform. It provides functionality to manage products, categories, orders, and users. The backend is built using Express.js, MongoDB, and Mongoose for database interaction. It supports user authentication, image uploads, and CRUD operations for various entities.

---

## Features

- **Product Management**: Add, update, delete, and fetch products with category and image uploads.
- **Category Management**: CRUD operations for product categories.
- **Order Management**: Create, update, delete, and fetch orders, including order items.
- **User Management**: Register, login, and manage users.
- **Authentication**: JWT-based authentication with role-based access control.
- **File Uploads**: Upload product images and manage image galleries.
- **Data Validation**: Ensure required fields are provided and follow the correct data format.
- **Error Handling**: Centralized error handling for the entire application.
- **Data Population**: Populate related data fields using MongoDB references.

---

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Token (JWT)
- **Middleware**: 
  - Multer (File Uploads)
  - Body-Parser (Request Parsing)
  - Morgan (Logging)
- **Encryption**: bcrypt.js
- **Environment Variables**: dotenv

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   CONNECTION_STRING=your_mongodb_connection_string
   secret=your_jwt_secret
   ```

4. Start the application:
   ```bash
   npm start
   ```

---

## API Endpoints

### Products
- `GET /products` - Fetch all products.
- `GET /products/:ID` - Fetch a specific product by ID.
- `POST /products` - Add a new product (requires image upload).
- `PUT /products/:ID` - Update an existing product.
- `DELETE /products/:ID` - Delete a product.
- `PUT /products/gallery-images/:id` - Update product image gallery (upload multiple images).

### Categories
- `GET /categories` - Fetch all categories.
- `GET /categories/:ID` - Fetch a specific category by ID.
- `POST /categories` - Add a new category.
- `PUT /categories/:ID` - Update an existing category.
- `DELETE /categories/:ID` - Delete a category.

### Orders
- `GET /orders` - Fetch all orders.
- `GET /orders/:id` - Fetch a specific order by ID.
- `POST /orders` - Create a new order.
- `PUT /orders/:ID` - Update order status.
- `DELETE /orders/:ID` - Delete an order and its items.
- `GET /orders/get/totalsales` - Fetch total sales value.
- `GET /orders/get/count` - Fetch the total number of orders.
