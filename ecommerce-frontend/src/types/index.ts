// All shared TypeScript types for the application.
// Keeping them in one file makes it easy to find and update data shapes
// when the backend API changes.

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar: {
    public_id: string;
    url: string;
  };
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    public_id: string;
    url: string;
  };
}

export interface ProductImage {
  public_id: string;
  url: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: Category;
  stock: number;
  images: ProductImage[];
  ratings: number;
  numReviews: number;
  reviews: Review[];
  createdAt: string;
}

export interface Review {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Omit<Address, "_id" | "isDefault">;
  paymentInfo: {
    id?: string;
    status?: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  deliveredAt?: string;
  createdAt: string;
}

export interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
}

// Generic API response shape from our backend
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Used for product listing pages to show pagination info
export interface ProductListResponse {
  success: boolean;
  count: number;
  totalCount: number;
  products: Product[];
}

// Query params that can be passed to the product listing API
export interface ProductQueryParams {
  keyword?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
  "price[gte]"?: number;
  "price[lte]"?: number;
}
