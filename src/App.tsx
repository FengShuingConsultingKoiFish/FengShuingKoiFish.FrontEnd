import { Provider } from "react-redux"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import Footer from "./components/layout/footer/Footer"
import Navbar from "./components/layout/header/Navbar"
import ToasterProvider from "./components/providers/Toaster"
import LoginModal from "./components/ui/modals/LoginModal"
import SignupModal from "./components/ui/modals/SignupModal"
import store from "./lib/redux/store"
import Blog from "./pages/Blog"
import FengShuiLookup from "./pages/FengShuiLookup"
import Home from "./pages/Home"
import KoiPondConsultation from "./pages/KoiPondConsultation"
import ResultPage from "./pages/ResultPage"

function App() {
  return (
    <>
      <Provider store={store}>
        <Navbar />
        <ToasterProvider />
        <LoginModal />
        <SignupModal />
        <div className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doan-menh" element={<FengShuiLookup />} />
            <Route path="/tu-van-ho" element={<KoiPondConsultation />} />
            <Route path="/ket-qua" element={<ResultPage />} />{" "}
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </div>
        <Footer />
      </Provider>
    </>
  )
}

export default App
