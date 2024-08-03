import puppeteer from "puppeteer";
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto("https://www.zemenbank.com/exchange-rates", {
  waitUntil: "networkidle0",
});

await page.waitForSelector(".currency-exchange-table");

const tableEx = await page.$(".currency-exchange-table");

// console.log("tableEx:: ", tableEx);

const data = await page.evaluate(() => {
  const table = document.querySelector(".currency-exchange-table");
  console.log("table: ", table);
  //   const exchangeRateTable = table[2];
  const rows = table.querySelector("tbody tr");
  //   console.log("rows: ", rows);
  const data = [];
  //   for (const row of rows) {
  //     let currency = row.querySelectorAll("td")[0].textContent.trim();
  //     // trim, remove extra spaces, and remove new lines, get the first word
  //     const buying = row[1].textContent.replace(/\s+/g, " ").trim();

  //     const selling = row
  //       .querySelectorAll("td")[2]
  //       .textContent.replace(/\s+/g, " ")
  //       .trim();
  //     data.push({ currency, buying, selling });
  //   }
  return data;
});

console.log("data: ", data);

await browser.close();
