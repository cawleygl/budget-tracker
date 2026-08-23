import axios from "axios";
import type {
  Budget,
  PostBudgetPayload,
  Cost,
  PostCostPayload,
  Vendor,
  PostVendorPayload,
  PaymentMethod,
  PostPaymentMethodPayload
} from "./dataTypes.tsx";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: object,
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      let response;
      switch (method) {
        case "GET":
          response = await axios.get<T>(url);
          break;
        case "POST":
          response = await axios.post<T>(url, body);
          break;
        case "PUT":
          response = await axios.put<T>(url, body);
          break;
        case "DELETE":
          response = await axios.delete<T>(url);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      if (response && response.status >= 200 && response.status < 300) {
        console.log(`Successful ${method} request to ${url}`, response.data);
      }

      return response.data as Promise<T>;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error:", error.message);
        if (error.response) {
          // Server responded with a status code outside of 2xx range
          console.error("Response Data:", error.response.data);
          console.error("Response Status:", error.response.status);
          console.error("Response Headers:", error.response.headers);
        } else if (error.request) {
          // Request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Error setting up request:", error.message);
        }
      } else {
        // Non-Axios native error
        console.error("Unexpected Error:", error);
      }
      throw error; // Re-throw the error after logging it
    }
  }

  /* BUDGETS */
  // GET: Fetch all budgets
  public async getAllBudgets(): Promise<Budget[]> {
    return this.request<Budget[]>(`/budgets/`);
  }
  // GET: Fetch a single budget + associate costs by ID
  public async getBudgetById(id: string): Promise<Budget> {
    return this.request<Budget>(`/budgets/${id}`);
  }
  // POST: Create a budget
  public async createBudget(
    payload: PostBudgetPayload,
  ): Promise<Budget> {
    return this.request<Budget>(`/budgets/`, "POST", payload);
  }
    // PUT: Update a budget
  public async updateBudget(
    budgetId: string,
    payload: PostBudgetPayload,
  ): Promise<void> {
    this.request<Budget>(`/budgets/${budgetId}`, "PUT", payload);
  }
  // DELETE: Delete a budget
  public async deleteBudget(
    budgetId: string,
  ): Promise<void> {
    this.request<Cost>(`/budgets/${budgetId}`, "DELETE");
  }

  /* COSTS */
  // POST: Create a cost
  public async createCost(
    budgetId: string,
    payload: PostCostPayload,
  ): Promise<Cost> {
    return this.request<Cost>(`/budgets/${budgetId}/costs/`, "POST", payload);
  }
  // POST: Read a cost
  public async readCost(
    budgetId: string,
    costId: string,
  ): Promise<Cost> {
    return this.request<Cost>(`/budgets/${budgetId}/costs/${costId}`);
  }
  // PUT: Update a cost
  public async updateCost(
    budgetId: string,
    costId: string,
    payload: PostCostPayload,
  ): Promise<void> {
    this.request<Cost>(`/budgets/${budgetId}/costs/${costId}`, "PUT", payload);
  }
  // DELETE: Delete a cost
  public async deleteCost(
    budgetId: string,
    costId: string,
  ): Promise<void> {
    this.request<Cost>(`/budgets/${budgetId}/costs/${costId}`, "DELETE");
  }

  /* VENDORS */
  // GET: Fetch all vendors
  public async getAllVendors(): Promise<Vendor[]> {
    return this.request<Vendor[]>(`/vendors/`);
  }
    // POST: Create a vendor
  public async createVendor(
    payload: PostVendorPayload,
  ): Promise<Vendor> {
    return this.request<Vendor>(`/vendors/`, "POST", payload);
  }
    // POST: Read a vendor
  public async readVendor(
    budgetId: string,
    vendorId: string,
  ): Promise<Vendor> {
    return this.request<Vendor>(`/budgets/${budgetId}/vendors/${vendorId}`);
  }
  // PUT: Update a vendor
  public async updateVendor(
    budgetId: string,
    vendorId: string,
    payload: PostVendorPayload,
  ): Promise<void> {
    this.request<Vendor>(`/budgets/${budgetId}/vendors/${vendorId}`, "PUT", payload);
  }
  // DELETE: Delete a vendor
  public async deleteVendor(
    budgetId: string,
    vendorId: string,
  ): Promise<void> {
    this.request<Vendor>(`/budgets/${budgetId}/vendors/${vendorId}`, "DELETE");
  }

  /* PAYMENT METHODS */
  // GET: Fetch all payment methods
  public async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    return this.request<PaymentMethod[]>(`/payments/`);
  }
  // POST: Create a payment method
  public async createPaymentMethod(
    payload: PostPaymentMethodPayload,
  ): Promise<PaymentMethod> {
    return this.request<PaymentMethod>(`/payments/`, "POST", payload);
  }
    // POST: Read a payment method
  public async readPaymentMethod(
    paymentId: string,
  ): Promise<PaymentMethod> {
    return this.request<PaymentMethod>(`/payments/${paymentId}`);
  }
  // PUT: Update a payment method
  public async updatePaymentMethod(
    paymentId: string,
    payload: PostPaymentMethodPayload,
  ): Promise<void> {
    this.request<PaymentMethod>(`/payments/${paymentId}`, "PUT", payload);
  }
  // DELETE: Delete a payment method
  public async deletePaymentMethod(
    paymentId: string,
  ): Promise<void> {
    this.request<PaymentMethod>(`/payments/${paymentId}`, "DELETE");
  }
  
}

export const api = new ApiClient(import.meta.env.VITE_SERVER_URL);
