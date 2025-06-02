// Netlify Function for image generation
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
    const { prompt, styleOptions } = requestBody;

    if (!prompt || prompt.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Prompt is required'
        })
      };
    }

    // Build enhanced prompt
    let enhancedPrompt = prompt;

    // Add style options
    if (styleOptions) {
      if (styleOptions.style && styleOptions.style !== 'none') {
        enhancedPrompt += `, ${styleOptions.style} style`;
      }

      if (styleOptions.color && styleOptions.color !== 'none') {
        enhancedPrompt += `, ${styleOptions.color} colors`;
      }

      if (styleOptions.lighting && styleOptions.lighting !== 'none') {
        enhancedPrompt += `, ${styleOptions.lighting} lighting`;
      }

      if (styleOptions.composition && styleOptions.composition !== 'none') {
        enhancedPrompt += `, ${styleOptions.composition} composition`;
      }

      if (styleOptions.quality) {
        enhancedPrompt += `, high quality, detailed, 8k resolution`;
      }
    }

    // Call Stability API
    const response = await axios.post(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        text_prompts: [{ text: enhancedPrompt, weight: 1 }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Accept': 'application/json'
        }
      }
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        images: response.data.artifacts
      })
    };
  } catch (error) {
    console.error('Error generating image:', error.response?.data || error.message);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to generate image',
        message: error.response?.data?.message || error.message
      })
    };
  }
};
