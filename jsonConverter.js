import fs from "fs";

// Read the JSON file
const jsonFilePath = "serviceAccount.json";
const outputFilePath = "variable.txt";

try {
  // Read and parse JSON file
  const jsonData = fs.readFileSync(jsonFilePath, "utf8");
  const jsonObject = JSON.parse(jsonData);

  // Convert JSON object to single-line string
  const jsonString = JSON.stringify(jsonObject).replace(/\n/g, "");

  // Write to variable.txt
  fs.writeFileSync(outputFilePath, jsonString, "utf8");
  console.log("Successfully written to variable.txt");
} catch (error) {
  console.error("Error processing the JSON file:", error);
}
