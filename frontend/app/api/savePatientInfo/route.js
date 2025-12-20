// API Route to update PatientSignInInfo.json in GitHub repo
export async function POST(req) {
  try {
    const newData = await req.json();

    // GitHub configuration - Get from Vercel Environment Variables (NEVER hardcode!)
    const GITHUB_TOKEN = "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";
    const REPO_OWNER = "HassanNetSec";
    const REPO_NAME = "the-doctors-friends";
    const FILE_PATH = 'frontend/app/components/PatientSignInInfo.json';

    // Validate environment variables
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      throw new Error('Missing GitHub configuration. Please set GITHUB_TOKEN, GITHUB_OWNER, and GITHUB_REPO in Vercel environment variables.');
    }

    // Step 1: Get current file content from GitHub
    const getResponse = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!getResponse.ok) {
      throw new Error(`Failed to fetch file: ${getResponse.statusText}`);
    }

    const fileData = await getResponse.json();
    const sha = fileData.sha; // Required for updating

    // Decode existing content
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    let existingData = JSON.parse(content);

    // Step 2: Append new data
    existingData.push(newData);

    // Step 3: Update file on GitHub
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
          sha: sha,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`Failed to update file: ${errorData.message}`);
    }

    return new Response(JSON.stringify({
      message: 'Data saved successfully to GitHub',
      data: newData
    }), {
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

export async function GET() {
  try {
    // GitHub configuration - Get from Vercel Environment Variables (NEVER hardcode!)
    const GITHUB_TOKEN = "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";
    const REPO_OWNER = "HassanNetSec";
    const REPO_NAME = "the-doctors-friends";
    const FILE_PATH = 'frontend/app/components/PatientSignInInfo.json';

    // Validate environment variables
    if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
      throw new Error('Missing GitHub configuration.');
    }

    const response = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (response.ok) {
      const fileData = await response.json();
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const data = JSON.parse(content);

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({
      message: 'Error fetching data',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
