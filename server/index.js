require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/products', (req, res, next) => {
  const sql = `
    SELECT "productId", "name", "price", "image", "shortDescription"
      FROM "products"
  ORDER BY "productId" ASC;
  `;
  db.query(sql)
    .then(result => {
      const products = result.rows;
      res.status(200).json(products);
    })
    .catch(err => next(err));
});

app.get('/api/products/:productId', (req, res, next) => {
  const { productId } = req.params;
  if ((!parseInt(productId, 10)) || (parseInt(productId, 10) < 1)) {
    next(new ClientError('The productId must be a positive integer', 400));
  }
  const params = [productId];
  const sql = `
   SELECT *
     FROM "products"
    WHERE "productId" = $1;
  `;
  db.query(sql, params)
    .then(result => {
      const product = result.rows[0];
      if (!product) {
        next(new ClientError('Cannot find the product specified', 404));
      } else {
        res.status(200).json(product);
      }
    })
    .catch(err => next(err));
});

app.get('/api/cart', (req, res, next) => {
  const sessionCartId = req.session.cartId;
  if (sessionCartId) {
    const sql = `
      SELECT "c"."cartItemId",
             "c"."price",
             "p"."productId",
             "p"."image",
             "p"."name",
             "p"."shortDescription"
        FROM "cartItems" AS "c"
        JOIN "products" AS "p" USING ("productId")
       WHERE "c"."cartId" = $1;
    `;
    db.query(sql, [sessionCartId])
      .then(result => {
        res.status(200).json(result.rows);
      })
      .catch(err => next(err));
  } else {
    res.status(200).json([]);
  }
});

app.post('/api/cart', (req, res, next) => {
  const { productId } = req.body;
  if ((!parseInt(productId, 10)) || (parseInt(productId, 10) < 1)) {
    next(new ClientError('The productId must be a positive integer', 400));
  }
  const sql = `
    SELECT "price"
      FROM "products"
     WHERE "productId" = $1;
  `;
  db.query(sql, [productId])
    .then(result => {
      if (result.rows.length === 0) {
        throw new ClientError(`The product with productId ${productId} not found`, 400);
      }
      if (req.session.cartId) {
        const cart = {
          cartId: req.session.cartId,
          price: result.rows[0].price
        };
        return cart;
      }
      const cartIdSql = `
        INSERT INTO "carts" ("cartId", "createdAt")
             VALUES (default, default)
          RETURNING "cartId";
      `;
      return (
        db.query(cartIdSql)
          .then(cartResult => {
            const cartIdPrice = {
              cartId: cartResult.rows[0].cartId,
              price: result.rows[0].price
            };
            return cartIdPrice;
          })
      );
    })
    .then(cartIdPrice => {
      req.session.cartId = cartIdPrice.cartId;
      const cartValues = [cartIdPrice.cartId, productId, cartIdPrice.price];
      const cartIdSql = `
        INSERT INTO "cartItems" ("cartId", "productId", "price")
             VALUES ($1, $2, $3)
          RETURNING "cartItemId";
      `;
      return (
        db.query(cartIdSql, cartValues)
      );
    })
    .then(cartItemId => {
      const cartItemSql = `
        SELECT "c"."cartItemId",
               "c"."price",
               "p"."productId",
               "p"."image",
               "p"."name",
               "p"."shortDescription"
          FROM "cartItems" AS "c"
          JOIN "products" AS "p" USING ("productId")
         WHERE "c"."cartItemId" = $1;
      `;
      return (
        db.query(cartItemSql, [cartItemId.rows[0].cartItemId])
          .then(joinResult => {
            res.status(201).json(joinResult.rows[0]);
          })
      );
    })
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
