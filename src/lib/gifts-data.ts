import type { ImagePlaceholder } from './placeholder-images';

// This type will now be used across the app, but the data source will be Firestore.
export type Gift = {
  id: string;
  name: string;
  description: string;
  totalPrice: number;
  contributedAmount: number;
  imageUrl?: string; // Keep this optional as it might not always exist
  imageHint?: string;
  image?: ImagePlaceholder; // Keeping for compatibility with existing components
};
