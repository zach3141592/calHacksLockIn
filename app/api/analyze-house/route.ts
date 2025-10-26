import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    let file: File | null = null;
    let text: string | null = null;

    // Handle both FormData and JSON
    if (contentType && contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      file = formData.get('image') as File | null;
      text = formData.get('text') as string | null;
    } else if (contentType && contentType.includes('application/json')) {
      const jsonBody = await request.json();
      text = jsonBody.prompt;
    }

    // Need either image or text (or both)
    if (!file && !text) {
      return NextResponse.json({ error: 'Please provide an image, text, or both' }, { status: 400 });
    }

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Build content array
    const content: any[] = [];

    // Add image if provided
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = buffer.toString('base64');
      const mediaType = file.type || 'image/jpeg';

      console.log('Sending image to Claude API, size:', buffer.length, 'bytes, type:', mediaType);

      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Image,
        },
      });
    }

    // Build the prompt text
    let promptText = '';
    
    // Check if this is a blueprint request
    const isBlueprintRequest = text && text.toLowerCase().includes('blueprint');
    
    if (text) {
      if (isBlueprintRequest) {
        // For blueprints, request ASCII/diagram-based technical drawings
        promptText = text;
      } else {
        // For construction plan, provide detailed instructions
        promptText = `The user wants to build: ${text}. `;
      }
    }
    
    if (file && !isBlueprintRequest) {
      promptText += 'Analyze the provided image and provide detailed step-by-step instructions on how to build what is shown. ';
    }
    
    if (!isBlueprintRequest) {
      promptText += `Break down the construction process into logical phases including: foundation, framing, exterior work, interior work, and finishing. Be specific and technical, as if explaining to a construction team.

For EACH phase, provide:
1. A detailed technical description of what needs to be built
2. List of required materials
3. List of tools and equipment needed
4. Step-by-step construction instructions
5. Important safety considerations
6. Quality control checkpoints

Format the response as structured text. Provide only technical information. Do not include questions, conversational phrases, or offers of additional help.`;
    }

    content.push({
      type: 'text',
      text: promptText,
    });

    // Send to Claude API
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : 'Unable to generate response';

    console.log('Successfully received response from Claude API');
    return NextResponse.json({ steps: responseText });
  } catch (error: any) {
    console.error('Error analyzing image:', error);
    console.error('Error details:', {
      message: error?.message,
      status: error?.status,
      name: error?.name,
      stack: error?.stack
    });
    const errorMessage = error?.message || 'Failed to analyze image';
    return NextResponse.json({ 
      error: errorMessage,
      details: error?.status ? `HTTP ${error.status}` : undefined
    }, { status: 500 });
  }
}
