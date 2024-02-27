import { countries } from "./countries-time.js";
const { log } = console;

function getCurrentTimeByCountry(country) {
  const countryData = countries.find((c) => {
    if (c.name.toLowerCase() === country.toLowerCase()) {
      return { timeZone: c.timezones, name: c.name, cc: c.country_code };
    }
  });

  if (!countryData) {
    return "Time zone not found for the specified country.";
  }
  const options = {
    timeZone: countryData.timezones[0],
    hour12: false,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return new Date().toLocaleString(getCurrentTimeByCountry.cc, options);
}

log(getCurrentTimeByCountry("Indonesia"));
