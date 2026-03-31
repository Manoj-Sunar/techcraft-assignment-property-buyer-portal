export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: "apartment" | "villa" | "house" | "land";
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  images: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface Buyer {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "admin";
  isVerified: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;

}


export interface PaginatedResponse<T> {
  success: boolean;
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  data: T[];
}


export interface LoginResponse {
  buyer: Buyer;
  accessToken: string;
}

export interface LogoutResponse{
  success:boolean;
  message:string;
}