import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const StatisticsUI = () => {
  return (
    <Grid container spacing={3}>
      {/* Card 1 */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              Total Users
            </Typography>
            <Typography variant="h4">120</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 2 */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              Active Users
            </Typography>
            <Typography variant="h4">80</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 3 */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              Total Revenue
            </Typography>
            <Typography variant="h4">$50,000</Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Card 4 */}
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="div">
              Expenses
            </Typography>
            <Typography variant="h4">$20,000</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatisticsUI;
