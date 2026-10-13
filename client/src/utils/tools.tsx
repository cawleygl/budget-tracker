import dayjs from "dayjs";

import {
  type BudgetStatus,
  type Cost,
  BudgetStatuses,
  FormattedBudgetStatuses,
  type CostType,
  CostTypes,
  FormattedCostTypes,
} from "./dataTypes";

// Format currency values in frontend
// Negative values render with the sign outside the dollar sign: -$12.50
export function formatCurrencyFromAmount(amount: number): string {
  const rounded = Number(Number(amount).toFixed(2));
  const sign = rounded < 0 ? "-" : "";
  return (
    sign +
    "$" +
    Math.abs(rounded).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

// Format a cost's amount for display; expenses are shown as negative
export function formatCurrencyFromCost(cost: Cost): string {
  const amount = Math.abs(Number(cost.amount));
  return formatCurrencyFromAmount(cost.type === CostTypes.expense ? -amount : amount);
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

/**
 * Calculate the dates of a reset budget
 *
 * The new budget starts when the old one expired and runs for the same
 * number of days. Whole calendar days are added so the time of day is kept
 * across daylight saving changes.
 *
 * @param expiration - Expiration date of the budget being reset
 * @param totalDays - Total days in the budget being reset
 * @return - start and expiration dates for the new budget
 */
export function calculateResetDates(
  expiration: Date,
  totalDays: number,
): { start: Date; expiration: Date } {
  const start = dayjs(expiration);
  return {
    start: start.toDate(),
    expiration: start.add(Math.round(totalDays), "day").toDate(),
  };
}

/**
 * Clamp a percentage to the 0-100 range
 *
 * Non-finite values (NaN, Infinity) become 0.
 *
 * @param value - Percentage to clamp
 * @return - value limited to 0-100
 */
export function clampPercent(value: number): number {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
}
