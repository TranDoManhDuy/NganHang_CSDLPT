import { Box, Typography } from "@mui/material";
export function NavItem({
  children,
  active,
  handleClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  handleClick?: () => void;
}) {
  return (
    <Box
      className={`nav-item ${active ? "nav-item-active" : ""}`}
      sx={{
        px: 2,
        py: 1,
        cursor: "pointer",
        bgcolor: active ? "#b9b9b9" : "transparent",
        color: "white",
      }}
      onClick={handleClick}>
      <Typography>{children}</Typography>
    </Box>
  );
}
