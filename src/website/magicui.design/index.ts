import { scrapeComponentData } from "./scrapeComponentData";
import { scraperAllComponents } from "./scraperAllComponents";

export const run = async () => {
  await scraperAllComponents();
  const res = await scrapeComponentData();
  console.log(res);
};

run();
