import { Paper, Typography } from "@mui/material";

interface BudgetTypeDescriptionProps {
  isRepeating: boolean;
}

const descriptions = {
  repeating: {
    title: "Repeating Budget",
    summary:
      "A fixed amount to spend over a set period, like a month. It has a start and an expiration date.",
    points: [
      "Tracks your spending against an even daily pace, so you can see if you're ahead or behind.",
      "Shows how much you can spend per day for the rest of the period.",
      "Expires at the end of the period. Reset it to start the next one with the same name, amount and length.",
    ],
  },
  running: {
    title: "Running Budget",
    summary:
      "A balance that carries forward with no end date. It begins with a starting amount.",
    points: [
      "Expenses subtract from the balance and credits add to it.",
      "Every cost shows the running total after it, so you always know where you stand.",
      "Never expires, so there are no dates or daily pacing.",
    ],
  },
} as const;

/**
 * Explains the selected budget type next to the budget form
 */
function BudgetTypeDescription({ isRepeating }: BudgetTypeDescriptionProps) {
  const description = isRepeating ? descriptions.repeating : descriptions.running;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderLeft: 4,
        borderLeftColor: isRepeating ? "primary.main" : "secondary.main",
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
        {description.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {description.summary}
      </Typography>
      <Typography
        component="ul"
        variant="body2"
        color="text.secondary"
        sx={{ m: 0, pl: 2.5, "& li": { mb: 1 } }}
      >
        {description.points.map((point: string) => (
          <li key={point}>{point}</li>
        ))}
      </Typography>
    </Paper>
  );
}

export default BudgetTypeDescription;
