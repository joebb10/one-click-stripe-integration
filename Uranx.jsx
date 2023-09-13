import React, { useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button,
    Container,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
  } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(6),
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    backgroundColor: '#2196f3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1976d2',
    },
  },
  integrationCodeContainer: {
    marginTop: theme.spacing(4),
    backgroundColor: '#f0f0f0',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
}));

const StripeIntegrationForm = () => {
  const classes = useStyles();
  const [integrationCode, setIntegrationCode] = useState('');
  const [formData, setFormData] = useState({
    stripe_secret_key: '',
    stripe_publishable_key: '',
    product_name: '',
    price_amount: 0,
    price_currency: '',
    is_recurring: false,
    success_url: '',
    cancel_url: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'is_recurring' ? value === 'true' : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/integrate-stripe',
        formData
      );

      setIntegrationCode(response.data.integration_code);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" component="h1" gutterBottom>
        Stripe Integration
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          className={classes.input}
          name="stripe_secret_key"
          value={formData.stripe_secret_key}
          onChange={handleChange}
          label="Stripe Secret Key"
          variant="outlined"
          required
          fullWidth
        />
        <TextField
          className={classes.input}
          name="stripe_publishable_key"
          value={formData.stripe_publishable_key}
          onChange={handleChange}
          label="Stripe Publishable Key"
          variant="outlined"
          required
          fullWidth
        />
        <TextField
          className={classes.input}
          name="product_name"
          value={formData.product_name}
          onChange={handleChange}
          label="Product Name"
          variant="outlined"
          required
          fullWidth
        />
        <TextField
          className={classes.input}
          name="price_amount"
          type="number"
          value={formData.price_amount}
          onChange={handleChange}
          label="Price Amount"
          variant="outlined"
          required
          fullWidth
        />
        <TextField
          className={classes.input}
          name="price_currency"
          value={formData.price_currency}
          onChange={handleChange}
          label="Price Currency"
          variant="outlined"
          required
          fullWidth
        />
        <FormControl variant="outlined" fullWidth className={classes.input}>
          <InputLabel id="is-recurring-label">Payment Type</InputLabel>
          <Select
            labelId="is-recurring-label"
            id="is_recurring"
            name="is_recurring"
            value={formData.is_recurring ? 'true' : 'false'}
            onChange={handleChange}
            label="Payment Type"
          >
            <MenuItem value={'false'}>Single</MenuItem>
            <MenuItem value={'true'}>Recurring</MenuItem>
          </Select>
        </FormControl>
        <TextField
          className={classes.input}
          name="success_url"
          value={formData.success_url}
          onChange={handleChange}
          label="Success URL"
          variant="outlined"
          required
          fullWidth
        />
        <TextField
          className={classes.input}
          name="cancel_url"
          value={formData.cancel_url}
          onChange={handleChange}
          label="Cancel URL"
          variant="outlined"
          required
          fullWidth
        />
        <Button
          className={classes.button}
          variant="contained"
          type="submit"
        >
          Generate Stripe Integration Code
        </Button>
      </form>
      {integrationCode && (
        <div className={classes.integrationCodeContainer}>
          <Typography variant="h6" component="h2" gutterBottom>
            Your Integration Code
          </Typography>
          <pre>{integrationCode}</pre>
        </div>
      )}
    </Container>
  );
};

export default StripeIntegrationForm;
