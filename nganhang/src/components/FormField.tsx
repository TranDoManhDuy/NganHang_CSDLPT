import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";

export function FormField({
  label,
  type,
  initialValue = "",
  onChange,
  name,
  disabled = false,
}: {
  label: string;
  type: string;
  initialValue?: string;
  onChange?: (value: string, name?: string) => void;
  name?: string;
  disabled?: boolean;
}) {
  const [value, setValue] = useState(initialValue);

  // Update internal state if initialValue changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Handle special case for CMND (only allow numeric characters)
    if (type === "CMND") {
      newValue = newValue.replace(/\D/g, "");
    }

    setValue(newValue);

    // Notify parent component about the value change
    if (onChange) {
      onChange(newValue, name);
    }
  };

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
        value={value}
        name={name}
        type={type === "CMND" ? "text" : type}
        onChange={handleChange}
        disabled={disabled}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d0d0" },
        }}
      />
    </Box>
  );
}
