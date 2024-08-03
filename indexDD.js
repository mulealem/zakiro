import { CronJob } from "cron";

import TelegramBot from "node-telegram-bot-api";

// Replace with your bot token
const token = "6834834075:AAEGH3tT_uW1Efd2Z_uXEAJaFZGeNhPo124";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: false });

// Replace with the chat ID you want to send the message to
const chatId = "1553400782";

// Send a message to the chat
bot.sendMessage(chatId, "Hello from Node.js!");

const job = new CronJob(
  // every 30 minutes
  "*/1 * * * *", // cronTime
  async function () {
    console.log("Running job :: :: ::");
  },
  null, // onComplete
  true, // start
  "America/Los_Angeles"
);
