import puppeteer from "puppeteer";

async function getCombankethExchangeRates() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // Navigate the page to a URL.
  await page.goto("https://combanketh.et/en/exchange-rate", {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("table");
  const data = await page.evaluate(() => {
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tbody tr");
    const data = [];
    for (const row of rows) {
      let currencyContent = row.querySelector("td").textContent;
      // trim, remove extra spaces, and remove new lines, get the first word
      const currency = currencyContent
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")[0];
      const buying = row
        .querySelectorAll("td")[1]
        .textContent.replace(/\s+/g, " ")
        .trim();
      const selling = row
        .querySelectorAll("td")[2]
        .textContent.replace(/\s+/g, " ")
        .trim();
      data.push({ currency, buying, selling });
    }
    return data;
  });

  //  console.log(data);

  await browser.close();

  return data;
}

export default getCombankethExchangeRates;

// getCombankethExchangeRates();
