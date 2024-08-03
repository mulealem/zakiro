import puppeteer from "puppeteer";

async function getAwashbankExchangeRates() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // Navigate the page to a URL.
  await page.goto("https://awashbank.com/exchange-historical/", {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("#exchange-rates-table");
  const data = await page.evaluate(() => {
    const table = document.querySelector("#exchange-rates-table");
    const rows = table.querySelectorAll("tbody tr");
    const data = [];
    for (const row of rows) {
      const currency = row.querySelector("td").textContent.trim().split(" ")[0];
      const buying = row.querySelectorAll("td")[1].textContent;
      const selling = row.querySelectorAll("td")[2].textContent;
      data.push({ currency, buying, selling });
    }
    return data;
  });

  //  console.log(data);

  await browser.close();

  return data;
}

export default getAwashbankExchangeRates;

// getAwashbankExchangeRates();
