import { InputBase, styled } from "@mui/material";

export const Input = styled(InputBase)(({ theme }) => ({
  fontSize: 20,
  "& .MuiInputBase-input": {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    background: "#F4F5F6",
    border: `1px solid ${theme.palette.border.light}`,
    borderRadius: theme.shape.borderRadius,
  },
}));
