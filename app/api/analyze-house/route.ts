import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Determine media type (default to jpeg if not provided)
    const mediaType = file.type || 'image/jpeg';

    console.log('Sending image to Claude API, size:', buffer.length, 'bytes, type:', mediaType);

    // Send to Claude API
    console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);
    console.log('Image size:', buffer.length, 'bytes');
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: 'Analyze this house image and provide detailed step-by-step instructions on how to build it. Break down the construction process into logical phases including: foundation, framing, exterior work, interior work, and finishing. Be specific and technical, as if explaining to a construction team.',
            },
          ],
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
