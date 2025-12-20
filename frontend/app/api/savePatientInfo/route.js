import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const newData = await req.json();

    // Define the file path - saving to app/components/PatientSignInInfo.json
    const filePath = path.join(process.cwd(), 'app', 'components', 'PatientSignInInfo.json');

    let existingData = [];

    // Check if file exists and read existing data
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      existingData = fileContent ? JSON.parse(fileContent) : [];
    } else {
      // Ensure the folder exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }

    // Append new data
    existingData.push(newData);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

    return new Response(JSON.stringify({ message: 'Data saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving data:', error);
    return new Response(JSON.stringify({ 
      message: 'Error saving data', 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
