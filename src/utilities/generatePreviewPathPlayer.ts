import { PayloadRequest, CollectionSlug } from 'payload';

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  players: '/players',
  pages: '',
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  req: PayloadRequest;
};

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (!slug) return '/players'; // Fallback for broken URLs

  // Extract last part of slug to remove admin path
  const cleanSlug = slug.split('/').pop()?.replace(/-+$/, ''); // Remove trailing hyphens

  if (!cleanSlug) return '/players'; // Ensure we have a valid slug

  const collectionPath = collectionPrefixMap[collection] || '';

  const encodedParams = new URLSearchParams({
    slug: cleanSlug,
    collection,
    path: `${collectionPath}/${cleanSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  });

  const url = `/next/preview?${encodedParams.toString()}`;

  console.log('Generated Preview URL:', url); // Debugging log

  return url;
};
