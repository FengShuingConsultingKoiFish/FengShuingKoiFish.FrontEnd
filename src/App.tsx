import { useEffect } from "react"

import { Provider, useSelector } from "react-redux"
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom"
import { PersistGate } from "redux-persist/integration/react"

import Footer from "./components/layout/footer/Footer"
import Navbar from "./components/layout/header/Navbar"
import ProtectedRoute from "./components/providers/ProtectedRoute"
import ToasterProvider from "./components/providers/Toaster"
import LoginModal from "./components/ui/modals/LoginModal"
import SignupModal from "./components/ui/modals/SignupModal"
import store, { RootState, persistor } from "./lib/redux/store"
import { AdminPage } from "./pages/Admin/AdminPage"
import { ApprovedAdver } from "./pages/Admin/ManageAdver/ApprovedAdver"
import { ManageAdverPage } from "./pages/Admin/ManageAdver/ManageAdver"
import { PendingAdver } from "./pages/Admin/ManageAdver/PendingAdver"
import { RejectedAdver } from "./pages/Admin/ManageAdver/RejectedAdver"
import { ApprovedPosts } from "./pages/Admin/ManageBlog/ApprovedBlog"
import { ManageBlogPage } from "./pages/Admin/ManageBlog/ManageBlogs"
import { PendingPosts } from "./pages/Admin/ManageBlog/PendingBlog"
import { RejectedPosts } from "./pages/Admin/ManageBlog/RejectedBlog"
import Blog from "./pages/Blog/Blog"
import { ViewBlog } from "./pages/Blog/ViewBlog"
import CreateBlogModal from "./pages/Blog/components/CreateBlogModal"
import FengShuiLookup from "./pages/FengShuiLookup"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import PasswordForgot from "./pages/Password-forgot"
import PasswordReset from "./pages/Password-reset"
import ResultPage from "./pages/ResultPage"
import ProfileSetting from "./pages/Setting/Profile"
import UserProfilePage from "./pages/UserProfile"
import UnauthorizedPage from "./pages/Verification/NotAuthorize"
import SuccessPage from "./pages/Verification/SuccessPage"

const ProtectedAdminPage = ProtectedRoute(AdminPage)
const ProtectedManageBlogPage = ProtectedRoute(ManageBlogPage)
const ProtectedManageAdverPage = ProtectedRoute(ManageAdverPage)

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useSelector((state: RootState) => state.users.currentUser)

  useEffect(() => {
    if (currentUser?.Name === "Admin" && location.pathname === "/") {
      navigate("/admin")
    }
  }, [currentUser, location.pathname, navigate])

  const excludeLayoutPaths = [
    "/password-forgot",
    "/password-reset",
    "/verification/success",
    "/blog/create",
    "/404",
    "/401"
  ]
  const shouldExcludeLayout = excludeLayoutPaths.includes(location.pathname)

  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
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
            {/* NESTED ROUTES FOR ManageAdverPage */}
            <Route
              path="/admin/quang-cao"
              element={<ProtectedManageAdverPage />}
            >
              <Route path="pending" element={<PendingAdver />} />
              <Route path="approved" element={<ApprovedAdver />} />
              <Route path="rejected" element={<RejectedAdver />} />
            </Route>
          </Routes>
        </div>
        {!shouldExcludeLayout && !isAdminRoute && <Footer />}
      </PersistGate>
    </>
  )
}

export default App
