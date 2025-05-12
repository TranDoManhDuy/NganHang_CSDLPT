import React from "react";
import { Box, TextField, Typography } from "@mui/material";
export function FormField({ label }: { label: string }) {
  return (
    <Box className="form-field">
      <Typography
        variant="body2"
        className="form-field-label"
        sx={{ mb: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        size="small"
        sx={{
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d0d0" },
        }}
      />
    </Box>
  );
}
