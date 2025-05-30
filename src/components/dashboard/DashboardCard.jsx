import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary', 
  variant = 'elevation' 
}) => {
  const theme = useTheme();

  return (
    <Card 
      variant={variant}
      sx={{ 
        height: '100%',
        borderColor: variant === 'outlined' ? theme.palette.divider : undefined
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        {icon && React.cloneElement(icon, {
          sx: {
            fontSize: 40,
            color: theme.palette[color].main,
            mb: 2
          }
        })}
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;