import { useEffect } from "react"

import { Provider, useSelector } from "react-redux"
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom"

import Footer from "./components/layout/footer/Footer"
import Navbar from "./components/layout/header/Navbar"
import ProtectedRoute from "./components/providers/ProtectedRoute"
import ToasterProvider from "./components/providers/Toaster"
import LoginModal from "./components/ui/modals/LoginModal"
import SignupModal from "./components/ui/modals/SignupModal"
import { RootState } from "./lib/redux/store"
import { AdminPage } from "./pages/Admin/AdminPage"
import { EditAdver } from "./pages/Admin/ManageAdver/EditAdver"
import { AllAdver } from "./pages/Admin/ManageAdver/AllAdver"
import { CreateAdver } from "./pages/Admin/ManageAdver/CreateAdver"
import { ManageAdverPage } from "./pages/Admin/ManageAdver/ManageAdver"
import { ApprovedPosts } from "./pages/Admin/ManageBlog/ApprovedBlog"
import { ManageBlogPage } from "./pages/Admin/ManageBlog/ManageBlogs"
import { PendingPosts } from "./pages/Admin/ManageBlog/PendingBlog"
import { RejectedPosts } from "./pages/Admin/ManageBlog/RejectedBlog"
import Blog from "./pages/Blog/Blog"
import CreateBlogModal from "./pages/Blog/components/CreateBlogModal"
import CreatePondPage from "./pages/CreatePondPage"
import FengShuiLookup from "./pages/FengShuiLookup"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import { PackageDetailPage } from "./pages/Packages/PackageDetailPage"
import { PackagePage } from "./pages/Packages/PackagePage"
import PasswordForgot from "./pages/Password-forgot"
import PasswordReset from "./pages/Password-reset"
import PondConsultationPage from "./pages/PondConsultationPage "
import PondDetails from "./pages/PondDetails"
import ResultPage from "./pages/ResultPage"
import SeeAllPond from "./pages/SeeAllPond"
import ProfileSetting from "./pages/Setting/Profile"
import UserProfilePage from "./pages/UserProfile"
import UnauthorizedPage from "./pages/Verification/NotAuthorize"
import SuccessPage from "./pages/Verification/SuccessPage"
import { ManageUserPage } from "./pages/Admin/ManageUser/ManageUser"
import AllUser from "./pages/Admin/ManageUser/AllUser"
import PostedBlog from "./pages/User/PostedBlog"
import EditBlogModal from "./pages/User/components/EditBlogModal"

const ProtectedAdminPage = ProtectedRoute(AdminPage)
const ProtectedManageBlogPage = ProtectedRoute(ManageBlogPage)
const ProtectedManageAdverPage = ProtectedRoute(ManageAdverPage)
const ProtectedManageUserPage = ProtectedRoute(ManageUserPage)

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
    "*",
    "/401"
  ]
  const shouldExcludeLayout = excludeLayoutPaths.includes(location.pathname)

  const isAdminRoute = location.pathname.startsWith("/admin")

  return (
    <>
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
          <Route path="/goi-hoi-vien/:id" element={<PackageDetailPage />} />
          <Route path="/goi-hoi-vien" element={<PackagePage />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="/401" element={<UnauthorizedPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/doan-menh" element={<FengShuiLookup />} />
          <Route path="/ket-qua" element={<ResultPage />} />
          <Route path="/tu-van-ho" element={<PondConsultationPage />} />
          <Route path="/create-pond" element={<CreatePondPage />} />
          <Route path="/see-all-pond" element={<SeeAllPond />} />
          <Route path="/pond-details/:userPondId" element={<PondDetails />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog-cua-toi" element={<PostedBlog/>} />
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
            path="/admin/goi-quang-cao"
            element={<ProtectedManageAdverPage />}
          >
            <Route path="create" element={<CreateAdver />} />
            <Route path="all" element={<AllAdver />} />
            <Route path="edit/:id" element={<EditAdver />} />
          </Route>
          {/* NESTED ROUTES FOR ManageAdverPage */}
          <Route
            path="/admin/nguoi-dung"
            element={<ProtectedManageUserPage/>}
          >
            <Route path="all" element={<AllUser />} />
          </Route>
        </Routes>
      </div>
      {!shouldExcludeLayout && !isAdminRoute && <Footer />}
    </>
  )
}

export default App
