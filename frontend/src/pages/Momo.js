
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

const Momo = () => {

    const productCartItem = useSelector((state) => state.product.cartItem) // Lấy cart item từ redux store
    const totalPrice = productCartItem.reduce(
        (acc, curr) => acc + parseFloat(curr.total.replace(/\./g, '').replace(',', '.')),
        0
    ).toLocaleString('vi', { style: 'decimal', minimumFractionDigits: 0 })

    const totalPrices = productCartItem.reduce(
        (acc, curr) => acc + parseFloat(curr.total.replace(/\./g, '')),
        0
    )


    const totalQuantity = productCartItem.reduce((acc, curr) => acc + parseInt(curr.quanity), 0)

    const userEmail = useSelector(state => state.user.email)
    const userid = useSelector(state => state.user._id)

    const firstName = useSelector(state => state.user.firstName)
    const lastName = useSelector(state => state.user.lastName)
    const fullName = firstName + " " + lastName


    const [data, setData] = useState({ //state chứa các thông tin nhập vào từ form
        productCartItem,
        userid,
        totalPrice,
        Note: "",
        paymentMethod: "",
        address: ""
      })




 

        
    
    const handleSubmit = async (e) => {
          //   const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/checkout`, {
    //             method: "POST",
    //             headers: { "content-type": "application/json" },
    //             body: JSON.stringify(data) // Chuyển đổi data thành chuỗi và gửi lên server
    //           }) 
    //           const dataRes = await response.json()
    //       console.log(dataRes)
    //       if (dataRes.alert) { // Nếu đăng ký thành công thì redirect sang trang đăng nhập
    //         navigate("/")
    //       }
        }
          


 

    return (
  
        <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
          <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h4" align="center">
              MoMo Payment confirm
            </Typography>
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography> 
                <Typography variant="subtitle1">
                  Your order number is #2001539. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
                <Button
                    variant="contained"
                    // onClick={handleNext}
                    onClick={handleSubmit}
                    sx={{ mt: 2, ml: 1 }}
                  >
                    Confirm
                  </Button>
              </React.Fragment>
        
          </Paper>
        </Container>
    )
}

export default Momo