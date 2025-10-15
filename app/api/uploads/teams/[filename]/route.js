import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(request, { params }) {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), 'uploads/teams/', filename);

  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);
    const mimeType = mime.lookup(filename) || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: { 'Content-Type': mimeType },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error serving file' }, { status: 500 });
  }
}
