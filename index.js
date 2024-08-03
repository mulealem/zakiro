import { CronJob } from "cron";

import axios from "axios";

// import getAwashbankExchangeRates from "./awashbank.js";
// import getBankofabyssiniaExchangeRates from "./bankofabyssinia.js";
// import getCombankethExchangeRates from "./combanketh.js";
// import getDashenbankscExchangeRates from "./dashenbanksc.js";

import { createClient } from "@supabase/supabase-js";

const supabase_url = "https://wcrgvqcrbkuhagynenxm.supabase.co";
const service_role_key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xb25veGZ0eHB5aHZlamVyeGhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzY4NzMyMCwiZXhwIjoyMDI5MjYzMzIwfQ.-yyAej5pT9mKwseLdP8M_tQb1ZgVqNpXofPLFGPEZ9k";

const service_key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjcmd2cWNyYmt1aGFneW5lbnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2NzIzNzMsImV4cCI6MjAzODI0ODM3M30.g8OEBHiMFOGwBiZ-cxt4N6iJmMUsqNnmiMwZcANLUjc";

export const supabaseClient = createClient(supabase_url, service_key);

const job = new CronJob(
  // every 30 minutes
  "*/1 * * * *", // cronTime
  async function () {
    console.log("Running job");

    axios
      .get(
        "https://combanketh.et/cbeapi/daily-exchange-rates?_limit=1&_sort=Date%3ADESC"
      )
      .then(async (response) => {
        const combankethExchangeRates = response.data[0].ExchangeRate.map(
          (exchangeRate) => {
            return {
              currency: exchangeRate.currency.CurrencyCode,
              buying: exchangeRate.cashBuying,
              selling: exchangeRate.cashSelling,
            };
          }
        );
        console.log("combankethExchangeRates:: :: ", combankethExchangeRates);

        const { data: exchangeRatesData, error: exchangeRatesError } =
          await supabaseClient.from("exchange_rates_per_bank").select("*");
        if (exchangeRatesError) {
          console.error("error", exchangeRatesError);
        } else {
          //   console.log("exchangeRatesData", exchangeRatesData);
          const combankethExchangeRatesData = exchangeRatesData.filter(
            (exchangeRate) => exchangeRate.bank_title === "combanketh"
          );

          const decendingCombankethExchangeRatesData =
            combankethExchangeRatesData.sort((a, b) => b.id - a.id);

          let newCombankethExchangeRates = {
            bank_title: "combanketh",
            exchange: {
              exchange_rates: combankethExchangeRates.map((exchangeRate) => ({
                //   bank_title: "combanketh",
                currency: exchangeRate.currency,
                buying_price: exchangeRate.buying,
                selling_price: exchangeRate.selling,
              })),
            },
          };

          if (decendingCombankethExchangeRatesData.length === 0) {
            // console.log("No data found for combanketh");

            // insert combankethExchangeRates to exchangeRatesData
            const { data: newExchangeRatesData, error: newExchangeRatesError } =
              await supabaseClient
                .from("exchange_rates_per_bank")
                .insert([newCombankethExchangeRates]);

            if (newExchangeRatesError) {
              console.error("error", newExchangeRatesError);
            } else {
              console.log("INSERTED NEW DATA .");
            }
          } else {
            // console.log(typeof decendingCombankethExchangeRatesData[0].exchange);
            // console.log(decendingCombankethExchangeRatesData[0].exchange);

            const lastCombankethExchangeRatesDatasPerBank =
              decendingCombankethExchangeRatesData[0].exchange.exchange_rates;

            const newCombankethExchangeRatesExchange =
              newCombankethExchangeRates.exchange.exchange_rates;

            // compare and find the difference between lastCombankethExchangeRatesDatasPerBank and newCombankethExchangeRatesExchange
            const filteredNewCombankethExchangeRates =
              newCombankethExchangeRatesExchange.filter(
                (exchangeRate) =>
                  !lastCombankethExchangeRatesDatasPerBank.some(
                    (lastExchangeRate) =>
                      lastExchangeRate.currency === exchangeRate.currency &&
                      lastExchangeRate.buying_price ===
                        exchangeRate.buying_price &&
                      lastExchangeRate.selling_price ===
                        exchangeRate.selling_price
                  )
              );

            if (
              filteredNewCombankethExchangeRates &&
              filteredNewCombankethExchangeRates.length > 0
            ) {
              //   console.log("No new data found for combanketh");

              const {
                data: newExchangeRatesData,
                error: newExchangeRatesError,
              } = await supabaseClient.from("exchange_rates_per_bank").insert([
                {
                  bank_title: "combanketh",
                  exchange: {
                    exchange_rates: filteredNewCombankethExchangeRates,
                  },
                },
              ]);

              if (newExchangeRatesError) {
                console.error("error", newExchangeRatesError);
              } else {
                console.log("INSERTED NEW DATA");
              }
            }
          }
        }

        // const { data: exchange_rates, error } = await supabaseClient
        //     .from("exchange_rates")
        //     .insert(data);
        // if (error) {
        //     console.log("Error inserting data", error);
        // } else {
        //     console.log("Data inserted", exchange_rates);
        // }
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
);

// job.start() is optional here because of the fourth parameter set to true.
