const fs = require("fs");
const path = require("path");

// Paths to input files
const coverPath = "./cover.jpg"; // The visible image
const originalPath = "./original.jpg"; // The image to hide
const outputPath = "./result/steganographed.png"; // Output file

// Read the cover and original files
const coverData = fs.readFileSync(coverPath);
const originalData = fs.readFileSync(originalPath);

// Extract the filename of the original image
const originalFilename = path.basename(originalPath);

// Combine the files (include the filename and a marker)
const combinedData = Buffer.concat([
  coverData,
  Buffer.from("HIDDENSTART"),
  Buffer.from(originalFilename + "::"), // Append the filename and a separator (e.g., "::")
  originalData,
]);

// Save the output
fs.writeFileSync(outputPath, combinedData);

console.log("Image steganographed successfully:", outputPath);

const steganographedPath = "./result/steganographed.png";
const reverseDir = "./reverse";

// Read the steganographed file
const steganographedData = fs.readFileSync(steganographedPath);

// Define the marker and find its index
const marker = "HIDDENSTART";
const markerIndex = steganographedData.indexOf(marker);

if (markerIndex === -1) {
  console.error("No hidden data found.");
} else {
  // Extract data after the marker
  const dataAfterMarker = steganographedData.slice(markerIndex + marker.length);

  // Split the filename and the image data using the separator "::"
  const separator = "::";
  const separatorIndex = dataAfterMarker.indexOf(separator);

  if (separatorIndex === -1) {
    console.error("No filename found.");
  } else {
    // Extract the original filename
    const originalFilename = dataAfterMarker
      .slice(0, separatorIndex)
      .toString();

    // Extract the hidden image data
    const hiddenData = dataAfterMarker.slice(separatorIndex + separator.length);

    // Ensure the output directory exists
    if (!fs.existsSync(reverseDir)) {
      fs.mkdirSync(reverseDir, { recursive: true });
    }

    // Save the extracted data using the original filename
    const extractedPath = path.join(reverseDir, originalFilename);
    fs.writeFileSync(extractedPath, hiddenData);

    console.log("Original image extracted successfully:", extractedPath);
  }
}
