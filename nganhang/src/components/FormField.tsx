import React, { memo } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { Controller, Control } from "react-hook-form";

export const FormField = memo(({
  label,
  type,
  name,
  control,
  disabled = false,
}: {
  label: string;
  type: string;
  name: string;
  control: Control<any>;
  disabled?: boolean;
}) => {
  return (
    <Box className="form-field">
      <Typography
        variant="body2"
        className="form-field-label"
        sx={{ mb: 0.5, fontWeight: 500 }}>
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            fullWidth
            size="small"
            type={type === "CMND" ? "text" : type}
            disabled={disabled}
            error={!!error}
            helperText={error?.message}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d0d0d0" },
            }}
            onChange={(e) => {
              let newValue = e.target.value;
              if (type === "CMND") {
                newValue = newValue.replace(/\D/g, "");
              }
              field.onChange(newValue);
            }}
          />
        )}
      />
    </Box>
  );
});

FormField.displayName = 'FormField';
