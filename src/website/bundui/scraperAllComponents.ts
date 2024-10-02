import axios from "axios";
import { JSDOM } from "jsdom";
import { writeJsonFile } from "@/common/fileUtils"; // Import write utility
import { ALL_COMPONENTS_FILE, BASE_URL, FOLDER_NAME } from "./constant";

const url = `${BASE_URL}/docs/components/button`;

export const scraperAllComponents = async () => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Initialize an array to hold all component links
    const componentsArray: { text: string; href: string }[] = [];

    // Target the specific structure for Base and Components sections
    const sectionDivs = document.querySelectorAll(
      "div[data-radix-scroll-area-viewport] ul[role='list'] > li"
    );

    sectionDivs.forEach((li) => {
      const sectionHeader = li.querySelector(
        "div.text-sm\\/6.font-medium.text-zinc-950.dark\\:text-white"
      );
      const sectionItems = li.querySelectorAll("ul[role='list'] > li");

      if (sectionHeader && sectionItems.length > 0) {
        const sectionName = sectionHeader.textContent?.trim();

        // Only gather items if they are from "Base" or "Components"
        if (sectionName === "Base" || sectionName === "Components") {
          sectionItems.forEach((item) => {
            const aTag = item.querySelector("a");
            if (aTag) {
              const href = aTag.getAttribute("href");
              const text = aTag.textContent?.trim();
              if (href && text) {
                componentsArray.push({ text, href });
              }
            }
          });
        }
      }
    });

    // Write the data to a JSON file
    const outputFilePath = `${FOLDER_NAME}/${ALL_COMPONENTS_FILE}`; // Define your desired output file path
    writeJsonFile(outputFilePath, componentsArray);
    console.log(`Data successfully scraped and stored in ${outputFilePath}`);
  } catch (error: any) {
    console.error(
      `Failed to retrieve data from ${url}. Error: ${error.message}`
    );
  }
};
