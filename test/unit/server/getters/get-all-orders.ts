"use strict";

import { assert } from "chai";
import { getAllOrders } from "../../../../src/server/getters/get-all-orders";

import { setupTestDb } from "../../test.database";

describe("server/getters/get-all-orders", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getAllOrders(db, t.params.account, (err, orders) => {
          t.assertions(err, orders);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get all orders from the account",
    params: {
      account: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (err, orders) => {
      assert.ifError(err);
      assert.deepEqual(orders, {
        "0x2000000000000000000000000000000000000000000000000000000000000000": {
          orderId: "0x2000000000000000000000000000000000000000000000000000000000000000",
          sharesEscrowed: "0",
          tokensEscrowed: "1.200002",
          marketId: "0x0000000000000000000000000000000000000001",
        },
        "0x3000000000000000000000000000000000000000000000000000000000000000": {
          orderId: "0x3000000000000000000000000000000000000000000000000000000000000000",
          sharesEscrowed: "0",
          tokensEscrowed: "1.20000006",
          marketId: "0x0000000000000000000000000000000000000001",
        },
        "0x4000000000000000000000000000000000000000000000000000000000000000": {
          orderId: "0x4000000000000000000000000000000000000000000000000000000000000000",
          sharesEscrowed: "0",
          tokensEscrowed: "1.2",
          marketId: "0x0000000000000000000000000000000000000001",
        },
      });
    },
  });
});
