import _ from "lodash";

class ComedyCalculator {
  constructor(performance) {
    this.performance = performance;
  }

  amount() {
    let result = 0;
    result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }

  volumeCredits() {
    let result = Math.max(this.performance.audience - 30, 0);

    result += Math.floor(this.performance.audience / 5);
    return result;
  }
}

class TragedyCalculator {
  constructor(performance) {
    this.performance = performance;
  }

  amount() {
    let result = 0;
    result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }

  volumeCredits() {
    const result = Math.max(this.performance.audience - 30, 0);

    return result;
  }
}

export function statement(invoice, plays) {
  return renderAsString(statementData(invoice, plays));
}

function statementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = _.sumBy(result.performances, "amount");
  result.totalVolumeCredits = _.sumBy(result.performances, "volumeCredits");
  return result;

  function enrichPerformance(performance) {
    const result = { ...performance };
    result.play = plays[result.playID];
    result.amount = createCalculator(result).amount();
    result.volumeCredits = createCalculator(result).volumeCredits();
    return result;
  }

  function createCalculator(performance) {
    switch (performance.play.type) {
      case "comedy":
        return new ComedyCalculator(performance);
      case "tragedy":
        return new TragedyCalculator(performance);
      default:
        throw new Error(`unknown type: ${performance.play.type}`);
    }
  }
}

function renderAsString(data) {
  let result = `Statement for ${data.customer}\n`;
  data.performances.forEach(performance => {
    result += ` ${performance.play.name}: ${usd(performance.amount)} (${
      performance.audience
    } seats)\n`;
  });
  result += `Amount owed is ${usd(data.totalAmount)}\n`;
  result += `You earned ${data.totalVolumeCredits} credits\n`;
  return result;
}

function usd(amount) {
  const { format } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  });
  return format(amount / 100);
}
