# API Documentation: Product Management Dashboard

Created by: **Abdul Samad**  
Target API: [DummyJSON](https://dummyjson.com)  
Base URL: `https://dummyjson.com`

---

## Important API Notice
DummyJSON is an educational prototyping API. All `POST`, `PUT`, and `DELETE` calls are **simulated on the server**. This means requests return simulated success responses (e.g., status 200/201 with generated IDs or `isDeleted: true`), but changes are **not permanently saved** on DummyJSON's database. In this application, successful mutations trigger `queryClient.invalidateQueries()` and display informative toast/alert notifications explaining the simulation.

---

## 1. Authentication Endpoints

### 1.1 User Login
- **Method:** `POST`
- **URL:** `/auth/login`
- **Purpose:** Authenticates user credentials and returns a Bearer access token and user metadata.
- **Request Headers:**
  ```http
  Content-Type: application/json
  ```
- **Request Body Example:**
  ```json
  {
    "username": "emilys",
    "password": "emilyspass",
    "expiresInMins": 60
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "username": "emilys",
    "email": "emily.johnson@x.dummyjson.com",
    "firstName": "Emily",
    "lastName": "Johnson",
    "gender": "female",
    "image": "https://dummyjson.com/icon/emilys/128",
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn..."
  }
  ```
- **Error Cases:**
  - `400 Bad Request`: Missing username or password.
  - `401 Unauthorized`: "Invalid credentials".

---

## 2. Product Endpoints

### 2.1 Get Products (Paginated)
- **Method:** `GET`
- **URL:** `/products?limit={limit}&skip={skip}`
- **Purpose:** Retrieves a paginated list of catalog products.
- **Query Parameters:**
  - `limit`: number of records to return (e.g. `10`)
  - `skip`: offset calculation `(page - 1) * limit`
  - `sortBy`: optional sort attribute (`price`, `title`, `rating`)
  - `order`: sort order (`asc` or `desc`)
- **Success Response (200 OK):**
  ```json
  {
    "products": [
      {
        "id": 1,
        "title": "Essence Mascara Lash Princess",
        "description": "The Essence Mascara Lash Princess is a popular mascara...",
        "category": "beauty",
        "price": 9.99,
        "discountPercentage": 7.17,
        "rating": 4.94,
        "stock": 5,
        "brand": "Essence",
        "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
      }
    ],
    "total": 194,
    "skip": 0,
    "limit": 10
  }
  ```

### 2.2 Search Products
- **Method:** `GET`
- **URL:** `/products/search?q={query}&limit={limit}&skip={skip}`
- **Purpose:** Queries catalog items matching the search string.
- **Query Parameters:** `q` (search string), `limit`, `skip`
- **Success Response (200 OK):** Same schema as `/products`.

### 2.3 Get Categories
- **Method:** `GET`
- **URL:** `/products/categories`
- **Purpose:** Returns list of all available categories.
- **Success Response (200 OK):**
  ```json
  [
    { "slug": "beauty", "name": "Beauty", "url": "https://dummyjson.com/products/category/beauty" },
    { "slug": "fragrances", "name": "Fragrances", "url": "https://dummyjson.com/products/category/fragrances" },
    { "slug": "groceries", "name": "Groceries", "url": "https://dummyjson.com/products/category/groceries" }
  ]
  ```

### 2.4 Get Products by Category
- **Method:** `GET`
- **URL:** `/products/category/{categoryName}?limit={limit}&skip={skip}`
- **Purpose:** Filters products strictly belonging to the specified category slug.

### 2.5 Get Single Product
- **Method:** `GET`
- **URL:** `/products/{id}`
- **Purpose:** Retrieves full specifications, reviews, dimensions, and image gallery for a single product.
- **Success Response (200 OK):** Product object with full attributes.
- **Error Cases:** `404 Not Found` if product ID does not exist.

### 2.6 Add New Product
- **Method:** `POST`
- **URL:** `/products/add`
- **Purpose:** Simulates creation of a new product entry.
- **Request Headers:**
  ```http
  Content-Type: application/json
  Authorization: Bearer <token>
  ```
- **Request Body Example:**
  ```json
  {
    "title": "Wireless Noise Cancelling Headphones",
    "description": "High fidelity over-ear headphones with 30-hour battery life",
    "price": 149.99,
    "stock": 35,
    "category": "mobile-accessories",
    "brand": "Sony"
  }
  ```
- **Success Response (201 Created / 200 OK):**
  ```json
  {
    "id": 195,
    "title": "Wireless Noise Cancelling Headphones",
    "price": 149.99,
    "stock": 35,
    "category": "mobile-accessories",
    "brand": "Sony"
  }
  ```

### 2.7 Update Product
- **Method:** `PUT`
- **URL:** `/products/{id}`
- **Purpose:** Simulates updating product attributes.
- **Request Body Example:** Same schema as Add Product or partial fields.
- **Success Response (200 OK):** Updated product object.
- **Error Cases:** `404 Not Found` if product ID is invalid.

### 2.8 Delete Product
- **Method:** `DELETE`
- **URL:** `/products/{id}`
- **Purpose:** Simulates product deletion.
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "title": "Essence Mascara Lash Princess",
    "isDeleted": true,
    "deletedOn": "2026-10-23T03:00:00.000Z"
  }
  ```

---

## 3. Users Endpoints

### 3.1 Get Users
- **Method:** `GET`
- **URL:** `/users?limit={limit}&skip={skip}`
- **Purpose:** Retrieves paginated user profiles.
- **Success Response (200 OK):**
  ```json
  {
    "users": [
      {
        "id": 1,
        "firstName": "Emily",
        "lastName": "Johnson",
        "email": "emily.johnson@x.dummyjson.com",
        "username": "emilys",
        "phone": "+81 965-431-3024",
        "image": "https://dummyjson.com/icon/emilys/128",
        "company": {
          "department": "Engineering",
          "name": "Dooley, Kozey and Cronin",
          "title": "Sales Manager"
        }
      }
    ],
    "total": 208,
    "skip": 0,
    "limit": 10
  }
  ```

### 3.2 Add User (Register)
- **Method:** `POST`
- **URL:** `/users/add`
- **Purpose:** Simulates registration of a new user.
- **Request Body Example:**
  ```json
  {
    "firstName": "Abdul",
    "lastName": "Samad",
    "email": "abdul.samad@example.com",
    "username": "abdulsamad",
    "password": "securepassword123"
  }
  ```
- **Success Response (201 Created):** New user object with generated ID.
