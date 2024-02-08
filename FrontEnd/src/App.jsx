import "./App.css";
import { Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import OpenRoute from "./components/core/Auth/OpenRoute"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import Error from "./pages/Error"
import MyProfile from "./components/core/Dashboard/MyProfile";
import Settings from "./components/core/Dashboard/Settings";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse"
import Catalog from "./pages/Catalog";
import ViewCourse from "./pages/ViewCourse";
import ViewLecture from "./pages/ViewLecture";
import VideoDetails from "./components/core/ViewLecture/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
 import Contact from "./pages/Contact";

function App() {
  const {user} = useSelector((state) =>state.profile)
  return (
    <div className="w-screen min-h-screen bg-richblack-900  flex flex-col font-inter main">
      
      <Navbar />
      <Routes>
      <Route path="*" element={<Error />} />
      <Route path="/contact" element = {<Contact></Contact>}></Route>
        <Route path="/" element={<Home></Home>} />
        <Route path="signup" element={ <OpenRoute> <Signup></Signup> </OpenRoute>  } />
        <Route path="/catalog/:catalogName" element={ <Catalog></Catalog>   } />
        <Route path="login" element={<OpenRoute> <Login></Login>   </OpenRoute> } />
        <Route path="forgot-password" element={ <OpenRoute> <ForgotPassword></ForgotPassword></OpenRoute> } />
        <Route path="verify-email" element={ <OpenRoute> <VerifyEmail></VerifyEmail> </OpenRoute> } />
        <Route path="update-password/:id" element={ <OpenRoute><UpdatePassword></UpdatePassword></OpenRoute> } />
        <Route path="/about" element={<About></About>} />

        

        {/* contact page route */}
<Route element = {<PrivateRoute> <Dashboard></Dashboard> </PrivateRoute>}  >

<Route path="/dashboard/my-profile" element = {  <MyProfile></MyProfile>}></Route>
<Route path="dashboard/Settings" element={<Settings />} />
<Route path="/dashboard/enrolled-courses" element = {<EnrolledCourses></EnrolledCourses>}></Route>
<Route path="/dashboard/cart" element = {<Cart></Cart>}></Route>

{
  user?.accountType === ACCOUNT_TYPE.STUDENT && (
    <>

<Route path="/dashboard/enrolled-courses" element = {<EnrolledCourses></EnrolledCourses>}></Route>
<Route path="/dashboard/cart" element = {<Cart></Cart>}></Route>

</>)
}

{
  user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
    <>

    <Route path="/dashboard/add-course" element = {  <AddCourse></AddCourse> }></Route>
    <Route path = "/dashboard/my-courses" element = {<MyCourses></MyCourses>}></Route>
    <Route path = "/dashboard/edit-course/:courseId" element = {<EditCourse></EditCourse>}></Route>
    <Route path="/dashboard/instructor" element = {<Instructor></Instructor>}></Route>

</>)
}
</Route>


  
  

     <Route path="/courses/:courseId" element = { <ViewCourse></ViewCourse> }></Route> 
    
  
   <Route element = {<PrivateRoute><ViewLecture></ViewLecture></PrivateRoute>}>
          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <Route path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId"  element= {<VideoDetails></VideoDetails>} ></Route>
            )
          }
   </Route>
   
  


        

      </Routes>
    </div>
  );
}

export default App;
