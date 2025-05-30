// src/components/dashboard/DashboardSkeleton.jsx
import { Skeleton } from '@mui/material';

export const DashboardSkeleton = () => (
  <>
    <Skeleton variant="rectangular" height={118} />
    <Skeleton animation="wave" />
    <Skeleton animation="wave" />
  </>
);