// src/components/dashboard/DashboardError.jsx
import { Alert, Button } from '@mui/material';

export const DashboardError = ({ refetch }) => (
  <Alert 
    severity="error"
    action={
      <Button color="inherit" size="small" onClick={refetch}>
        Retry
      </Button>
    }
  >
    Failed to load dashboard data
  </Alert>
);