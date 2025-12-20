import { Card, CardContent, Typography } from "@mui/material";
import { useAppSelector } from "@/hooks/redux";

export const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Welcome to the Dashboard {user?.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a protected area. You can only see this if you are logged in.
        </Typography>
      </CardContent>
    </Card>
  );
};
