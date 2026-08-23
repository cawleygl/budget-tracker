import type {
  Cost,
  BudgetCalculations,
  Budget,
  BudgetStatus,
} from "./dataTypes.tsx";
import { BudgetStatuses } from "./dataTypes.tsx";
import { regulateDate } from "../utils/tools.tsx";

/**
 * Perform all budget calculations
 * @param budgetObj - Budget object
 * @return - object containing necessary values of BudgetCalculations type
 */
export function calculateBudget(
  budgetObj: Budget
): BudgetCalculations {
  const expiration: Date = new Date(budgetObj.expiration);
  const start: Date = new Date(budgetObj.start);
  const today: Date = regulateDate(new Date(Date.now()));

  const status: string = calculateStatus(expiration, start, today);
  const costTotal = sumCosts(budgetObj.costs);
  const amountRemaining = calculateAmountRemaining(budgetObj.amount, costTotal);

  if (status !== BudgetStatuses.active) {
    return {
      status,
      costTotal,
      amountRemaining,
      expectedCostToDate: 0,
      remainingBudgetPerDay: 0,
      expectedRemainingBudget: 0,
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
    status,
    amountRemaining,
    expectedCostToDate,
    remainingBudgetPerDay,
    expectedRemainingBudget,
  } as BudgetCalculations;
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
 * @param expiration - Date
 * @param start - Date
 * @param today - Date
 * @return BudgetStatus - Status from enum
 */
function calculateStatus(
  expiration: Date,
  start: Date,
  today: Date,
): BudgetStatus {
  if (isBefore(today, start)) {
    return BudgetStatuses.not_started;
  }
  if (isBefore(expiration, today)) {
    return BudgetStatuses.expired;
  }
  return BudgetStatuses.active;
}

/**
 * Sum costs in a costList array
 *
 * What are my running costs?
 *
 * @param costList - List of costs
 * @return - sum as number
 */
function sumCosts(costList: Cost[]): number {
  if (costList.length <= 0) {
    return 0;
  }

  return costList.reduce(
    (acc: number, cost: Cost) => Number(acc) + Number(cost.amount),
    0,
  );
}

/**
 * Find the amount remaining in your budget
 *
 * What is my remaining budget?
 *
 * Budget Amount - Total Costs
 *
 * @param amount: number - Total budget amount
 * @param costTotal - Sum of costs
 * @return - number
 */
function calculateAmountRemaining(amount: number, costTotal: number): number {
  const difference = amount - costTotal;

  if (difference < 0) {
    return 0;
  }

  return difference;
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
