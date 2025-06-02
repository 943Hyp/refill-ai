// Netlify Function for image analysis
const axios = require('axios');

exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Handle POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const requestBody = JSON.parse(event.body);
    const { imageBase64 } = requestBody;

    if (!imageBase64) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Image is required'
        })
      };
    }

    // Call OpenAI API for image analysis
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image and create a detailed prompt that could be used to generate a similar image with an AI image generator. Focus on subject, style, composition, colors, and mood. Be specific but concise."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        prompt: response.data.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('Error analyzing image:', error.response?.data || error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to analyze image',
        message: error.response?.data?.message || error.message
      })
    };
  }
};
