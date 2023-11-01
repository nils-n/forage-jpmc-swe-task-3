import { ServerRespond } from "./DataStreamer";

export interface Row {
  price_abc: number;
  price_def: number;
  ratio: number;
  timestamp: Date;
  upper_bound: number;
  lower_bound: number;
  trigger_alert: number | undefined;
}

export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const priceABC =
      (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2.0;
    const priceDEF =
      (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2.0;
    let ratio = 1;
    if (priceDEF > 0) {
      ratio = priceABC / priceDEF;
    }
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    // select latest timepoint
    let newTimestamp;
    if (serverRespond[0].timestamp > serverRespond[1].timestamp) {
      newTimestamp = serverRespond[0].timestamp;
    } else {
      newTimestamp = serverRespond[1].timestamp;
    }
    console.log(newTimestamp);
    // set when display a trigger alert
    let triggerAlert;
    if (ratio > upperBound || ratio < lowerBound) {
      triggerAlert = ratio;
    } else {
      triggerAlert = undefined;
    }
    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      timestamp: newTimestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: triggerAlert,
    };
  }
}
