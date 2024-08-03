import puppeteer from "puppeteer";

async function getDashenbankscExchangeRates() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  // Navigate the page to a URL.
  await page.goto("https://dashenbanksc.com/daily-exchange-rates/", {
    waitUntil: "networkidle0",
  });

  await page.waitForSelector("table");
  const data = await page.evaluate(() => {
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tbody tr");
    const data = [];
    for (const row of rows) {
      let currency = row.querySelectorAll("td")[1].textContent.trim();
      // trim, remove extra spaces, and remove new lines, get the first word
      const buying = row
        .querySelectorAll("td")[2]
        .textContent.replace(/\s+/g, " ")
        .trim();

      const selling = row
        .querySelectorAll("td")[3]
        .textContent.replace(/\s+/g, " ")
        .trim();
      data.push({ currency, buying, selling });
    }

    const maps = [
      {
        current: "US Dollar",
        updated: "USD",
      },
      {
        current: "Euro",
        updated: "EUR",
      },
      {
        current: "Pound Sterling",
        updated: "GBP",
      },
      {
        current: "Canadian Dollar",
        updated: "CAD",
      },

      // {
      //   currency: 'United Arab Emirates Dirham',
      //   buying: '22.3694',
      //   selling: '24.8300'
      // },
      // { currency: 'Saudi Riyal', buying: '21.9013', selling: '24.3104' },
      // { currency: 'Chinese Yuan', buying: '11.3810', selling: '12.6329' }
      {
        current: "United Arab Emirates Dirham",
        updated: "AED",
      },
      {
        current: "Saudi Riyal",
        updated: "SAR",
      },
      {
        current: "Chinese Yuan",
        updated: "CNY",
      },
    ];

    return data.map((item) => {
      const found = maps.find((map) => map.current === item.currency);
      if (found) {
        return {
          currency: found.updated,
          buying: item.buying,
          selling: item.selling,
        };
      }
      return item;
    });
  });

  //  console.log(data);

  await browser.close();

  return data.slice(1, data.length - 1);
}

export default getDashenbankscExchangeRates;

// getDashenbankscExchangeRates();
