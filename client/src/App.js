import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Registration from './components/Registration/Registration';
import OtpVerification from './components/OtpVerification/OtpVerification';
import Login from './components/Login/Login'
import Dashboard from './components/Dashboard/Dashboard';
import Distributions from "./components/Distributions/Distributions"
import AddDistribution from "./components/Distributions/AddDistribution"
import BillManagement from "./components/Bills/BillManagement"
import CreditInvoice from "./components/Invoices/CreditInvoice"
import DebitInvoice from "./components/Invoices/DebitInvoice"
import AddProduct from "./components/Products/AddProduct"
import AddRawMaterialMaster from './components/Master/AddRawMaterialMaster';
import AddProductMaster from './components/Master/AddProductMaster';
import ProductList from "./components/Products/ProductList"
import PurchaseList from "./components/Purchases/PurchaseList"
import AddRawMaterial from "./components/RawMaterial/AddRawMaterial"
import RawMaterialList from "./components/RawMaterial/RawMaterialList"
import AllRawMaterialMaster from './components/Master/AllRawMaterialMaster';
import AllProductMaster from './components/Master/AllProductMaster';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path='/login' element={<Login/>} />

          <Route 
              path='/dashboard' 
              element={
                <ProtectedRoute>
                  <Dashboard/>
                </ProtectedRoute>
              } >
            <Route path='add-raw-material-master' element={<AddRawMaterialMaster/>}/>
            <Route path='add-product-master' element={<AddProductMaster/>}/>
            <Route path='all-raw-material-master' element={<AllRawMaterialMaster/>}/>
            <Route path='all-product-master' element={<AllProductMaster/>}/>
            

            
            <Route path='raw-material' element={<RawMaterialList/>}/>
            <Route path='add-raw-material' element={<AddRawMaterial/>}/>

            <Route path='product' element={<ProductList/>}/>
            <Route path='add-product' element={<AddProduct/>}/>

            <Route path='distributions' element={<Distributions/>}/>
            <Route path='add-distribution' element={<AddDistribution/>}/>

            <Route path='purchases' element={<PurchaseList/>}/>



            <Route path='bill' element={<BillManagement/>}/>

            <Route path='credit-invoice' element={<CreditInvoice/>}/>
            <Route path='debit-invoice' element={<DebitInvoice/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
