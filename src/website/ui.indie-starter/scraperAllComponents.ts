import axios from "axios";
import { JSDOM } from "jsdom";
import { writeJsonFile } from "@/common/fileUtils"; // Utility function to write to a file
import { ALL_COMPONENTS_FILE, BASE_URL, FOLDER_NAME } from "./constant";

const url = `${BASE_URL}/docs`; // Replace with the correct components URL

export const scraperAllComponents = async () => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Initialize an array to hold all component links, excluding "Getting Started" and "Templates"
    const componentsArray: { text: string; href: string }[] = [];

    // Locate all the section headers (p elements with font-medium class)
    const sections = document.querySelectorAll("p.font-medium");

    sections.forEach((section) => {
      // Get the section title text
      const sectionTitle = section.textContent?.trim();

      // Find the following siblings that are anchor tags
      let sibling = section.nextElementSibling;
      while (sibling) {
        // Stop if we encounter another header
        if (
          sibling.nodeName === "P" && // Change here
          sibling.classList.contains("font-medium")
        ) {
          break;
        }

        // If the sibling is an anchor, extract the link and text
        if (sibling.nodeName === "A") {
          // Change here
          const href = sibling.getAttribute("href");
          const text = sibling.textContent?.trim();
          if (href && text) {
            componentsArray.push({ text, href });
          }
        }

        // Move to the next sibling
        sibling = sibling.nextElementSibling;
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
