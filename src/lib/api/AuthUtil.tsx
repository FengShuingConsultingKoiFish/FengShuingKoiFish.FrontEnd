import { jwtDecode } from "jwt-decode";
import { clearCurrentUser } from "../redux/reducers/userSlice";
import { renewToken } from "./Authen";
import { Dispatch } from "redux";
import toast from "react-hot-toast";

// let renewalAttempts = 0; 
// const MAX_RENEWAL_ATTEMPTS = 3;

// export const checkAndRenewToken = async (dispatch: Dispatch): Promise<boolean> => {
//   const token = localStorage.getItem('token');
//   const refreshToken = localStorage.getItem('refreshToken');

//   if (!token || !refreshToken) {
//     dispatch(clearCurrentUser());
//     return false;
//   }

//   const user = jwtDecode<{ exp: number }>(token);
//   const currentTime = Math.floor(Date.now() / 1000);

//   if (user.exp < currentTime) {
//     if (renewalAttempts >= MAX_RENEWAL_ATTEMPTS) {
//       console.error("Max renewal attempts reached. Logging out.");
//       dispatch(clearCurrentUser());
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');
//       toast.error("Session expired. Please log in again.");
//       window.location.href = '/';
//       return false;
//     }

//     renewalAttempts += 1; // Increment on each renewal attempt
//     console.log(`Token expired, attempting to renew... Attempt ${renewalAttempts}`);

//     const isRenewed = await renewToken(token, refreshToken, dispatch);
//     if (!isRenewed) {
//       dispatch(clearCurrentUser());
//     } else {
//       renewalAttempts = 0; // Reset counter on success
//     }

//     return isRenewed;
//   }

//   return true;
// };
