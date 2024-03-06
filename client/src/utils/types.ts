export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
}

export interface Listing {
  _id: string;
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountPrice: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: string;
  offer: boolean;
  imageUrls: string[];
  userRef: string;
}

export interface FormData {
  avatar?: string;
  username?: string;
  email?: string;
  password?: string;
}
