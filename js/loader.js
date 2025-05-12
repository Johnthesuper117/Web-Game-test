
// Load JSON data for characters and stages
async function loadJSON(filePath) {
    const response = await fetch(filePath);
    return await response.json();
}
