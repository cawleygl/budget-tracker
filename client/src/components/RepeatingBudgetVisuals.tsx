import type { ReactNode } from "react";
import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import { BudgetStatuses } from "../utils/dataTypes.tsx";
import type { BudgetCalculations } from "../utils/dataTypes.tsx";
import {
  formatCurrencyFromAmount,
  formatDateWritten,
} from "../utils/tools.tsx";

interface RepeatingBudgetVisualsProps {
  budgetAmount: number;
  start: Date | null;
  expiration: Date | null;
  calculations: BudgetCalculations;
  // Buttons shown in the expired budget breakdown (e.g. Reset Budget)
  expiredActions?: ReactNode;
}

const clampPercent = (value: number): number =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

/**
 * A progress bar with an optional marker line (e.g. where spending "should" be)
 */
function MarkedProgress({
  label,
  caption,
  percent,
  markerPercent,
  markerTitle,
  startLabel,
  endLabel,
  color,
}: {
  label: string;
  caption: string;
  percent: number;
  markerPercent?: number;
  markerTitle?: string;
  startLabel?: string;
  endLabel?: string;
  color: "success" | "warning" | "error" | "primary";
}) {
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {caption}
        </Typography>
      </Box>
      <Box sx={{ position: "relative" }}>
        <LinearProgress
          variant="determinate"
          value={clampPercent(percent)}
          color={color}
          sx={{ height: 14, borderRadius: 7 }}
        />
        {markerPercent !== undefined && (
          <Box
            title={markerTitle}
            sx={{
              position: "absolute",
              top: -3,
              bottom: -3,
              left: `${clampPercent(markerPercent)}%`,
              width: 3,
              bgcolor: "text.primary",
              borderRadius: 1,
            }}
          />
        )}
      </Box>
      {(startLabel || endLabel) && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {startLabel}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {endLabel}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

interface Comparison {
  expected: string;
  actual: string;
  delta: string;
  good: boolean;
}

/**
 * Build an expected vs actual comparison
 *
 * @param expected - expected value
 * @param actual - actual value
 * @param higherIsBetter - true if an actual value above expected is good
 * @param format - formats a value for display (also used for the difference)
 * @param goodText - text after the difference when the result is good
 * @param badText - text after the difference when the result is bad
 */
function buildComparison(
  expected: number,
  actual: number,
  higherIsBetter: boolean,
  format: (value: number) => string,
  goodText: string,
  badText: string,
  formatDifference: (value: number) => string = format,
): Comparison {
  const difference = actual - expected;
  const onTarget = Math.abs(difference) < 0.005;
  const good = onTarget || (higherIsBetter ? difference > 0 : difference < 0);

  return {
    expected: format(expected),
    actual: format(actual),
    delta: onTarget
      ? "On target"
      : `${formatDifference(Math.abs(difference))} ${good ? goodText : badText}`,
    good,
  };
}

function StatTile({
  label,
  comparison,
  expectedLabel = "Expected",
  actualLabel = "Actual",
}: {
  label: string;
  comparison: Comparison;
  expectedLabel?: string;
  actualLabel?: string;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, minWidth: 220, flex: "1 1 220px" }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      {/* Expected and actual values side by side at the same level */}
      <Box sx={{ display: "flex", gap: 3, mt: 0.5 }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {expectedLabel}
          </Typography>
          <Typography variant="h6">{comparison.expected}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {actualLabel}
          </Typography>
          <Typography variant="h6">{comparison.actual}</Typography>
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{
          mt: 0.5,
          fontWeight: "bold",
          color: comparison.good ? "success.main" : "error.main",
        }}
      >
        {comparison.delta}
      </Typography>
    </Paper>
  );
}

function SummaryTile({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, minWidth: 160, flex: "1 1 160px" }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ color }}>
        {value}
      </Typography>
    </Paper>
  );
}

/**
 * Summary of a repeating budget:
 *  - Amount spent / budget total and the date range
 *
 * While the budget is active (and has both dates), also:
 *  - Spending progress bar with a marker for where spending should be today
 *  - Stat tiles comparing expected and actual values
 *
 * Once the budget has expired, a full breakdown of the finished budget
 * (and any expiredActions, such as a Reset Budget button) is shown instead.
 */
function RepeatingBudgetVisuals({
  budgetAmount,
  start,
  expiration,
  calculations,
  expiredActions,
}: RepeatingBudgetVisualsProps) {
  const amount = Number(budgetAmount);

  // Net spending: costTotal is signed (expenses negative), so flip it
  const spent = Math.max(0, -calculations.costTotal);
  const spentPercent = amount > 0 ? (spent / amount) * 100 : 0;
  const expectedPercent =
    amount > 0 ? (calculations.expectedCostToDate / amount) * 100 : 0;

  const timePercent =
    calculations.totalDays > 0
      ? (calculations.daysElapsed / calculations.totalDays) * 100
      : 0;
  const daysLeft = Math.max(
    0,
    Math.ceil(calculations.totalDays - calculations.daysElapsed),
  );

  // Positive = spending less than expected so far
  const paceDifference = calculations.expectedCostToDate - spent;
  const isOverBudget = spent > amount;
  const isOverPace = paceDifference < 0;

  const spendColor = isOverBudget ? "error" : isOverPace ? "warning" : "success";

  // Expected vs actual comparisons for each stat tile
  const formatPercent = (value: number): string => `${value.toFixed(1)}%`;
  const formatPoints = (value: number): string => `${value.toFixed(1)} pts`;

  // Cost to date: actual net spending vs where an even spend would be today
  const costComparison = buildComparison(
    calculations.expectedCostToDate,
    spent,
    false,
    formatCurrencyFromAmount,
    "under expected",
    "over expected",
  );

  // Per day: what's left per remaining day vs the original even daily budget
  const plannedPerDay =
    calculations.totalDays > 0 ? amount / calculations.totalDays : 0;
  const perDayComparison = buildComparison(
    plannedPerDay,
    calculations.remainingBudgetPerDay,
    true,
    formatCurrencyFromAmount,
    "more per day than planned",
    "less per day than planned",
  );

  // Remaining budget: actual amount remaining vs where an even spend would be
  const remainingComparison = buildComparison(
    calculations.expectedRemainingBudget,
    calculations.amountRemaining,
    true,
    formatCurrencyFromAmount,
    "ahead of expected",
    "behind expected",
  );

  // Pace: share of the budget spent vs share of the time elapsed
  const paceComparison = buildComparison(
    timePercent,
    spentPercent,
    false,
    formatPercent,
    "under pace",
    "over pace",
    formatPoints,
  );

  // e.g. "$120.00 of $500.00 - $380.00 remaining"
  const isExpired = calculations.status === BudgetStatuses.expired;
  const spendSummary = `${formatCurrencyFromAmount(spent)} of ${formatCurrencyFromAmount(amount)} - ${formatCurrencyFromAmount(calculations.amountRemaining)} remaining`;

  // Pacing visuals need an active budget with both dates set
  const showPacing =
    calculations.status === BudgetStatuses.active && !!start && !!expiration;

  // Breakdown of a finished budget
  const { expenseTotal, creditTotal } = calculations;
  const netSpent = expenseTotal - creditTotal;
  const overBudgetBy = Math.max(0, netSpent - amount);
  const averagePerDay =
    calculations.totalDays > 0 ? spent / calculations.totalDays : 0;

  if (isExpired) {
    return (
      <Paper variant="outlined" sx={{ p: 3, my: 2, maxWidth: 800 }}>
        <MarkedProgress
          label="Final Spending"
          caption={`${Math.round(spentPercent)}% of budget used`}
          percent={spentPercent}
          startLabel={formatDateWritten(start)}
          endLabel={formatDateWritten(expiration)}
          color={isOverBudget ? "error" : "success"}
        />

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          <SummaryTile label="Budget" value={formatCurrencyFromAmount(amount)} />
          <SummaryTile
            label="Expenses"
            value={formatCurrencyFromAmount(-expenseTotal)}
            color="error.main"
          />
          <SummaryTile
            label="Credits"
            value={formatCurrencyFromAmount(creditTotal)}
            color="success.main"
          />
          <SummaryTile
            label="Net Spent"
            value={formatCurrencyFromAmount(netSpent)}
          />
          {isOverBudget ? (
            <SummaryTile
              label="Over Budget By"
              value={formatCurrencyFromAmount(overBudgetBy)}
              color="error.main"
            />
          ) : (
            <SummaryTile
              label="Left Over"
              value={formatCurrencyFromAmount(calculations.amountRemaining)}
              color="success.main"
            />
          )}
          <SummaryTile
            label="Average Spent Per Day"
            value={formatCurrencyFromAmount(averagePerDay)}
          />
          <SummaryTile
            label="Length"
            value={`${Math.round(calculations.totalDays)} days`}
          />
        </Box>

        {expiredActions && <Box sx={{ mt: 3 }}>{expiredActions}</Box>}
      </Paper>
    );
  }

  return (
    <Box sx={{ my: 2, maxWidth: 800 }}>
      {/* With no bar to anchor them, show the summary and dates as plain text */}
      {!showPacing && (
        <>
          <Typography variant="h6">{spendSummary}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {formatDateWritten(start)} - {formatDateWritten(expiration)}
          </Typography>
        </>
      )}

      {showPacing && (
        <>
          <MarkedProgress
            label="Spent"
            caption={spendSummary}
            percent={spentPercent}
            markerPercent={expectedPercent}
            markerTitle={`Today: day ${Math.floor(calculations.daysElapsed)} of ${Math.round(calculations.totalDays)} (${daysLeft} left)`}
            startLabel={formatDateWritten(start)}
            endLabel={formatDateWritten(expiration)}
            color={spendColor}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
            <StatTile
              label="Cost to Date"
              comparison={costComparison}
              actualLabel="Spent"
            />
            <StatTile
              label="Budget Per Day"
              comparison={perDayComparison}
              expectedLabel="Planned"
              actualLabel="Available"
            />
            <StatTile
              label="Remaining Budget"
              comparison={remainingComparison}
              actualLabel="Remaining"
            />
            <StatTile
              label="Pace"
              comparison={paceComparison}
              expectedLabel="Time Elapsed"
              actualLabel="Budget Spent"
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default RepeatingBudgetVisuals;
