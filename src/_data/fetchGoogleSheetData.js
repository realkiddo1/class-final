import axios from 'axios';
import fs from 'fs';
import { parse } from 'csv-parse';

const sheetUrl = 'https://docs.google.com/spreadsheets/d/1_vdiqxMdx97RnLRkAiL0s6WJhT8bG8Z19fdM4_ylwFc/export?format=csv&id=1_vdiqxMdx97RnLRkAiL0s6WJhT8bG8Z19fdM4_ylwFc';

async function fetchData() {
  try {
    console.log('Starting data fetch...');
    
    // Fetch the data from Google Sheets
    const response = await axios.get(sheetUrl);

    if (response.status !== 200) {
      console.error('Failed to fetch data. HTTP Status:', response.status);
      return;
    }

    console.log('Successfully fetched data from Google Sheets.');

    // Parse the CSV data using csv-parse library
    parse(response.data, {
      columns: true, // Use the first row as column headers
      skip_empty_lines: true, // Skip empty lines
    }, (err, output) => {
      if (err) {
        console.error('Error parsing CSV data:', err);
        return;
      }

      console.log('Parsed Data:', output); // Log the parsed data

      // Check if we got any valid data
      if (output.length === 0) {
        console.error('No valid data found after parsing.');
        return;
      }

      // Save the data as a JSON file
      fs.writeFileSync('src/_data/googleSheetData.json', JSON.stringify(output, null, 2));
      console.log('Google Sheet data saved successfully to googleSheetData.json');
    });

  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
  }
}

// Run the function
fetchData();
