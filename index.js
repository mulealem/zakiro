import { CronJob } from "cron";

import getAwashbankExchangeRates from "./awashbank.js";
import getBankofabyssiniaExchangeRates from "./bankofabyssinia.js";
import getCombankethExchangeRates from "./combanketh.js";
import getDashenbankscExchangeRates from "./dashenbanksc.js";

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
    console.log("You will see this message every minute");
    const dashenbankscExchangeRates = await getDashenbankscExchangeRates();
    const combankethExchangeRates = await getCombankethExchangeRates();
    const awashbankExchangeRates = await getAwashbankExchangeRates();
    const bankofabyssiniaExchangeRates =
      await getBankofabyssiniaExchangeRates();

    const { data: exchangeRatesData, error: exchangeRatesError } =
      await supabaseClient.from("exchange_rates_per_bank").select("*");
    if (exchangeRatesError) {
      console.error("error", exchangeRatesError);
    } else {
      //   console.log("exchangeRatesData", exchangeRatesData);

      const dashenbankscExchangeRatesData = exchangeRatesData.filter(
        (exchangeRate) => exchangeRate.bank_title === "dashenbanksc"
      );

      const combankethExchangeRatesData = exchangeRatesData.filter(
        (exchangeRate) => exchangeRate.bank_title === "combanketh"
      );

      const awashbankExchangeRatesData = exchangeRatesData.filter(
        (exchangeRate) => exchangeRate.bank_title === "awashbank"
      );

      const bankofabyssiniaExchangeRatesData = exchangeRatesData.filter(
        (exchangeRate) => exchangeRate.bank_title === "bankofabyssinia"
      );

      let newDashenbankscExchangeRates = {
        bank_title: "dashenbanksc",
        exchange: {
          exchange_rates: dashenbankscExchangeRates.map((exchangeRate) => ({
            //   bank_title: "dashenbanksc",
            currency: exchangeRate.currency,
            buying_price: exchangeRate.buying,
            selling_price: exchangeRate.selling,
          })),
        },
      };

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

      let newAwashbankExchangeRates = {
        bank_title: "awashbank",
        exchange: {
          exchange_rates: awashbankExchangeRates.map((exchangeRate) => ({
            //   bank_title: "combanketh",
            currency: exchangeRate.currency,
            buying_price: exchangeRate.buying,
            selling_price: exchangeRate.selling,
          })),
        },
      };

      let newBankofabyssiniaExchangeRates = {
        bank_title: "bankofabyssinia",
        exchange: {
          exchange_rates: bankofabyssiniaExchangeRates.map((exchangeRate) => ({
            //   bank_title: "combanketh",
            currency: exchangeRate.currency,
            buying_price: exchangeRate.buying,
            selling_price: exchangeRate.selling,
          })),
        },
      };

      const decendingDashenbankscExchangeRatesData =
        dashenbankscExchangeRatesData.sort((a, b) => b.id - a.id);

      const decendingCombankethExchangeRatesData =
        combankethExchangeRatesData.sort((a, b) => b.id - a.id);

      const decendingAwashbankExchangeRatesData =
        awashbankExchangeRatesData.sort((a, b) => b.id - a.id);

      const decendingBankofabyssiniaExchangeRatesData =
        bankofabyssiniaExchangeRatesData.sort((a, b) => b.id - a.id);

      if (decendingDashenbankscExchangeRatesData.length === 0) {
        // console.log("No data found for dashenbanksc");

        // insert dashenbankscExchangeRates to exchangeRatesData
        const { data: newExchangeRatesData, error: newExchangeRatesError } =
          await supabaseClient
            .from("exchange_rates_per_bank")
            .insert([newDashenbankscExchangeRates]);

        if (newExchangeRatesError) {
          console.error("error", newExchangeRatesError);
        }
      } else {
        // console.log(typeof decendingDashenbankscExchangeRatesData[0].exchange);
        // console.log(decendingDashenbankscExchangeRatesData[0].exchange);
        const lastDashenbankscExchangeRatesDatasPerBank =
          decendingDashenbankscExchangeRatesData[0].exchange.exchange_rates;

        const newDashenbankscExchangeRatesExchange =
          newDashenbankscExchangeRates.exchange.exchange_rates;

        // compare and find the difference between lastDashenbankscExchangeRatesDatasPerBank and newDashenbankscExchangeRatesExchange
        const filteredNewDashenbankscExchangeRates =
          newDashenbankscExchangeRatesExchange.filter(
            (exchangeRate) =>
              !lastDashenbankscExchangeRatesDatasPerBank.some(
                (lastExchangeRate) =>
                  lastExchangeRate.currency === exchangeRate.currency &&
                  lastExchangeRate.buying_price === exchangeRate.buying_price &&
                  lastExchangeRate.selling_price === exchangeRate.selling_price
              )
          );

        if (
          filteredNewDashenbankscExchangeRates &&
          filteredNewDashenbankscExchangeRates.length > 0
        ) {
          //   console.log("No new data found for dashenbanksc");

          const { data: newExchangeRatesData, error: newExchangeRatesError } =
            await supabaseClient.from("exchange_rates_per_bank").insert([
              {
                bank_title: "dashenbanksc",
                exchange: {
                  exchange_rates: filteredNewDashenbankscExchangeRates,
                },
              },
            ]);

          if (newExchangeRatesError) {
            console.error("error", newExchangeRatesError);
          } else {
            // console.log("INSERTED NEW DATA");
          }
        }

        // given dashenbankscExchangeRatesData as array of currency, buying_price, selling_price only select last item per currency

        //   dashenbankscExchangeRates

        // console.log(
        //   "lastDashenbankscExchangeRatesDatasPerCurrency",
        //   lastDashenbankscExchangeRatesDatasPerCurrency
        // );
      }

      if (decendingCombankethExchangeRatesData.length === 0) {
        // console.log("No data found for combanketh");

        // insert combankethExchangeRates to exchangeRatesData
        const { data: newExchangeRatesData, error: newExchangeRatesError } =
          await supabaseClient
            .from("exchange_rates_per_bank")
            .insert([newCombankethExchangeRates]);

        if (newExchangeRatesError) {
          console.error("error", newExchangeRatesError);
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
                  lastExchangeRate.buying_price === exchangeRate.buying_price &&
                  lastExchangeRate.selling_price === exchangeRate.selling_price
              )
          );

        if (
          filteredNewCombankethExchangeRates &&
          filteredNewCombankethExchangeRates.length > 0
        ) {
          //   console.log("No new data found for combanketh");

          const { data: newExchangeRatesData, error: newExchangeRatesError } =
            await supabaseClient.from("exchange_rates_per_bank").insert([
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
            // console.log("INSERTED NEW DATA");
          }
        }
      }

      if (decendingAwashbankExchangeRatesData.length === 0) {
        // console.log("No data found for combanketh");

        // insert combankethExchangeRates to exchangeRatesData
        const { data: newExchangeRatesData, error: newExchangeRatesError } =
          await supabaseClient
            .from("exchange_rates_per_bank")
            .insert([newAwashbankExchangeRates]);

        if (newExchangeRatesError) {
          console.error("error", newExchangeRatesError);
        }
      } else {
        // console.log(typeof decendingCombankethExchangeRatesData[0].exchange);
        // console.log(decendingCombankethExchangeRatesData[0].exchange);
        const lastAwashbankExchangeRatesDatasPerBank =
          decendingAwashbankExchangeRatesData[0].exchange.exchange_rates;

        const newAwashbankExchangeRatesExchange =
          newAwashbankExchangeRates.exchange.exchange_rates;

        // compare and find the difference between lastCombankethExchangeRatesDatasPerBank and newCombankethExchangeRatesExchange
        const filteredNewAwashbankExchangeRates =
          newAwashbankExchangeRatesExchange.filter(
            (exchangeRate) =>
              !lastAwashbankExchangeRatesDatasPerBank.some(
                (lastExchangeRate) =>
                  lastExchangeRate.currency === exchangeRate.currency &&
                  lastExchangeRate.buying_price === exchangeRate.buying_price &&
                  lastExchangeRate.selling_price === exchangeRate.selling_price
              )
          );

        if (
          filteredNewAwashbankExchangeRates &&
          filteredNewAwashbankExchangeRates.length > 0
        ) {
          //   console.log("No new data found for combanketh");

          const { data: newExchangeRatesData, error: newExchangeRatesError } =
            await supabaseClient.from("exchange_rates_per_bank").insert([
              {
                bank_title: "awashbank",
                exchange: {
                  exchange_rates: filteredNewAwashbankExchangeRates,
                },
              },
            ]);

          if (newExchangeRatesError) {
            console.error("error", newExchangeRatesError);
          } else {
            // console.log("INSERTED NEW DATA");
          }
        }
      }

      if (decendingBankofabyssiniaExchangeRatesData.length === 0) {
        // console.log("No data found for combanketh");

        // insert combankethExchangeRates to exchangeRatesData
        const { data: newExchangeRatesData, error: newExchangeRatesError } =
          await supabaseClient
            .from("exchange_rates_per_bank")
            .insert([newBankofabyssiniaExchangeRates]);

        if (newExchangeRatesError) {
          console.error("error", newExchangeRatesError);
        }
      } else {
        // console.log(typeof decendingCombankethExchangeRatesData[0].exchange);
        // console.log(decendingCombankethExchangeRatesData[0].exchange);
        const lastBankofabyssiniaExchangeRatesDatasPerBank =
          decendingBankofabyssiniaExchangeRatesData[0].exchange.exchange_rates;

        const newBankofabyssiniaExchangeRatesExchange =
          newBankofabyssiniaExchangeRates.exchange.exchange_rates;

        // compare and find the difference between lastCombankethExchangeRatesDatasPerBank and newCombankethExchangeRatesExchange
        const filteredNewBankofabyssiniaExchangeRates =
          newBankofabyssiniaExchangeRatesExchange.filter(
            (exchangeRate) =>
              !lastBankofabyssiniaExchangeRatesDatasPerBank.some(
                (lastExchangeRate) =>
                  lastExchangeRate.currency === exchangeRate.currency &&
                  lastExchangeRate.buying_price === exchangeRate.buying_price &&
                  lastExchangeRate.selling_price === exchangeRate.selling_price
              )
          );

        if (
          filteredNewBankofabyssiniaExchangeRates &&
          filteredNewBankofabyssiniaExchangeRates.length > 0
        ) {
          //   console.log("No new data found for combanketh");

          const { data: newExchangeRatesData, error: newExchangeRatesError } =
            await supabaseClient.from("exchange_rates_per_bank").insert([
              {
                bank_title: "bankofabyssinia",
                exchange: {
                  exchange_rates: filteredNewBankofabyssiniaExchangeRates,
                },
              },
            ]);

          if (newExchangeRatesError) {
            console.error("error", newExchangeRatesError);
          } else {
            // console.log("INSERTED NEW DATA");
          }
        }
      }
    }
  }, // onTick
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
);
// job.start() is optional here because of the fourth parameter set to true.
