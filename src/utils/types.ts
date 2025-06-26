import { TableStatus } from "@/components/checkout/table-booking";
import { CartItem } from "@/context/cart-context";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";

// types/next.d.ts

// In your types file
// types/next.d.ts
import type { NextApiResponse } from "next";
import type { Server as IOServer } from "socket.io";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: (HttpServer | HttpsServer) & {
      io?: IOServer;
    };
  };
};

export interface Coordinates {
  latitude: number;
  longitude: number;
}
export interface User {
  id: number;
  userId: string;
  userName: string;
  password: string | null;
  email: string;
  firstName: string;
  lastName: string;
  genderId: number;
  address: string;
  city: string;
  zipCode: string | null;
  primaryContact: string;
  secondaryContact: string;
  identityId: string;
  imei: string;
  avatar: string;
  token: string;
  fmctoken: string;
  roleId: number;
  storeId: number;
  storeName: string;
  ratingScore: number | null;
  keyword: string | null;
  isVerified: number;
  status: number;
  rowVer: number;
  registrationSource: number;
  createdAt: string;
  createdBy: string | null;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
  onlineStatus: string | null;
  lastTimeOnline: string | null;
  // Add other user properties as needed
}

export interface AddStoreProductToFavoriteParams {
  storeId: number;
  productDetailId?: number;
  status: number;
}

export interface RESPONSE<T = unknown> {
  status: boolean;
  data: T | null;
  message?: string;
  errorCode?: string;
  title?: string;
}
export type Invites = {
  recipient: string;
};
export interface ORDER_RESPONSE {
  salesinvoicecode: number;
  saleid: number;
}

export type Review = {
  avatar: string;
  city: string;
  createdAt: string; // ISO date string
  createdBy: number;
  currencyCode: string;
  id: number;
  lastUpdatedAt: string | null;
  lastUpdatedBy: number | null;
  productDetailId: number;
  productName: string;
  ratingScore: number;
  reviewRemarks: string;
  rowVer: number;
  status: string | null;
  storeId: number;
  unitPrice: number;
  userName: string;
};

export interface ApiTable {
  id: number;
  name: string;
  seats: number;
  sizeWidth: number;
  sizeLength: number;
  typeId: number;
  storeId: number;
  createdBy: number;
  createdAt: string;
  lastUpdatedBy: number;
  lastUpdatedAt: string;
  status: 1 | 2 | 3;
  rowVer: number;
  size: number;
}

export interface Table {
  id: number;
  name: string;
  seats: number;
  sizeWidth: number;
  sizeLength: number;
  typeId: number;
  storeId: number;
  createdBy: number;
  createdAt: string;
  lastUpdatedBy: number;
  lastUpdatedAt: string;
  status: TableStatus;
  rowVer: number;
  size: number;
}

export interface TableBookingProps {
  onClose: () => void;
}

export interface DealItem {
  alertLevelId: number | null;
  candidateForCompaign: string | null;
  createdAt: string;
  createdBy: number;
  currencyCode: string;
  dealCode: string;
  dealDetails: string | null;
  dealDetailsJSON: string | null;
  dealItems: string | null;
  dealPrice: number;
  dealTarget: string; // This seems to be a stringified array. If parsed, you can use `number[]`
  dealType: string | null;
  dealUrl: string;
  defaultCostPercentage: number | null;
  endTime: string;
  gpsLocation: string | null;
  id: number;
  lastUpdatedAt: string;
  lastUpdatedBy: number | null;
  majorProductDetailId: number;
  remarks: string | null;
  rowVer: number;
  schemeAmount: number;
  schemeBundleQty: number | null;
  schemeFreeQty: number | null;
  startTime: string;
  status: number;
  storeAddress: string | null;
  storeContact: string;
  storeId: number;
  storeLogo: string;
  storeName: string;
  taxPercentage: number;
}

export type DealProduct = {
  barcode: string;
  createdAt: string; // ISO string, can also use Date if you're parsing it
  createdBy: number;
  dealPrice: number;
  dealTarget: string; // Stored as a string, e.g. "[5,6,7]". You may parse it as number[]
  defaultCostPercentage: number | null;
  defaultFixPrice: number;
  enforceExpiry: boolean | null;
  id: number;
  lastUpdatedAt: string;
  lastUpdatedBy: number | null;
  maxDiscountPercentage: number | null;
  productDetailId: number;
  productName: string;
  productType: string | null;
  producturl: string;
  restaurantDealId: number;
  rowVer: number;
  schemeAmount: number;
  schemeBundleQty: number;
  schemeFreeQty: number | null;
  status: number;
  storeId: number;
  taxInPercentage: number;
};

export interface PAYMENT_GATEWAY {
  callBackUri: string | null;
  cert: string | null;
  createdAt: string; // ISO Date string
  createdBy: number;
  description: string;
  id: number;
  lastUpdatedAt: string; // ISO Date string
  lastUpdatedBy: number;
  logo: string; // base64-encoded string
  name: string;
  status: number;
  paymentStatusEnquiryUri: string;
  primaryKey: string;
  profileId: string;
  secretKey: string;
  url: string;
  merchantAccountId: string;
}

export type JazzCashIPNData = {
  status?: boolean;
  ipnData: {
    pp_TxnType?: string;
    pp_Amount?: string;
    pp_BillReference?: string;
    pp_ResponseCode?: string;
    pp_RetreivalReferenceNo?: string;
    pp_SubMerchantID?: string;
    pp_TxnCurrency?: string;
    pp_TxnDateTime?: string;
    pp_TxnRefNo?: string;
    pp_MobileNumber?: string;
    pp_CNIC?: string;
    pp_SecureHash?: string;
    pp_ResponseMessage?: string;
    [key: string]: unknown; // To allow additional fields if needed
  };
};

export interface JazzCashResponse {
  pp_Amount: string;
  pp_AuthCode: string;
  pp_BillReference: string;
  pp_CNIC: string;
  pp_DiscountedAmount: string | null;
  pp_Language: string;
  pp_MerchantID: string;
  pp_MobileNumber: string;
  pp_ResponseCode: string;
  pp_ResponseMessage: string;
  pp_RetreivalReferenceNo: string;
  pp_SecureHash: string;
  pp_SubMerchantID: string;
  pp_TxnCurrency: string;
  pp_TxnDateTime: string;
  pp_TxnRefNo: string;
  pp_TxnType: string;
  pp_Version: string;
  ppmpf_1: string;
  ppmpf_2: string;
  ppmpf_3: string;
  ppmpf_4: string;
  ppmpf_5: string;
}

export type JazzCashInquiryResponse = {
  pp_AuthCode: string;
  pp_BankID: string;
  pp_PaymentResponseCode: string;
  pp_PaymentResponseMessage: string;
  pp_ProductID: string;
  pp_ResponseCode: string;
  pp_ResponseMessage: string;
  pp_RetrievalReferenceNo: string;
  pp_SecureHash: string;
  pp_SettlementDate: string;
  pp_SettlementExpiry: string;
  pp_Status: "Completed" | "Pending" | "Failed" | string;
};

export interface POINTS_RESPONSE {
  totalPoints: number;
  message: string;
  status: number;
}

export interface VOUCHER_RESPONSE {
  minOrderAmount: number;
  offerPerc: number;
  offerFixedAmount: number;
  applicableOnAllProducts: boolean;
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

export interface CalculateRateOptions {
  distanceInMeters: number;
  ratePerUnit: number; // Rate per km or mile
  minimumCharge: number; // Minimum charge threshold
  freeDeliveryRadiusInMeters: number;
  countryCode: string;
}

export type LOGIN_FORM = {
  email: string;
  userName: string;
  password: string;
  primaryContact: string;
  userId: string;
};

export type SIGN_UP_FORM = {
  id: number;
  userId?: string;
  avatar?: string;
  address?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  primaryContact?: string;
  password: string;
  genderId?: number;
  fmctoken?: string;
  roleId?: number;
  status?: number;
  storeId?: number;
  registrationSource: number;
  createdAt?: string;
  lastUpdatedAt?: string;
  rowVer?: number;
  isVerified?: number;
  IMEI?: string;
  token?: string;
};

export type MENU_FORM = {
  id: string;
  storeId: string;
  dateFrom: Date | string;
};

export type FORGOT_PASSWORD_FORM = {
  id: number;
  storeId: number;
  registrationSource: number;
  password: string;
  primaryContact: string;
  userId: string;
  userName: string;
  token?: string;
};

export type STORE_FILTERS_BODY = {
  Name: string;
  CityId: number;
  StateId: number;
  Contact: string;
  StoreId: number;
  Email: string;
  City: string;
  CountryId: number;
  State: string;
  location: string;
  buffer: number;
  Keyword: string;
  MinPrice: number;
  MaxPrice: number;
  ProductId: number;
  UnitId: number;
  productunits: [] | { ProductId: number; UnitId: number }[];
  StoreTypeId: string; // Use `null` or `''` based on API requirements
};

export type StoreDetail = {
  actualPrice: number;
  address: string;
  cityId: number | null;
  contact: string;
  contact2: string | null;
  countryId: number;
  createdAt: string;
  createdBy: string | null;
  currencyCode: string;
  currencyId: number;
  dealId: number;
  dealPrice: number;
  dealStartTime: string;
  dealcode: string;
  dealurl: string;
  email: string;
  expiryDate: string;
  fmctoken: string | null;
  gpslocation: string;
  hotDealPic: string;
  id: number;
  isMainStore: boolean | null;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
  license: string;
  logoPath: string;
  name: string;
  ntnno: string | null;
  rating: number;
  ratingScore: number | null;
  regTime: string;
  rowVer: number;
  status: number;
  storeHours: string | null;
  storeTypeId: number;
  subscriptionPackageId: number;
  surfaceAddress: string | null;
  tradeName: string;
  updatedBy: string | null;
  vatregistrationNo: string;
  webAddress: string | null;
  whatsApp: string;
  workhoursjson: string;
};

export interface MenuItem {
  id: number;
  linediscount: number;
  productId: number;
  productDetailId: number;
  productname: string;
  description: string;
  offerPerc: number;
  offerQty: number;
  defaultFixPrice: number;
  producturl: string;
  categoryid: number;
  productcategory: string;
  unitname: string;
  unitprice: number;
  isSpecial: number;
  isHalal: number;
  isFavourite: number;
  mostlyBoughtTogether: number;
  points: number;
  storeId: number;
  status: number;
  currencycode: string;
  variationCount?: number;
  productOptionsJSON: string;
  tax: number;
  kitchenTimeInMins: number;
  /** List of all variations for this product */
  variations?: MenuItem[];
}

export interface MenuCategory {
  id: number;
  name: string;
  items: MenuItem[] | DealItem[];
}

export type TipOption = {
  id: number;
  name: string;
  remarks: string;
  tip: number;
};

export interface StoreInfo {
  id: number;
  name: string;
  tradeName: string;
  address: string;
  surfaceAddress: string | null;
  cityId: number | null;
  countryId: number;
  storeTypeId: number;
  storeTypeIdJSON: string | null;
  subscriptionPackageId: number;
  status: number;
  rating: number;
  ratingScore: number | null;
  email: string;
  contact: string;
  contact2: string | null;
  webAddress: string | null;
  whatsApp: string;
  vatregistrationNo: string;
  ntnno: string | null;
  license: string;
  logoPath: string;
  hotDealPic: string;
  gpslocation: string;
  workhoursjson: string;
  storeHours: string | null;
  fmctoken: string | null;
  dealId: number;
  dealcode: string;
  dealurl: string;
  dealPrice: number;
  dealStartTime: string | null;
  actualPrice: number;
  expiryDate: string;
  createdAt: string;
  createdBy: string | null;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
  updatedBy: string | null;
  regTime: string;
  rowVer: number;
  currencyId: number;
  currencyCode: string | null;
}

export interface COLLAPSIBLE_REF {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
// types/RestaurantFilters.ts
export type Country = {
  id: number;
  name: string;
  flag: string;
  code: string;
};

export type PriceRange = {
  min: number;
  max: number;
};

export type SortBy = {
  id: number;
  name: string;
};

export type RestaurantFilters = {
  country: Country | null;
  address: string;
  lat: number | null;
  lng: number | null;
  searchRange: number | null; // e.g. in kilometers
  productId: number | null;
  unitId: number | null;
  storeTypeId: number[] | null;
  priceRange: PriceRange;
  sortBy: number | null;
  offerId: number | null;
  products: string;
};
export type DialogProps = {
  isMapVisible: boolean;
  toggleIsMapVisble: () => void;
};

export type NoteRequestBody = {
  type: "order" | "delivery"; // Required
  address: string;
  orderType: string;
  deliveryCharges: number;
  deliveryDistance: number;
  deliveryOption: string;
  email: string;
  guests: number;
  name: string;
  paymentMethodId: string;
  phone: string;
  pointsDiscount?: number;
  pointsRedeemed?: number;
  eta: string;
  items: CartItem[];
  isStaff: boolean;
};

export type ORDER = {
  address: string;
  appuserid: number | null;
  businessagentid: number;
  changeamount: number;
  city: string | null;
  cityId: number;
  commissiontotalamount: number;
  createdat: string;
  createdby: number;
  currencycode: string;
  customerInfo: string; // JSON string; you may parse it if needed
  dateFrom: string | null;
  dateTo: string | null;
  dealcode: string;
  deliveryCharges: number;
  deliveryNote: string | null;
  deliveryTime: string;
  discount: number;
  dueamount: number;
  expense: number;
  gpsLocation: string;
  guestscount: number;
  handedovercash: number;
  id: number;
  invoiceTime: string;
  itemsCount: number;
  keyword: string | null;
  netdiscount: number;
  orderNote: string;
  paidamount: number;
  payableamount: number;
  payingamount: number;
  paymentMethodId: number;
  paymentStatusId: number;
  pointsAmount: number;
  quantity: number;
  remarks: string;
  requireTime: string;
  rowVer: number;
  saleTypeId: number;
  saledate: string;
  saleid: number;
  salerate: number;
  salesinvoicecode: string;
  saletypename: string | null;
  serviceCharges: number;
  status: number;
  storecontact: string | null;
  storeid: number;
  storename: string | null;
  tax: number;
  taxInvoiceCode: string;
  taxamount: number;
  tipAmount: number;
  totalamount: number;
  updatedat: string;
  url: string;
  voucherAmount: number;
  voucherCode: string;
};
export type OrderProduct = {
  address: string;
  batchNumber: string | null;
  billableQty: number | null;
  bookingjson: string;
  commissionPercentage: number | null;
  createdAt: string;
  createdBy: number;
  currencyCode: string;
  customerInfo: string; // Consider parsing this JSON string if used often
  deliveryCharges: number;
  deliveryNote: string;
  deliveryOptionId: number;
  deliveryTime: string;
  dCode: string;
  dueAmount: number;
  earnedPoints: number | null;
  guestscount: number;
  id: number;
  invoiceCode: string;
  lastUpdatedAt: string | null;
  lastUpdatedBy: number | null;
  lineDiscount: number;
  logoPath: string;
  netDiscount: number;
  orderByName: string;
  orderNote: string;
  paidAmount: number;
  payableBill: number;
  paymentMethodId: number;
  paymentRef: string;
  paymentStatusId: number;
  pointsAmount: number;
  productDetailId: number;
  productName: string;
  replacementItem: string | null;
  requireTime: string;
  returnItem: string | null;
  rowVer: number;
  saleDetailId: number;
  saleId: number;
  saleRate: number;
  saleTypeId: number;
  serviceCharges: number;
  sku: string;
  status: number;
  storeAddress: string;
  tax: number;
  taxAmount: number;
  taxInvoiceCode: string;
  taxNumber: string;
  tipAmount: number;
  token: string;
  totalLoadedQty: number;
  tradeName: string;
  url: string;
  voucherAmount: number;
  voucherCode: string;
};

export type Foodies = {
  name: string;
  contact: string;
  email: string;
  interest: string;
};
