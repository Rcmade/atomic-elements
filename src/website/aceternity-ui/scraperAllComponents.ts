import axios from "axios";
import { JSDOM } from "jsdom";
import * as path from "path";
import { writeJsonFile } from "@/common/fileUtils"; // Import write utility
import { ALL_COMPONENTS_FILE, BASE_URL, FOLDER_NAME } from "./constant";

const url = `${BASE_URL}/components`;

export const scraperAllComponents = async () => {
  await axios
    .get(url)
    .then((response) => {
      // Parse the content of the page with jsdom
      const dom = new JSDOM(response.data);
      const document = dom.window.document;

      // Find the div with class 'pb-4' that contains the h4 text "All Components"
      const divs = document.querySelectorAll("div.pb-4");

      const data: { text: string; href: string }[] = [];

      divs.forEach((div) => {
        const h4 = div.querySelector(
          "h4.mb-1.rounded-md.px-2.py-1.text-sm.font-semibold.text-black.dark\\:text-white"
        );
        if (h4 && h4.textContent?.includes("All Components")) {
          // Extract the href and text from each <a> tag inside the div
          const aTags = div.querySelectorAll("a");
          aTags.forEach((aTag) => {
            const href = aTag.getAttribute("href"); // Get the href attribute
            const text = aTag.textContent?.trim(); // Get the inner text
            if (href && text) {
              // Ensure href and text are not null
              data.push({ text, href });
            }
          });
        }
      });

      // Write the data to a JSON file
      const outputFilePath = `${FOLDER_NAME}/${ALL_COMPONENTS_FILE}`; // Path to the output JSON file
      writeJsonFile(outputFilePath, data);
    })
    .catch((error) => {
      console.error(
        `Failed to retrieve data from ${url}. Error: ${error.message}`
      );
    });
};
