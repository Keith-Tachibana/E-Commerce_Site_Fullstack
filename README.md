# E-Commerce Site Fullstack
A fictional, full-stack e-commerce website that lets the user view, add, and remove items from a shopping cart and place an order
## Technologies Used
|             Dependency             |   Version   |
|------------------------------------|------------:|
| @Babel/Core                        |    7.8.7    |
| @Babel/Plugin-Transform-React-JSX  |    7.8.3    |
| Babel-Loader                       |    8.0.6    |
| Bootstrap                          |    4.3.1    |
| CORS                               |    2.8.5    |
| Dotenv                             |    8.2.0    |
| Express                            |    4.17.1   |
| Express-Session                    |    1.17.0   |
| FontAwesome                        |    5.11.2   |
| PG                                 |    7.18.2   |
| PM2                                |    4.2.3    |
| React                              |   16.13.0   |
| React-DOM                          |   16.13.0   |
| React-Router-DOM                   |    5.1.2    |
| Session-File-Store                 |    1.4.0    |
| Webpack                            |    4.42.0   |
| Webpack-CLI                        |    3.3.11   |
## Live Demo
Try the application live on [my portfolio website](https://ecommerce.keith-tachibana.com/)
## Features
- _*_ Shopper can view the products for sale
- _*_ Shopper can view the details of any product by clicking on it
- _*_ Shopper can add a product to the shopping cart
- _*_ Shopper can remove a product from the shopping cart
- _*_ Shopper can view the cart summary of all the items added to see the total price
- _*_ Shopper can fill out a form with his/her pertinent information to place the order
## Preview
![E-Commerce Site Fullstack Preview](preview.gif "E-Commerce Site Fullstack Preview")
## Development
#### System Requirements
|   Requirement   |     Version      |
|-----------------|-----------------:|
| Nginx           |  1.10 or higher  |
| Node            |   10 or higher   |
| NPM             |    6 or higher   |
| PM2             |    4 or higher   |
| PostgreSQL      |   10 or higher   |
#### Getting Started
1. Clone the repository
  ```shell
  git clone https://github.com/Keith-Tachibana/E-Commerce_Site_Fullstack.git
  ```
2. Change directory to cloned folder
  ```shell
  cd E-Commerce_Site_Fullstack/
  ```
3. Install all dependencies with NPM
  ```shell
  npm install
  ```
4. Start PostgreSQL server
  ```shell
  sudo service postgresql start
  ```
5. Create the database
  ```shell
  createdb wickedSales
  ```
6. Make a copy of .env.example
  ```shell
  cp .env.example .env
  ```
7. Access the wickedSales database using pgweb in your default web browser
  ```shell
  pgweb --db=wickedSales
  ```
  - Then navigate to http://localhost:8081 and click on the "Query" tab
8. Create schema for products table by copy and pasting this query, then click on "Run Query"
  ```sql
  create table "products" (
    "productId"        serial  primary key,
    "name"             text    not null,
    "price"            integer not null,
    "image"            text    not null,
    "shortDescription" text    not null,
    "longDescription"  text    not null
  );
  ```
9. Create schema for carts table by copy and pasting this query, then click on "Run Query"
  ```sql
  create table "carts" (
    "cartId"    serial         primary key,
    "createdAt" timestamptz(6) not null default now()
  );
  ```
10. Create schema for cartItems table by copy and pasting this query, then click on "Run Query"
  ```sql
  create table "cartItems" (
    "cartItemId" serial  primary key,
    "cartId"     integer not null,
    "productId"  integer not null,
    "price"      integer not null
  );
  ```
11. Create schema for orders table by copy and pasting this query, then click on "Run Query"
  ```sql
  create table "orders" (
    "orderId"         serial         primary key,
    "cartId"          integer        not null,
    "name"            text           not null,
    "creditCard"      text           not null,
    "shippingAddress" text           not null,
    "createdAt"       timestamptz(6) not null default now()
  );
  ```
12. Go back to the console and use the psql REPL (Read Eval Print Loop) to import example data
  ```shell
  psql db=wickedSales
  \copy products from '/home/dev/lfz/E-Commerce_Site_Fullstack/products.csv' delimiter ',' csv header;
  ```
  - ...where `/home/dev/lfz/E-Commerce_Site_Fullstack` is the absolute path to your cloned folder from step 2
13. Edit your nginx default site configuration to reverse proxy the Express.js server
  ```shell
  cd /etc/nginx/sites-available
  sudo nano default
  ```
   - -In the "server" code block, add this underneath the first location definition:
  ```shell
  location /api {
    proxy_pass http://127.0.0.1:3001;
  }
  ```
   - -Save your changes (`Ctrl + O`) and exit (`Ctrl + X`)
   - -Link your default site to the sites-enabled directory (if not already done):
  ```shell
  sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
  ```
14. Start nginx
  ```shell
  sudo service nginx start
  ```
15. Transpile React components using Webpack
  ```shell
  npm run build
  ```
16. Change directory to the server folder
  ```shell
  cd server/
  ```
17. Start the Express.js server using the pm2 module
  ```shell
  sudo pm2 start index.js
  ```
18. Open your default web browser and navigate to http://localhost:3000/ to see the result!
