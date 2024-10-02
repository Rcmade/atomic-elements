import axios from "axios";
import { JSDOM } from "jsdom";
import { readJsonFile, writeJsonFile } from "@/common/fileUtils"; // Adjust the import path
import {
  ALL_COMPONENTS_FILE,
  BASE_URL,
  COMPONENTS_DETAILS_FILE,
  FOLDER_NAME,
} from "./constant";

// Function to remove unwanted script or dynamic content from the <p> tag
function cleanTextContent(element: Element | null): string {
  if (!element) return "P Element not found.";

  // Clone the element to avoid modifying the original DOM structure
  const clonedElement = element.cloneNode(true) as Element;

  // Remove <script> tags or any other unwanted child elements from the cloned element
  const scripts = clonedElement.querySelectorAll("script");
  scripts.forEach((script) => script.remove());

  // Return the cleaned-up text content
  return clonedElement.textContent?.trim() || "P Element not found.";
}

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

      // Find the main content with class "nx-w-full ..."
      const mainElement = document.querySelector("main");

      if (mainElement) {
        // Extract <h1> text
        const h1Element = mainElement.querySelector("h1");
        const h1Text = h1Element
          ? h1Element.textContent?.trim()
          : "H1 Element not found.";

        // Extract <p> text
        const pElement = mainElement.querySelector("p");
        const cleanPText = pElement
          ? cleanTextContent(pElement)
          : "P Element not found."; // Assign empty string for p if not found

        // Log the cleaned text
        console.log(`H1 Text: ${h1Text}`);
        console.log(`P Text: ${cleanPText}`);

        // Store the results
        results.push({ h1: h1Text || "", p: cleanPText || "", href });
      } else {
        console.error(`Main element not found on ${href}`);
      }
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

// Execute the scraping function
// scrapeComponentData();
