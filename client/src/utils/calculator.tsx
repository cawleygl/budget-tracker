import type {
  Cost,
  BudgetCalculations,
  Budget,
  BudgetStatus,
  CostType,
} from "./dataTypes.tsx";
import { BudgetStatuses, CostTypes } from "./dataTypes.tsx";
import { regulateDate } from "../utils/tools.tsx";

/**
 * Perform all budget calculations
 * @param budgetObj - Budget object
 * @return - object containing necessary values of BudgetCalculations type
 */
export function calculateBudget(
  budgetObj: Budget
): BudgetCalculations {
  const expiration: Date | null = budgetObj.expiration
    ? new Date(budgetObj.expiration)
    : null;
  const start: Date | null = budgetObj.start
    ? new Date(budgetObj.start)
    : null;
  const today: Date = regulateDate(new Date(Date.now()));

  const status: string = calculateStatus(expiration, start, today);
  const costTotal = sumCosts(budgetObj.costs);
  const expenseTotal = sumExpenses(budgetObj.costs);
  const creditTotal = sumCredits(budgetObj.costs);
  // Length of the budget period is known even once the budget has expired
  const totalDays = calculateTotalDays(start, expiration);
  const amountRemaining = calculateAmountRemaining(budgetObj.amount, costTotal);

  // Without both a start and an expiration, per-day pacing can't be calculated
  if (
    status !== BudgetStatuses.active ||
    expiration === null ||
    start === null
  ) {
    return {
      status,
      costTotal,
      expenseTotal,
      creditTotal,
      amountRemaining,
      expectedCostToDate: 0,
      remainingBudgetPerDay: 0,
      expectedRemainingBudget: 0,
      totalDays,
      daysElapsed: 0,
    } as BudgetCalculations;
  }

  const expectedCostToDate = calculateExpectedCostToDate(
    budgetObj.amount,
    expiration,
    start,
    today,
  );
  const remainingBudgetPerDay = calculateRemainingBudgetPerDay(
    amountRemaining,
    expiration,
    today,
  );
  const expectedRemainingBudget = calculateExpectedRemainingBudget(
    budgetObj.amount,
    expectedCostToDate,
  );

  return {
    costTotal,
    expenseTotal,
    creditTotal,
    status,
    amountRemaining,
    expectedCostToDate,
    remainingBudgetPerDay,
    expectedRemainingBudget,
    totalDays,
    daysElapsed: getDateDifference(today, start),
  } as BudgetCalculations;
}

/**
 * Calculate the total number of days in a budget's period
 *
 * @param start - Budget start date, or null if there isn't one
 * @param expiration - Budget expiration date, or null if there isn't one
 * @return - number of days from start to expiration (0 if either date is missing)
 */
export function calculateTotalDays(
  start: Date | null,
  expiration: Date | null,
): number {
  if (start === null || expiration === null) {
    return 0;
  }

  return getDateDifference(expiration, start);
}

/**
 * Find the difference between two date object in days
 *
 * @param date1 - later date
 * @param date2 - earlier date
 * @returns - number of days between
 */
function getDateDifference(date1: Date, date2: Date): number {
  // Convert to ms and find ms difference
  const difference = date1.getTime() - date2.getTime();
  // Convert ms difference to days
  return difference / 86400000;
}

/**
 * Compare dates
 *
 * @param date1 - Date 1
 * @param date2 - Date 2
 * @return boolean - true if Date 1 is after Date 2
 */
function isBefore(date1: Date, date2: Date): boolean {
  return getDateDifference(date1, date2) <= 0;
}

/**
 * Determine budget status
 *
 * NOT_STARTED / ACTIVE / EXPIRED
 *
 * @param expiration - Date, or null if the budget never expires
 * @param start - Date, or null if the budget has no start date
 * @param today - Date
 * @return BudgetStatus - Status from enum
 */
function calculateStatus(
  expiration: Date | null,
  start: Date | null,
  today: Date,
): BudgetStatus {
  if (start !== null && isBefore(today, start)) {
    return BudgetStatuses.not_started;
  }
  if (expiration !== null && isBefore(expiration, today)) {
    return BudgetStatuses.expired;
  }
  return BudgetStatuses.active;
}

/**
 * Sum costs in a costList array as signed amounts
 *
 * Credits add; expenses subtract.
 *
 * @param costList - List of costs
 * @return - signed net of credits and expenses
 */
function sumCosts(costList: Cost[]): number {
  if (costList.length <= 0) {
    return 0;
  }

  return costList.reduce(
    (acc: number, cost: Cost) => acc + signedCostAmount(cost),
    0,
  );
}

/**
 * Sum the amounts of all costs of a given type
 *
 * @param costList - List of costs
 * @param type - Cost type to sum
 * @return - sum of the (positive) amounts
 */
function sumCostsOfType(costList: Cost[], type: CostType): number {
  return costList
    .filter((cost: Cost) => cost.type === type)
    .reduce((acc: number, cost: Cost) => acc + Number(cost.amount), 0);
}

/**
 * Sum all expenses in a costList array
 *
 * @param costList - List of costs
 * @return - total of expenses as a positive number
 */
export function sumExpenses(costList: Cost[]): number {
  return sumCostsOfType(costList, CostTypes.expense);
}

/**
 * Sum all credits in a costList array
 *
 * @param costList - List of costs
 * @return - total of credits as a positive number
 */
export function sumCredits(costList: Cost[]): number {
  return sumCostsOfType(costList, CostTypes.credit);
}

/**
 * Signed amount of a cost: credits are positive, expenses are negative
 *
 * @param cost - Cost
 * @return - signed amount
 */
function signedCostAmount(cost: Cost): number {
  const amount = Number(cost.amount);
  return cost.type === CostTypes.credit ? amount : -amount;
}

/**
 * Calculate the running total after each cost, for running budgets
 *
 * Starts at the starting amount, adds credits and subtracts expenses.
 * Costs should already be in display (chronological) order.
 *
 * @param startingAmount - Budget amount the running total begins with
 * @param costList - List of costs in display order
 * @return - running total after each cost, same order/length as costList
 */
export function calculateRunningTotals(
  startingAmount: number,
  costList: Cost[],
): number[] {
  let total = Number(startingAmount);
  return costList.map((cost: Cost) => {
    total += signedCostAmount(cost);
    return total;
  });
}

/**
 * Find the amount remaining in your budget
 *
 * Budget Amount + signed cost total
 * (expenses are negative, so they reduce remaining)
 *
 * @param amount: number - Total budget amount
 * @param costTotal - Signed sum of costs
 * @return - number
 */
function calculateAmountRemaining(amount: number, costTotal: number): number {
  const remaining = amount + costTotal;

  if (remaining < 0) {
    return 0;
  }

  return remaining;
}

/**
 * Calculate Expected Cost to Date
 *
 * Am I "On Track" with my budget? If I spend my whole budget perfectly evenly among the
 * days in my specified time period, what should my total cost be today?
 *
 * (Budget Amount / Total Days in Budget) * Days Elapsed
 * Budget Amount = budgetObj.amount
 * Total Days in Budget = budgetObj.expiration - budgetObj.start
 * Days Elapsed = today - budgetObj.start
 *
 * @param amount: number - Total budget amount
 * @param expiration: Date - Budget expiration date
 * @param start: Date - Budget start date
 * @param today: Date - Today at midnight
 * @returns: number - expected cost to date
 */
function calculateExpectedCostToDate(
  amount: number,
  expiration: Date,
  start: Date,
  today: Date,
): number {
  console.log("expiration - start", getDateDifference(expiration, start));
  console.log("today - start", getDateDifference(today, start));
  console.log("today", today);

  if (isBefore(today, start)) {
    return 0;
  }
  if (isBefore(expiration, today)) {
    return 0;
  }

  return (
    (amount / getDateDifference(expiration, start)) *
    getDateDifference(today, start)
  );
}

/**
 * Calculate Remaining Budget Per Day
 *
 * How much can I spend per day moving forward while staying under my budget?
 *
 * Remaining Budget / Remaining Days
 * Remaining Budget = amountRemaining = (budgetObj.amount - costTotal)
 * Remaining Days = budgetObj.expiration - today
 *
 * @param amountRemaining: number - calculated amount remaining
 * @param expiration: Date - Budget expiration date
 * @param today: Date - Today at midnight
 * @returns number
 */
function calculateRemainingBudgetPerDay(
  amountRemaining: number,
  expiration: Date,
  today: Date,
): number {
  if (isBefore(expiration, today)) {
    return 0;
  }

  return amountRemaining / getDateDifference(expiration, today);
}

/**
 * Calculate Expected Remaining Budget
 *
 * If I spend my budget evenly, how much budget would I have left today?
 *
 * Budget Amount - Expected Cost To Date
 *
 * @param amount: number - budget amount
 * @param expectedCostToDate: number - calculated expected cost to date
 * @returns: number - expected remaining budget
 */
function calculateExpectedRemainingBudget(
  amount: number,
  expectedCostToDate: number,
): number {
  if (expectedCostToDate <= 0) {
    return 0;
  }

  return amount - expectedCostToDate;
}
