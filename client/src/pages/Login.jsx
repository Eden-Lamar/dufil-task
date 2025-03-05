import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaRegEyeSlash, FaRegEye  } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import 'animate.css';
import {Button} from "@heroui/button";
import {Alert} from "@heroui/alert";
import { useAuth } from "../context/AuthContext";



const loginSchema  = yup.object().shape({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters long, One Uppercase, One Lowercase, and One Number")
});


const Login = () => {
	const { login,  error, isSubmitting } = useAuth();

	const { register, handleSubmit, formState: { errors } } = useForm({
			resolver: yupResolver(loginSchema ),
		});
	
		const [showPassword, setShowPassword] = useState(false);
		const [showAlert, setShowAlert] = useState(false);


	
		const onSubmit = async (data) => {
			login(data);
		};
	
		// Show alert when there's an error
		useEffect(() => {
			if (error) {
				setShowAlert(true);
				// Hide the alert after 5 seconds
				const timer = setTimeout(() => {
					setShowAlert(false);
				}, 15000);

				// Cleanup the timer
				return () => clearTimeout(timer);
			}
		}, [error]);

	return (
		<div className="relative h-screen bg-login-img bg-cover bg-center">
			<div className="absolute inset-0 bg-black opacity-50"></div>

			<div className={`absolute mt-3 w-full flex justify-center animate__animated ${showAlert ? "block animate__fadeInDown" : "hidden"}`}>
				
					<div className="w-full">
						<Alert
							color="danger"
							title={error}
							variant="solid"
							className=" w-11/12 md:w-1/2 mx-auto"
						/>

					</div>
			</div>


				<div className="relative z-10 flex items-center justify-center h-full">
					<form onSubmit={handleSubmit(onSubmit)} className="backdrop-blur-sm bg-black/25 min-h-[50%] w-11/12 md:w-1/3 p-5 rounded-lg">
						<h1 className="text-white mb-4 text-xl">Login</h1>

						<div className="relative mb-4">

							<input
								type="text"
								{...register("email")}
								className="peer w-full p-2 border rounded text-black outline-none bg-slate-200 pt-5"
								id="email"
								required
							/>

							<label htmlFor="email" className="absolute left-3 top-4 text-zinc-500 pointer-events-none transition-all duration-200 ease-in-out transform
								peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-blue-500 peer-valid:-translate-y-4 peer-valid:text-sm">Email</label>

							{errors.email && <p className="text-red-500">{errors.email.message}</p>}
						</div>
						
						<div className="relative mb-4">

							<input
								type={showPassword ? "text" : "password"}
								{...register("password")}
								className="peer w-full p-2 border rounded text-black outline-none bg-slate-200 pt-5"
								id="password"
								required
							/>
							{/* Eye Icon */}
							<div className="absolute right-3 top-5 cursor-pointer text-black text-lg" onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
							</div>

							<label htmlFor="password" className="absolute left-3 top-4 text-zinc-500 pointer-events-none transition-all duration-200 ease-in-out transform
							peer-focus:-translate-y-4 peer-focus:text-sm peer-focus:text-blue-500 peer-valid:-translate-y-4 peer-valid:text-sm">Password</label>

							{errors.password && <p className="text-red-500">{errors.password.message}</p>}
						</div>
							
						<div>
							{/* <button className="btn btn-outline w-full btn-info" disabled={isSubmitting}>
								<span className={`${isSubmitting ? "loading loading-spinner" : ""}`}></span>
										Login</button> */}

							<Button type="submit" isLoading={isSubmitting? true : false} className="text-blue-400 border-blue-400 w-full"
								size="lg"
								variant="bordered"
								spinner={
									<svg
									className="animate-spin h-5 w-5 text-current"
									fill="none"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
									>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									/>
									<path
										className="opacity-75"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										fill="currentColor"
									/>
									</svg>
								}>
									Login
								</Button>



						</div>

						<p className="text-stone-300 py-6 md:py-2">Don&apos;t have an account yet? <Link to= "/signup" className="text-blue-500 underline font-medium">Sign Up</Link>
						</p>
					</form>
				</div>
		</div>
	);
}

export default Login;
