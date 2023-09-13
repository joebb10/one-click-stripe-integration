// Pricing.js
import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, Container, CardActions } from '@mui/material';
import { getDatabase, ref, get } from "firebase/database";
import { app } from "../firebase";

const handleSubscribe = (planId) => {
  // Subscription logic here
  console.log(`User subscribed to plan ${planId}`);
};

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      const db = getDatabase(app);
      const plansRef = ref(db, 'plans');
      const snap = await get(plansRef);

      if (snap.exists()) {
        console.log("Data present");
        console.log(snap.val()); // Log the received data to the console
        setPlans(Object.values(snap.val())); // Store the fetched plans in your state variable
        
      } else {
        console.error("No data");
      }
    };

    fetchPlans();
  }, []);

  return (
    <Container maxWidth="md" sx={{ marginTop: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Pricing Plans
      </Typography>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
        {plans && plans.map((plan, index) => (
          <Card key={plan.id} sx={{ maxWidth: 345, minWidth: 275, m: 1 }}>
            <CardContent>
              <Typography variant="h5" component="div">{plan.name}</Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">{plan.description}</Typography>
              <Typography variant="h3">${plan.cost}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" disableElevation onClick={() => handleSubscribe(plan.id)}>Select Plan</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default Pricing;
