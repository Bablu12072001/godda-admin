import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Auth() {
  const navigate = useNavigate();

  // localStorage.setItem("loginToken",temp);
  const token = localStorage.getItem("loginToken");

  if (!token) {
    // navigate("/login", { replace: true });
    return { token: null, decoded: null };
  }

  try {
    // console.log("Under Authentication Comp");
    const decoded = jwtDecode(token);
    // console.log('DecodedData=', decoded);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Token is expired
      localStorage.removeItem("loginToken");
      navigate("/login", { replace: true });
    }
    // console.log('DecodedData=', decoded);
    return { token, decoded };
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("loginToken");
    // navigate("/login", { replace: true });
    return { token: null, decoded: null };
  }
}
