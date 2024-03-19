import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ title, subtitle, icon, increase, percentTitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>

        </Box>
        <Box>
        <Typography
          variant="h3"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
        <Typography
            variant="h4"
            sx={{ color: colors.grey[100] }}
          >
            {percentTitle}
        </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h3" sx={{ color: colors.greenAccent[500] }}>
          {subtitle}
        </Typography>


      </Box>
    </Box>
  );
};

export default StatBox;