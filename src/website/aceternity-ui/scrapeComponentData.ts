import axios from "axios";
import { JSDOM } from "jsdom";
import { readJsonFile, writeJsonFile } from "@/common/fileUtils"; // Adjust the import path
import {
  ALL_COMPONENTS_FILE,
  BASE_URL,
  COMPONENTS_DETAILS_FILE,
  FOLDER_NAME,
} from "./constant";

// Define the base URL of the website to scrape

export async function scrapeComponentData() {
  const jsonFilePath = `${FOLDER_NAME}/${ALL_COMPONENTS_FILE}`; // Path to the input JSON file

  const jsonData = readJsonFile(jsonFilePath);
  if (!jsonData) return; // Exit if there is an issue reading the JSON

  // Prepare an array to hold the results
  const results: { h1: string; p: string; href: string }[] = [];

  // Loop through each entry in the JSON data
  for (const entry of jsonData) {
    const href = entry.href.startsWith("http")
      ? entry.href
      : `${BASE_URL}${entry.href}`; // Construct full URL
    console.log(`Navigating to: ${href}`);

    try {
      const response = await axios.get(href);
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // Find the <h1> and <p> tags as specified
      const h1Element = document.querySelector(
        "h1.scroll-m-20.text-4xl.font-bold.tracking-tight.text-black.dark\\:text-white"
      );
      const pElement = document.querySelector(
        "p.text-lg.text-muted-foreground"
      );

      // Extract and clean the inner text
      const h1Text = h1Element
        ? h1Element.textContent?.trim()
        : "H1 Element not found.";
      const pText = pElement
        ? pElement.textContent?.trim()
        : "P Element not found.";

      // Remove any unwanted characters (like JS snippets)
      const cleanPText = pText?.replace(/self\.__wrap_n.*$/g, "").trim();

      // Log the cleaned text
      console.log(`H1 Text: ${h1Text}`);
      console.log(`P Text: ${cleanPText}`);

      // Store the results
      results.push({ h1: h1Text || "", p: cleanPText || "", href });
    } catch (error: any) {
      console.error(
        `Failed to retrieve data from ${href}. Error: ${error.message}`
      );
    }
  }

  // Write the results to a JSON file
  const resultsFilePath = `${FOLDER_NAME}/${COMPONENTS_DETAILS_FILE}`; // Path to the output JSON file
  return writeJsonFile(resultsFilePath, results);
}

// // Execute the scraping function
// scrapeComponentData();
