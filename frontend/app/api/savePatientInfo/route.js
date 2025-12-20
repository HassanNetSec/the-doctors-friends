import { NextResponse } from 'next/server';

// ✅ CORRECT PATH: Must start with "frontend/" and NO leading slash
// ✅ CORRECT: Relative path starting from the repository root
const FILE_PATH = 'frontend/app/components/PatientSignInInfo.json';

export async function GET(req) {
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.GITHUB_OWNER;
    const REPO_NAME = process.env.GITHUB_REPO;

    // Validate environment variables
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      return NextResponse.json({ 
        message: 'Missing GitHub configuration', 
        error: 'GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO not set' 
      }, { status: 500 });
    }

    console.log(`Fetching from GitHub: ${REPO_OWNER}/${REPO_NAME}/${FILE_PATH}`);

    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        cache: 'no-store' // Ensure we always get fresh data
      }
    );

    // ✅ FIX: If file doesn't exist (404), return empty array instead of crashing
    if (response.status === 404) {
      console.log('File not found on GitHub, returning empty list.');
      return NextResponse.json([], { status: 200 });
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API Error ${response.status}: ${errorText}`);
    }

    const fileData = await response.json();
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const data = JSON.parse(content);

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Error fetching data', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const newData = await req.json();
    
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = process.env.GITHUB_OWNER;
    const REPO_NAME = process.env.GITHUB_REPO;
    
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      throw new Error('Missing GitHub configuration.');
    }
    
    // 1. Fetch existing file to get its SHA (required for updates)
    const getResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        cache: 'no-store'
      }
    );

    let existingData = [];
    let sha = null;

    // If file exists, parse it. If 404, we will create a new file (sha remains null)
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      existingData = JSON.parse(content);
    } else if (getResponse.status !== 404) {
       throw new Error(`Failed to fetch file: ${getResponse.statusText}`);
    }
    
    // 2. Append new data
    existingData.push(newData);
    
    // 3. Update (or Create) file on GitHub
    const updateResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Add patient signin: ${newData.email}`,
          content: Buffer.from(JSON.stringify(existingData, null, 2)).toString('base64'),
          sha: sha, // If sha is null, GitHub creates a new file.
        }),
      }
    );
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update file: ${errorData.message}`);
    }

    return NextResponse.json({ message: 'Data saved successfully', data: newData }, { status: 200 });

  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ message: 'Error saving data', error: error.message }, { status: 500 });
  }
}
