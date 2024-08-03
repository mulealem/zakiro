import puppeteer from "puppeteer";

async function getBankofabyssiniaExchangeRates() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  // Navigate the page to a URL.
  await page.goto("https://www.bankofabyssinia.com/", {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("#tablepress-15");
  const data = await page.evaluate(() => {
    const table = document.querySelector("#tablepress-15");
    const rows = table.querySelectorAll("tbody tr");
    const data = [];
    for (const row of rows) {
      const currency = row.querySelector("td").textContent;
      const buying = row.querySelectorAll("td")[1].textContent;
      const selling = row.querySelectorAll("td")[2].textContent;
      data.push({ currency, buying, selling });
    }
    return data;
  });

  // console.log(data.slice(2, data.length - 1));

  await browser.close();

  return data.slice(2, data.length - 1);
}

export default getBankofabyssiniaExchangeRates;

// getBankofabyssiniaExchangeRates();
