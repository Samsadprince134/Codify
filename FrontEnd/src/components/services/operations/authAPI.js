import { endpoints } from "../apis";
import toast from "react-hot-toast";
import { setLoading } from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
import { setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { resetCart } from "../../slices/cartSlice";

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      console.log(endpoints.SENDOTP_API);
      const response = await apiConnector("POST", endpoints.SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      console.log("SENDOTP API RESPONSE............", response);

      console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        endpoints.RESETPASSTOKEN_API,
        { email }
      );
      console.log("Reset password token response-->", response);

      console.log("data is ->", response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Reset Email Sent Successfully");
      setEmailSent(true);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function resetPassword(newPassword, confirmnewPassword, token , navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", endpoints.RESETPASSWORD_API, {
        newPassword,
        confirmnewPassword,
        token,
      });

      console.log("response of sign up --> ", response);
      console.log("data is ->", response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password has beem reset successfully");
     
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function verifyemail(signupdata, otp, navigate) {
  const { firstName, lastName, email, password, confirmPassword, accountType } =
    signupdata;
  console.log(
    "in verify email function --->",
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType
  );
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", endpoints.SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        otp,
      });
      console.log("response in backend signup api calling --> ", response);
      console.log("data is ->", response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("OTP Verified");
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }

    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function LoginOperation(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", endpoints.LOGIN_API, {
        email,
        password,
      });
      console.log("response in backend login api calling --> ", response);
      console.log("data is ->", response.data.success);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login Successfully");
      dispatch(setToken(response.data.Token))
      const userImage = response.data?.userExistOrNot?.image
        ? response.data.userExistOrNot.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.FirstName} ${response.data.userExistOrNot.LastName}`
      dispatch(setUser({ ...response.data.userExistOrNot, image: userImage }))
      
      localStorage.setItem("token", JSON.stringify(response.data.Token))
      localStorage.setItem("user", JSON.stringify(response.data.userExistOrNot))
      navigate("/dashboard/my-profile")

     
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}


export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}