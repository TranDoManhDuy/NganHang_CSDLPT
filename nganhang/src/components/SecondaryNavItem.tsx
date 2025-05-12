import React from "react";
import { Box, Typography } from "@mui/material";
export function SecondaryNavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Box
      className={`secondary-nav-item ${
        active ? "secondary-nav-item-active" : ""
      }`}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 1,
        cursor: "pointer",
        bgcolor: active ? "#dcdcdc" : "transparent",
      }}>
      <Box sx={{ p: 1 }}>{icon}</Box>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
}
