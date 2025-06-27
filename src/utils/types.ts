export interface RESPONSE<T = unknown> {
  status: boolean;
  data: T | null;
  message?: string;
  errorCode?: string;
  title?: string;
}

export interface DISTANCE_RESPONSE {
  code: string;
  routes: ROUTE[];
  waypoints: WAYPOINT[];
}

export interface Address {
  ISO3166_2_lvl4?: string;
  country?: string;
  country_code?: string;
  district?: string;
  historical_division?: string;
  municipality?: string;
  postcode?: string;
  state?: string;
  village?: string;
  town?: string;
  amenity?: string;
  [key: string]: unknown; // allows additional keys if needed
}

export interface ADDRESS_RESPONSE {
  key?: string;
  address: Address;
  addresstype: string;
  boundingbox: number[];
  display_name: string;
  lat: string;
  lon: string;
  place_id: number;
  type: string;
  category: string;
  importance: number;
}

export interface ROUTE {
  distance: number;
  duration: number;
  geometry: string;
  legs: unknown[];
  overview_polyline: string;
}

export interface WAYPOINT {
  distance: number;
  hint: string;
  location: number[];
  name: string;
}

export interface COLLAPSIBLE_REF {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
// types/RestaurantFilters.ts

export type LeadRequestBody = {
  make?: string;
  model?: string;
  priceMin?: string;
  priceMax?: string;
  price?: string;
  modelMin?: string;
  modelMax?: string;
  cc?: string;
  negotiable?: number;
  mode?: string;
  ccMin?: string;
  ccMax?: string;
  address?: string;
  city?: string;
  query?: string;
  nameWords?: string[];
  emailWords?: string[];
  contactWords?: string[];
  latitude?: number;
  longitude?: number;
};

export type Invites = {
  recipient: string;
};

export type Foodies = {
  fullName: string;
  phone: string;
  email: string;
  interest: string;
  matchedPercentage: number;
  color: string;
  price?: string;
  make?: string;
  model?: string;
  modelYear?: number;
  cc?: number;
  location?: string;
};
