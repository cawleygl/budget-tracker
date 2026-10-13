export const BudgetTypes = {
  repeating: "REPEATING",
  running: "RUNNING",
} as const;

export type BudgetType = (typeof BudgetTypes)[keyof typeof BudgetTypes];

export interface Budget {
  id: string;
  name: string;
  amount: number;
  // Source of truth for repeating vs running; running budgets ignore the dates
  type: BudgetType;
  start: Date | null;
  expiration: Date | null;
  createdAt: Date;
  updatedAt: Date;
  costs: Cost[]
}

export interface Vendor {
  id: string;
  name: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
}

export interface PostBudgetPayload {
  name: string;
  amount: number;
  type: BudgetType;
  start: Date | null;
  expiration: Date | null;
}

// Values passed to the create budget form (via router state) to prefill it,
// e.g. when resetting an expired budget. Dates are ISO strings.
export interface BudgetPrefill {
  name: string;
  amount: number;
  start: string;
  expiration: string;
}

export const CostTypes = {
  credit: "CREDIT",
  expense: "EXPENSE",
} as const;

export type CostType = (typeof CostTypes)[keyof typeof CostTypes];

export const FormattedCostTypes = {
  credit: "Credit",
  expense: "Expense",
} as const;

export interface Cost {
  id: string;
  description: string;
  amount: number;
  type: CostType;
  vendor: Vendor;
  payment_method: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostCostPayload {
  description: string;
  amount: number;
  type: CostType;
  vendor: string;
  payment_method: string;
}

export interface PostVendorPayload {
  name: string;
}

export interface PostPaymentMethodPayload {
  name: string;
}

export interface IdResponsePayload {
  id: string;
}

export interface BudgetCalculations {
	status: BudgetStatus
  costTotal: number;
  expenseTotal: number;
  creditTotal: number;
  amountRemaining: number;
  expectedCostToDate: number;
  remainingBudgetPerDay: number;
  expectedRemainingBudget: number;
  totalDays: number;
  daysElapsed: number;
}

export const BudgetStatuses = {
  not_started: "NOT_STARTED",
  active: "ACTIVE",
  expired: "EXPIRED",
} as const;

export const FormattedBudgetStatuses = {
  not_started: "Not Started",
  active: "Active",
  expired: "Expired",
} as const;

export type BudgetStatus = typeof BudgetStatuses[keyof typeof BudgetStatuses]; 
export type FormattedBudgetStatus = typeof FormattedBudgetStatuses[keyof typeof FormattedBudgetStatuses]; 

export interface PageLink {
  name: string,
  path: string
}