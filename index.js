require("dotenv").config();
const Telebot = require("telebot");
const { getCurrencyRates } = require("./getCurrency");

const bot = new Telebot({
  token: process.env.BOT_TOKEN,
  polling: {
    interval: 1000,
    timeout: 0,
    limit: 100,
    retryTimeout: 5000,
  },
});

// Log every message
bot.on("text", function (msg) {
  console.log(`[text] ${msg.chat.id} ${msg.text}`);
});

const replyMarkup = bot.keyboard(
  [
    ["/cedi", "/dollar"],
    ["/euro", "/naira"],
  ],
  {
    resize: true,
    once: false,
  }
);

bot.on("/start", (msg) =>
  bot.sendMessage(
    msg.chat.id,
    "Use commands: /cedi, /dollar, /euro, or /naira",
    {
      replyMarkup,
    }
  )
);

bot.on(["/cedi", "/dollar", "/euro", "/naira"], async (msg) => {
  let currency;

  switch (msg.text) {
    case "/cedi":
      currency = "GHS";
      break;
    case "/dollar":
      currency = "USD";
      break;
    case "/euro":
      currency = "EUR";
      break;
    case "/naira":
      currency = "NGN";
      break;
    default:
      currency = "USD";
  }

  bot.sendMessage(msg.chat.id, `Retrieving ${currency} rates...`);

  const rateData = await getCurrencyRates(currency);

  const lastUpdate = new Date(rateData.time_last_update_utc).toDateString();

  const baseCode = rateData.base_code;

  const rates = [
    { name: "USD", rate: rateData.conversion_rates.USD },
    { name: "EUR", rate: rateData.conversion_rates.EUR },
    { name: "NGN", rate: rateData.conversion_rates.NGN },
    { name: "GBP", rate: rateData.conversion_rates.GBP },
    { name: "GHS", rate: rateData.conversion_rates.GHS },
  ];

  const displayRates = rates.map((r) => `${r.name}: ${r.rate}`).join("\n");

  bot.sendMessage(
    msg.chat.id,
    `Rates (${baseCode})\nLast update: ${lastUpdate}\n${displayRates}`
  );
});

bot.start();
