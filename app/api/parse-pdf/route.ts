import { NextResponse } from 'next/server'
import pdf from 'pdf-parse/lib/pdf-parse.js' 

export const config = {
  api: {
    bodyParser: false, // Disable body parser since we're handling FormData
    responseLimit: '10mb',
  },
};

export async function POST(req: Request) {
  try {
    // Add CORS headers
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, { headers });
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers }
      )
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse PDF
    const data = await pdf(buffer)

    return NextResponse.json({
      text: data.text,
    }, { headers })

  } catch (error) {
    console.error('PDF parsing error:', error)
    return NextResponse.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    )
  }
} 