import { Provider } from "react-redux"
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation
} from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"

import Footer from "./components/layout/footer/Footer"
import Navbar from "./components/layout/header/Navbar"
import ProtectedRoute from "./components/providers/ProtectedRoute"
import ToasterProvider from "./components/providers/Toaster"
import LoginModal from "./components/ui/modals/LoginModal"
import SignupModal from "./components/ui/modals/SignupModal"
import store, { persistor } from "./lib/redux/store"
import { AdminPage } from "./pages/Admin/AdminPage"
import { ApprovedPosts } from "./pages/Admin/ApprovedBlog"
import { ManageBlogPage } from "./pages/Admin/ManageBlogs"
import { PendingPosts } from "./pages/Admin/PendingBlog"
import { RejectedPosts } from "./pages/Admin/RejectedBlog"
import Blog from "./pages/Blog/Blog"
import { ViewBlog } from "./pages/Blog/ViewBlog"
import CreateBlogModal from "./pages/Blog/components/CreateBlogModal"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import PasswordForgot from "./pages/Password-forgot"
import PasswordReset from "./pages/Password-reset"
import ProfileSetting from "./pages/Setting/Profile"
import UserProfilePage from "./pages/UserProfile"
import UnauthorizedPage from "./pages/Verification/NotAuthorize"
import SuccessPage from "./pages/Verification/SuccessPage"
import FengShuiLookup from "./pages/FengShuiLookup"
import ResultPage from "./pages/ResultPage"


const ProtectedAdminPage = ProtectedRoute(AdminPage)
const ProtectedManageBlogPage = ProtectedRoute(ManageBlogPage)

function App() {
  const location = useLocation()
  const excludeLayoutPaths = [
    "/password-forgot",
    "/password-reset",
    "/verification/success",
    "/blog/create",
    "/404",
    "/401"
  ]
  const shouldExcludeLayout = excludeLayoutPaths.includes(location.pathname)

  return (
    <>
      <Provider store={store}>

        <PersistGate loading={null} persistor={persistor}>
          <ToasterProvider />
          <LoginModal />
          <SignupModal />
          <CreateBlogModal />
          {!shouldExcludeLayout && <Navbar />}
          <div className={shouldExcludeLayout ? "no-layout" : "with-layout"}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/password-forgot" element={<PasswordForgot />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="/verification/success" element={<SuccessPage />} />
              <Route path="/profile/:name" element={<UserProfilePage />} />
              <Route path="/setting/profile" element={<ProfileSetting />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/read" element={<ViewBlog />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="/401" element={<UnauthorizedPage />} />
              <Route path="/" element={<Home />} />
            <Route path="/doan-menh" element={<FengShuiLookup />} />
            {/*<Route path="/tu-van-ho" element={<KoiPondConsultation />} />*/}
            <Route path="/ket-qua" element={<ResultPage />} />{" "}
            <Route path="/blog" element={<Blog />} />

              <Route path="*" element={<NotFound />} />

              {/*ADMIN ROUTE*/}
              <Route path="/admin" element={<ProtectedAdminPage />} />

              {/* NESTED ROUTES FOR ManageBlogPage */}
              <Route path="/admin/blogs" element={<ProtectedManageBlogPage />}>
                <Route path="pending" element={<PendingPosts />} />
                <Route path="approved" element={<ApprovedPosts />} />
                <Route path="rejected" element={<RejectedPosts />} />
              </Route>
            </Routes>
          </div>
          {!shouldExcludeLayout && <Footer />}
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
