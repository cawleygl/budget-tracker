import dayjs from "dayjs";

import {
  type BudgetStatus,
  BudgetStatuses,
  FormattedBudgetStatuses,
  type CostType,
  CostTypes,
  FormattedCostTypes,
} from "./dataTypes";

// Format currency values in frontend
export function formatCurrency(amount: number): string {
  console.log(Number(parseFloat(amount.toString()).toFixed(2)));
  return (
    "$" +
    Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Format budget status to values in frontend
export function formatBudgetStatus(status: BudgetStatus): string {
  switch (status) {
    case BudgetStatuses.not_started:
      return FormattedBudgetStatuses.not_started;
    case BudgetStatuses.active:
      return FormattedBudgetStatuses.active;
    case BudgetStatuses.expired:
      return FormattedBudgetStatuses.expired;
    default:
      console.error("Budget Status not found");
      return "";
  }
}

// Set dates to midnight for easy comparisons regardless of time captured
export function regulateDate(date: Date): Date {
  date.setHours(0, 0, 0, 0);
  return date;
}

// Format cost type for display
export function formatCostType(type: CostType): string {
  switch (type) {
    case CostTypes.credit:
      return FormattedCostTypes.credit;
    case CostTypes.expense:
      return FormattedCostTypes.expense;
    default:
      return FormattedCostTypes.expense;
  }
}

// Format Dates
export function formatDateNumbered(date: Date | null): string {
  if (date === null || date === undefined) return "Never";
  return dayjs(date).format('MM/DD/YYYY');
}
export function formatDateWritten(date: Date | null): string {
  if (date === null || date === undefined) return "Never";
  return dayjs(date).format('LL');
}
