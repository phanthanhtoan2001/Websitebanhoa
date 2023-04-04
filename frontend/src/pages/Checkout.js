import * as React from 'react';
import { useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { toast } from "react-hot-toast"
import { useSelector } from 'react-redux';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddressForm from './AddressForm';
import Review from './Review';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const steps = ['Shipping address', 'Review your order'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <Review />;
    default:
      throw new Error('Unknown step');
  }
}

const theme = createTheme();

export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);

  // take out cart
  const productCartItem = useSelector((state) => state.product.cartItem)
  const userState = JSON.parse(localStorage.getItem(`${process.env.REACT_APP_LOCAL_STORAGE_KEY}/`))


  const [data] = useState({ //state chứa các thông tin nhập vào từ form
    productCartItem,
    userState
  })
  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };


const handleSubmit = async (e) => {
  toast("work", { style: { background: 'red', color: 'white' } })
  setActiveStep(activeStep + 1);
  if(activeStep === 1){
    toast("work perfect", { style: { background: 'red', color: 'white' } })
    const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/checkout`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data) // Chuyển đổi data thành chuỗi và gửi lên server
    })
    const dataRes = await response.json()
    console.log(dataRes)
  }

}
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography> 
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back  {activeStep}
                  </Button>
                )}
                
              <form className='w-full py-3 flex flex-col' onSubmit={handleSubmit}>
                <Button
                  variant="contained"
                  // onClick={handleNext}
                  onClick={handleSubmit}
                  sx={{ mt: 2, ml: 1 }}
                >
                  {activeStep}
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </Button>
                </form>
              </Box>
            </React.Fragment>
          )}
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}