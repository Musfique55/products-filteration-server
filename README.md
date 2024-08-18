# Product Filtering Website - Backend

## Overview
This is the backend for a fullstack MERN-based single-page website that supports product searching, filtering, pagination, and sorting functionalities. It is built with Node.js, Express.js, and MongoDB, providing a RESTful API to manage and retrieve product data.

## Features
- **Product API:** Provides endpoints to fetch, filter, paginate, and sort products.
- **Categorization:** Filter products by brand name, category, and price range.
- **Pagination:** Implement server-side pagination for efficient data retrieval.
- **Sorting:** Support for sorting products by price and date added.
- **Dummy Data:** Contains at least 20 dummy products for development and testing purposes.

## Project Setup

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB installed and running locally or accessible through a cloud service like MongoDB Atlas.

## Installation
1. **Clone the Repository**
   ```bash
   https://github.com/Musfique55/products-filteration-server.git
   cd backend-repo
2. **Install Dependencies**
   ```bash
   npm install

3. **Environment Variables**
    Create a .env file in the root directory of your project and add the following environment variables:

    MONGODB_URI=mongodb://localhost:27017/your-database-name
    PORT=3000
    Replace your-database-name with the name you want for your MongoDB database.

4. **Start the Server**
   ```bash
   npm start

The server will start on http://localhost:3000
