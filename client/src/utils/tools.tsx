import dayjs from "dayjs";

import {
  type BudgetStatus,
  BudgetStatuses,
  FormattedBudgetStatuses,
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

// Format Dates
export function formatDateNumbered(date: Date): string {
  return dayjs(date).format('MM/DD/YYYY');
}
export function formatDateWritten(date: Date): string {
  return dayjs(date).format('LL');
}
