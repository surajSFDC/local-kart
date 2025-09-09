import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  APIResponse, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  User, 
  Provider, 
  Booking, 
  CreateBookingRequest,
  ProviderRegistrationRequest 
} from '../types';

class APIService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<APIResponse<AuthResponse>> {
    const response: AxiosResponse<APIResponse<AuthResponse>> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<APIResponse<AuthResponse>> {
    const response: AxiosResponse<APIResponse<AuthResponse>> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<APIResponse<{ user: User }>> {
    const response: AxiosResponse<APIResponse<{ user: User }>> = await this.api.get('/auth/me');
    return response.data;
  }

  async updateProfile(profile: Partial<User['profile']>): Promise<APIResponse<{ user: User }>> {
    const response: AxiosResponse<APIResponse<{ user: User }>> = await this.api.put('/auth/me', { profile });
    return response.data;
  }

  // Provider endpoints
  async registerAsProvider(providerData: ProviderRegistrationRequest): Promise<APIResponse<{ provider: Provider }>> {
    const response: AxiosResponse<APIResponse<{ provider: Provider }>> = await this.api.post('/providers/register', providerData);
    return response.data;
  }

  async getProviderProfile(): Promise<APIResponse<{ provider: Provider }>> {
    const response: AxiosResponse<APIResponse<{ provider: Provider }>> = await this.api.get('/providers/profile');
    return response.data;
  }

  async updateProviderProfile(providerData: Partial<Provider>): Promise<APIResponse<{ provider: Provider }>> {
    const response: AxiosResponse<APIResponse<{ provider: Provider }>> = await this.api.put('/providers/profile', providerData);
    return response.data;
  }

  async searchProviders(params: {
    city?: string;
    category?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    page?: number;
    limit?: number;
  }): Promise<APIResponse<{ providers: Provider[]; meta: any }>> {
    const response: AxiosResponse<APIResponse<{ providers: Provider[]; meta: any }>> = await this.api.get('/providers/search', { params });
    return response.data;
  }

  async getProviderById(id: string): Promise<APIResponse<{ provider: Provider }>> {
    const response: AxiosResponse<APIResponse<{ provider: Provider }>> = await this.api.get(`/providers/${id}`);
    return response.data;
  }

  // Booking endpoints
  async createBooking(bookingData: CreateBookingRequest): Promise<APIResponse<{ booking: Booking }>> {
    const response: AxiosResponse<APIResponse<{ booking: Booking }>> = await this.api.post('/bookings', bookingData);
    return response.data;
  }

  async getMyBookings(params?: { status?: string; page?: number; limit?: number }): Promise<APIResponse<{ bookings: Booking[]; meta: any }>> {
    const response: AxiosResponse<APIResponse<{ bookings: Booking[]; meta: any }>> = await this.api.get('/bookings/my-bookings', { params });
    return response.data;
  }

  async getProviderBookings(params?: { status?: string; page?: number; limit?: number }): Promise<APIResponse<{ bookings: Booking[]; meta: any }>> {
    const response: AxiosResponse<APIResponse<{ bookings: Booking[]; meta: any }>> = await this.api.get('/bookings/provider-bookings', { params });
    return response.data;
  }

  async getBookingById(id: string): Promise<APIResponse<{ booking: Booking }>> {
    const response: AxiosResponse<APIResponse<{ booking: Booking }>> = await this.api.get(`/bookings/${id}`);
    return response.data;
  }

  async updateBookingStatus(id: string, status: string, confirmedDate?: string, confirmedTime?: string): Promise<APIResponse<{ booking: Booking }>> {
    const response: AxiosResponse<APIResponse<{ booking: Booking }>> = await this.api.put(`/bookings/${id}/status`, {
      status,
      confirmedDate,
      confirmedTime
    });
    return response.data;
  }
}

export const apiService = new APIService();