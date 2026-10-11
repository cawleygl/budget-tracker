import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

interface PageHeaderProps {
  title: ReactNode;
  // Optional content shown right of the title (e.g. a status chip)
  badge?: ReactNode;
  // Optional buttons shown at the right end of the header
  actions?: ReactNode;
}

/**
 * Consistent page title row used across pages
 */
function PageHeader({ title, badge, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
        {badge}
      </Box>
      {actions && <Box sx={{ display: "flex", gap: 1 }}>{actions}</Box>}
    </Box>
  );
}

export default PageHeader;
