import { createLocalReq, getPayload } from 'payload';
import { seed } from '@/endpoints/seed';
import config from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // Function can run for a maximum of 60 seconds
const payloadToken = 'payload-token';

export async function POST(req: NextRequest) {
  const payload = await getPayload({ config });

  // req.headers is already a Headers instance, just pass it directly
  const { user } = await payload.auth({ headers: req.headers });

  if (!user) {
    return new NextResponse('Action forbidden.', { status: 403 });
  }

  try {
    // Create a Payload local request object for internal API calls
    const payloadReq = await createLocalReq({ user }, payload);

    // Call your seed function
    await seed({ payload, req: payloadReq });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return new NextResponse('Error seeding data.', { status: 500 });
  }
}
