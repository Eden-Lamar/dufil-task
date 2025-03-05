import { createContext, useContext, useState, useEffect, useCallback, useRef} from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(""); // For error messages
  const [isSubmitting, setIsSubmitting] = useState(false); // For button loading state
  const [loading, setLoading] = useState(true);
  const storedUser = localStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);

  const navigate = useNavigate();
  const logoutTimerRef = useRef(null);

	// Logout function
	const logout = useCallback(() => {
		localStorage.removeItem('token');
		localStorage.removeItem("user");
		setUser(null);
		navigate("/login");

		// Clear the timeout when logging out
		if (logoutTimerRef.current) {
			clearTimeout(logoutTimerRef.current);
		}

	}, [navigate]);

  // Decode Token and Schedule Logout
  const scheduleLogout = useCallback((token) => {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const remainingTime = expirationTime - currentTime;

    if (remainingTime <= 0) {
      logout(); // Token already expired
    } else {
		// Clear any existing timer before setting a new one
		if (logoutTimerRef.current) {
			clearTimeout(logoutTimerRef.current);
		}
      	
		logoutTimerRef.current = setTimeout(() => {
        logout();
        setError("Session expired. Please log in again.");
      }, remainingTime);
    }
  }, [logout]);


	// Check for token and set user on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
	  scheduleLogout(token); // Schedule logout on load
    }else {
		setUser(null);
	}
	
	setLoading(false); // Set loading to false once checked

	 // Set up Axios Interceptor to add token to every request
	 const interceptor = axios.interceptors.request.use(
		(config) => {
		  const token = localStorage.getItem("token");
		  if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		  }
		  return config;
		},
		(error) => {
		  return Promise.reject(error);
		}
	  );
	  

	  // Clean up the interceptor when the component unmounts
	  return () => {
		axios.interceptors.request.eject(interceptor);
	  };

  }, []);


  // Login function
  const login = async (data) => {
	setIsSubmitting(true);
    setError("");
    try {
      const response = await axios.post("/api/v1/user/login", data);
      const token = response.headers['authorization']?.split(' ')[1];
      if (token) {
        localStorage.setItem("token", token);

        // Get username from response and store user info in localStorage
        const userData = { username: response.data.username };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/");
      } else {
        setError("Login failed. Token not received.");
      }
      navigate("/");
    } catch (error) {
        // console.error("Login error:", error?.response?.data.error);
      setError(error?.response?.data?.error || "An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Register function
  const signup = async (data) => {
    setIsSubmitting(true);
    setError("");
    try {
		await axios.post("/api/v1/user/register", data);

		// If registration is successful, automatically log the user in
		const loginData = {
			email: data.email,
			password: data.password
		};

		await login(loginData);
    } catch (error) {
      // console.log(error?.response?.data?.error)
		setError(error?.response?.data?.error || "An error occurred. Please try again later.");
    } finally {
		setIsSubmitting(false);
	}
  };



  return (
    <AuthContext.Provider value={{ user, login, signup, logout,  error, 
		isSubmitting, loading  }}>
      {!loading && children} {/* Only render children after checking authentication */}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = false;