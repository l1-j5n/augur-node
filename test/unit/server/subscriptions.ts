"use strict";

import { EventEmitter } from "events";
import { assert } from "chai";
import { Subscriptions } from "../../../src/server/subscriptions";

describe("server/subscriptions", () => {
  let emitter;
  let subscriptions;

  beforeEach(() => {
    emitter = new EventEmitter();
    subscriptions = new Subscriptions(emitter);
  });

  it("subscribes to an event", (done) => {

    const params = [];
    const subscription = subscriptions.subscribe("MarketCreated", null, (data) => {
      params.push(data);
    });

    assert.equal(emitter.listeners("MarketCreated").length, 1);
    assert.equal(subscriptions.listeners("MarketCreated").length, 1);
    assert.equal(subscriptions.listeners("unsubscribe:" + subscription).length, 1);
    assert.equal(subscriptions.listeners("removeAllListeners").length, 1);

    done();
  });

  it("subscribes to an event and gets outputs", (done) => {

    const params = [];
    subscriptions.subscribe("MarketCreated", null, (data) => {
      params.push(data);
    });

    emitter.emit("MarketCreated", 1);
    emitter.emit("MarketCreated", "string");
    emitter.emit("MarketCreated", { s: "string again", n: 123 });

    assert.deepEqual(params, [1, "string", { s: "string again", n: 123 }]);
    done();
  });

  it("unsubscribes from a single event", (done) => {
    const subscription1 = subscriptions.subscribe("MarketCreated", null, (data) => { });
    const subscription2 = subscriptions.subscribe("MarketCreated", null, (data) => { });

    assert.notEqual(subscription1, subscription2);

    assert.equal(emitter.listeners("MarketCreated").length, 2);
    assert.equal(subscriptions.listeners("MarketCreated").length, 2);
    assert.equal(subscriptions.listeners("unsubscribe:" + subscription1).length, 1);

    subscriptions.unsubscribe(subscription1);

    assert.equal(emitter.listeners("MarketCreated").length, 1);
    assert.equal(subscriptions.listeners("MarketCreated").length, 1);
    assert.equal(subscriptions.listeners("unsubscribe:" + subscription1).length, 0);

    done();
  });

  it("unsubscribes from all events", (done) => {
    const subscription1 = subscriptions.subscribe("MarketCreated", null, (data) => { });
    const subscription2 = subscriptions.subscribe("MarketCreated", null, (data) => { });

    assert.notEqual(subscription1, subscription2);

    assert.equal(emitter.listeners("MarketCreated").length, 2);
    assert.equal(subscriptions.listeners("MarketCreated").length, 2);
    assert.equal(subscriptions.listeners("unsubscribe:" + subscription1).length, 1);

    subscriptions.removeAllListeners();

    assert.equal(emitter.listeners("MarketCreated").length, 0);
    assert.equal(subscriptions.listeners("MarketCreated").length, 0);
    assert.equal(subscriptions.listeners("unsubscribe:" + subscription1).length, 0);
    assert.equal(subscriptions.listeners("unsubscribe:" + subscription2).length, 0);
    assert.equal(subscriptions.listeners("removeAllListeners" + subscription2).length, 0);

    done();
  });
});
