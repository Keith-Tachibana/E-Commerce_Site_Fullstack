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
    throw new ClientError('The productId must be a positive integer.', 400);
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
        next(new ClientError('Cannot find the product specified.', 404));
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
      "c"."quantity",
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
    throw new ClientError('The productId must be a positive integer.', 400);
  }
  const sql = `
    SELECT "price"
      FROM "products"
    WHERE "productId" = $1;
  `;
  db.query(sql, [productId])
    .then(result => {
      if (result.rows.length === 0) {
        throw new ClientError(`The product with productId ${productId} not found.`, 400);
      }
      if (req.session.cartId) {
        const cart = {
          cartId: req.session.cartId,
          price: result.rows[0].price
        };
        // eslint-disable-next-line no-console
        console.log('Cart:', cart);
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
              price: result.rows[0].price,
              quantity: result.rows[0].quantity
            };
            // eslint-disable-next-line no-console
            console.log('CartIdPrice:', cartIdPrice);
            return cartIdPrice;
          })
      );
    })
    .then(cartIdPrice => {
      // eslint-disable-next-line no-console
      console.log('cartIdPrice:', cartIdPrice);
      req.session.cartId = cartIdPrice.cartId;
      const cartValues = [cartIdPrice.cartId, productId, cartIdPrice.price, cartIdPrice.quantity];
      const cartIdSql = `
        INSERT INTO "cartItems" ("cartId", "productId", "price", "quantity")
        VALUES ($1, $2, $3, $4)
          RETURNING "cartItemId";
      `;
      return (
        db.query(cartIdSql, cartValues)
      );
    })
    .then(cartItemId => {
      const cartItemSql = `
        SELECT "c"."cartItemId",
        "c"."quantity",
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

app.post('/api/orders', (req, res, next) => {
  const { cartId } = req.session;
  const { name, creditCard, shippingAddress } = req.body;
  if (!cartId) {
    throw new ClientError('There is no cartId on this session.', 400);
  } else if (!name || !creditCard || !shippingAddress) {
    throw new ClientError('Must include a name, credit card, AND shipping address.', 400);
  }
  const sql = `
    INSERT INTO "orders" ("cartId", "name", "creditCard", "shippingAddress")
    VALUES ($1, $2, $3, $4)
      RETURNING "orderId", "createdAt", "name", "creditCard", "shippingAddress";
  `;
  const values = [cartId, name, creditCard, shippingAddress];
  db.query(sql, values)
    .then(result => {
      delete req.session.cartId;
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.delete('/api/cartItems/:cartItemId', (req, res, next) => {
  const { cartId } = req.session;
  if (!cartId) {
    throw new ClientError('There is no cartId on this session.', 400);
  }
  const { cartItemId } = req.params;
  if ((!parseInt(cartItemId, 10)) || (parseInt(cartItemId, 10) < 1)) {
    throw new ClientError('The cartItemId must be a positive integer.', 400);
  }
  const sql = `
    DELETE FROM "cartItems"
          WHERE "cartItemId" = $1
      RETURNING "cartItemId";
  `;
  db.query(sql, [cartItemId])
    .then(result => {
      if (result.rows.length === 0) {
        throw new ClientError(`The cart item with cartItemId ${cartItemId} not found.`, 400);
      } else {
        res.sendStatus(204);
      }
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
