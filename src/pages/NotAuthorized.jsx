import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="80vh"
        textAlign="center"
      >
        <WarningIcon color="error" sx={{ fontSize: 80, mb: 3 }} />
        <Typography variant="h4" gutterBottom>
          صلاحية غير كافية
        </Typography>
        <Typography variant="body1" paragraph>
          ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate(-1)}
          sx={{ mt: 3, mr: 2 }}
        >
          العودة للخلف
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          الصفحة الرئيسية
        </Button>
      </Box>
    </Container>
  );
};

export default React.memo(NotAuthorized);