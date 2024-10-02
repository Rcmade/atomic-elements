import axios from "axios";
import { JSDOM } from "jsdom";
import { writeJsonFile } from "@/common/fileUtils"; // Utility function to write to a file
import { ALL_COMPONENTS_FILE, BASE_URL, FOLDER_NAME } from "./constant";

const url = `${BASE_URL}/docs`; // URL to scrape components from

export const scraperAllComponents = async () => {
  try {
    // Fetch the HTML content from the specified URL
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Array to hold all component links
    const componentsArray: { text: string; href: string }[] = [];

    // Locate the div containing the components
    const componentsDiv = document.querySelector("div.w-full.pb-20");

    // Check if the components div exists
    if (componentsDiv) {
      // Find all anchor tags within the div
      const links = componentsDiv.querySelectorAll(
        "a.group.relative.flex.w-full.items-center.rounded-md.border.border-transparent.px-2.py-1.text-muted-foreground"
      );

      // Set of ignored texts
      const ignoredTexts = new Set([
        "Installation",
        "CLI",
        "Portfolio",
        "StartupPaid",
        "SaaSNewPaid",
        "templates", // This will ignore any text containing "templates"
      ]);

      // Extract href and text from each link
      links.forEach((link) => {
        const href = link.getAttribute("href");
        const text = link.textContent?.trim();

        // Only add valid links to the array if they are not ignored
        if (
          href &&
          text &&
          !ignoredTexts.has(text) &&
          !text.includes("templates")
        ) {
          componentsArray.push({ text, href });
        }
      });
    } else {
      console.error(`Div with the specified classes not found on ${url}`);
      return; // Exit if the div is not found
    }

    // Write the scraped data to a JSON file
    const outputFilePath = `${FOLDER_NAME}/${ALL_COMPONENTS_FILE}`;
    writeJsonFile(outputFilePath, componentsArray);
    console.log(
      `Components successfully scraped and stored in ${outputFilePath}`
    );
  } catch (error: any) {
    console.error(
      `Failed to retrieve data from ${url}. Error: ${error.message}`
    );
  }
};

// Call the function to start scraping
// scraperAllComponents();
