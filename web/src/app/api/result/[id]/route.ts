import { getTestResult } from '@/actions';
import { B5Error } from '@/types';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id.substring(0, 24);
  if (!/^[a-f0-9]{24}$/.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const lang = request.nextUrl.searchParams.get('lang') ?? undefined;

  try {
    const report = await getTestResult(id, lang);
    if (!report) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(report);
  } catch (error) {
    if (error instanceof B5Error && error.name === 'NotFoundError') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
