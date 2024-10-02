import axios from "axios";
import { JSDOM } from "jsdom";
import { writeJsonFile } from "@/common/fileUtils"; // Utility function to write to a file
import { ALL_COMPONENTS_FILE, BASE_URL, FOLDER_NAME } from "./constant";

const url = `${BASE_URL}/components`; // Replace with the correct components URL

export const scraperAllComponents = async () => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Initialize an array to hold all component links
    const componentsArray: { text: string; href: string }[] = [];

    // Locate the specific div containing the components
    const componentsDiv = document.querySelector(
      "div.flex.flex-col.items-start.justify-center.gap-4.text-sm.font-medium"
    );

    if (componentsDiv) {
      // Find all anchor tags within the div
      const links = componentsDiv.querySelectorAll(
        "a.hover\\:underline.text-secondary, a.hover\\:underline.text-primary"
      );

      links.forEach((link) => {
        const href = link.getAttribute("href");
        const text = link.textContent?.trim();
        if (href && text) {
          componentsArray.push({ text, href });
        }
      });
    } else {
      console.error(`Div with the specified classes not found on ${url}`);
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
