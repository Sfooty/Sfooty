import jwt from 'jsonwebtoken';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { CollectionSlug } from 'payload';

const payloadToken = 'payload-token';

export async function GET(req: NextRequest) {
  const payload = await getPayload({ config: configPromise });

  // Use NextRequest cookies API
  const tokenCookie = req.cookies.get(payloadToken);
  const token = tokenCookie?.value;

  const { searchParams } = req.nextUrl;
  const path = searchParams.get('path');
  const collection = searchParams.get('collection') as CollectionSlug;
  const slug = searchParams.get('slug');
  const previewSecret = searchParams.get('previewSecret');

  if (previewSecret) {
    return new NextResponse('You are not allowed to preview this page', { status: 403 });
  }

  if (!path || !collection || !slug) {
    return new NextResponse('Missing required parameters', { status: 404 });
  }

  if (!token) {
    return new NextResponse('You are not allowed to preview this page', { status: 403 });
  }

  if (!path.startsWith('/')) {
    return new NextResponse('This endpoint can only be used for internal previews', { status: 500 });
  }

  let user;
  try {
    user = jwt.verify(token, payload.secret);
  } catch (error) {
    payload.logger.error('Error verifying token for live preview:', error);
  }

  const draft = await draftMode();

  if (!user) {
    draft.disable();
    return new NextResponse('You are not allowed to preview this page', { status: 403 });
  }

  // Verify the given slug exists
  try {
    const docs = await payload.find({
      collection,
      draft: true,
      limit: 1,
      pagination: false,
      depth: 0,
      select: {},
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    if (!docs.docs.length) {
      return new NextResponse('Document not found', { status: 404 });
    }
  } catch (error) {
    payload.logger.error('Error fetching document for live preview:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }

  draft.enable();

  // Redirect using Next.js redirect helper
  return redirect(path);
}
