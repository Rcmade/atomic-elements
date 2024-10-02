import * as fs from "fs";
import * as path from "path";

export const readJsonFile = (folderFilePath: string) => {
  const outputDirectory = path.join(__dirname, `../results/${folderFilePath}`);
  if (!fs.existsSync(outputDirectory)) {
    console.error(
      "JSON file not found. Please ensure the scraping data is available."
    );
    return null;
  }
  return JSON.parse(fs.readFileSync(outputDirectory, "utf-8")); // Fix: Read from outputDirectory
};

export const writeJsonFile = (folderFileName: string, data: any) => {
  const outputDirectory = path.join(__dirname, `../results/${folderFileName}`);
  // Ensure the directory exists before writing
  const dirName = path.dirname(outputDirectory);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }
  fs.writeFileSync(outputDirectory, JSON.stringify(data, null, 4));
  const result = `Data saved to ${outputDirectory}`;
  console.log(result);
  return result;
};

console.log(__dirname);
