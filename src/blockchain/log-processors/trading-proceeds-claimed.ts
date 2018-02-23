import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";

export function processTradingProceedsClaimedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const tradingProceedsToInsert = {
    marketId: log.market,
    shareToken: log.shareToken,
    account: log.sender,
    numShares: log.numShares,
    numPayoutTokens: log.numPayoutTokens,
    blockNumber: log.blockNumber,
    transactionHash: log.transactionHash,
    logIndex: log.logIndex,
  };
  db("trading_proceeds").insert(tradingProceedsToInsert).asCallback((err?: Error|null) => {
    if (err) return callback(err);
    augurEmitter.emit("TradingProceedsClaimed", log);
    callback(null);
  });
}

export function processTradingProceedsClaimedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("trading_proceeds").where({ transactionHash: log.transactionHash, logIndex: log.logIndex }).del().asCallback((err?: Error|null) => {
    if (err) return callback(err);
    augurEmitter.emit("TradingProceedsClaimed", log);
    callback(null);
  });
}
