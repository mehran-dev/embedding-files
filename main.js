const fs = require("fs");

// Paths to input files
const coverPath = "./cover.jpg"; // The visible image
const originalPath = "./original.jpg"; // The image to hide
const outputPath = "./result/steganographed.png"; // Output file

// Read the cover and original files
const coverData = fs.readFileSync(coverPath);
const originalData = fs.readFileSync(originalPath);

// Combine the files
const combinedData = Buffer.concat([
  coverData,
  Buffer.from("HIDDENSTART"),
  originalData,
]);

// Save the output
fs.writeFileSync(outputPath, combinedData);

console.log("Image steganographed successfully:", outputPath);

// Path to the steganographed file
const steganographedPath = "./result/steganographed.png";
const extractedPath = "./reverse/extracted_original.jpg";

// Read the steganographed file
const steganographedData = fs.readFileSync(steganographedPath);

// Find the hidden marker

const marker = "HIDDENSTART";
const markerIndex = steganographedData.indexOf(marker);

if (markerIndex === -1) {
  console.error("No hidden data found.");
} else {
  // Extract the original image data
  const hiddenData = steganographedData.slice(markerIndex + marker.length);

  // Save the extracted data as a new file
  fs.writeFileSync(extractedPath, hiddenData);
  console.log("Original image extracted successfully:", extractedPath);
}
