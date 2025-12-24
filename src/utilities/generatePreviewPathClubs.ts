import { PayloadRequest, CollectionSlug } from 'payload';

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  clubs: '/clubs',
  pages: '',
};

type Props = {
  collection: keyof typeof collectionPrefixMap;
  slug: string;
  req: PayloadRequest;
};

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (!slug) return '/clubs'; // Fallback for broken URLs

  // Extract last part of slug to remove admin path
  const cleanSlug = slug.split('/').pop()?.replace(/-+$/, '');

  if (!cleanSlug) return '/clubs';

  const collectionPath = collectionPrefixMap[collection] || '';

  const encodedParams = new URLSearchParams({
    slug: cleanSlug,
    collection,
    path: `${collectionPath}/${cleanSlug}`,
    previewSecret: process.env.PREVIEW_SECRET || '',
  });

  const url = `/next/preview?${encodedParams.toString()}`;

  console.log('Generated Club Preview URL:', url); // Debugging log

  return url;
};
