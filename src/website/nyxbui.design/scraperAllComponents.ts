import axios from "axios";
import { JSDOM } from "jsdom";
import { writeJsonFile } from "@/common/fileUtils"; // Utility function to write to a file
import { ALL_COMPONENTS_FILE, BASE_URL, FOLDER_NAME } from "./constant";

const url = `${BASE_URL}/docs/components`; // Replace with the correct components URL

export const scraperAllComponents = async () => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Initialize an array to hold all component links, excluding "Getting Started" and "Templates"
    const componentsArray: { text: string; href: string }[] = [];

    // Locate all the section headers (h4 elements)
    const sections = document.querySelectorAll("h4");

    sections.forEach((section) => {
      // Exclude "Getting Started" and "Templates" sections
      if (
        !section.textContent?.includes("Getting Started") &&
        !section.textContent?.includes("Templates")
      ) {
        // Find the following sibling div containing component links
        const componentDiv = section.nextElementSibling;
        if (componentDiv) {
          const links = componentDiv.querySelectorAll("a"); // Get all anchor tags

          links.forEach((link) => {
            const href = link.getAttribute("href");
            const text = link.textContent?.trim();

            if (href && text) {
              componentsArray.push({ text, href });
            }
          });
        }
      }
    });

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
