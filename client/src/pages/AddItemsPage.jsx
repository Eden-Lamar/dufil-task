import { useState, useEffect  } from "react";
import "animate.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Button} from "@heroui/button";
import {Alert} from "@heroui/alert";
import axios from "../api/axios";
import "./items.css";
import { useUIState } from "../context/UIStateContext";

const itemSchema  = yup.object().shape({
	name: yup.string().required("Name is required").min(5, "Name must be at least 5 characters long").max(100, "Too Long..."),
	description: yup
		.string()
		.required("Description is required")
		.min(10, "Description must be at least 10 characters long").max(500, "Too Long..."),
});

const AddItemsPage = () => {
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const { toggleInputFocus } = useUIState();


	const { register, handleSubmit, formState: { errors }, reset } = useForm({
		resolver: yupResolver(itemSchema ),
	});

	const onSubmit = async (data) => {
		setLoading(true);
		setMessage("");
		setError("");

		try {
			const response = await axios.post(
				"/api/v1/item",
				{
					name: data.name,
					description: data.description,
				}
			);

			if (response.status === 201) {
				setMessage("Item added successfully!");
				reset(); // Clear form inputs after success
			}
		} catch (err) {
			setError(err.response?.data?.error || "Something went wrong, check your connection. 📡📡");
		} finally {
			setLoading(false);
		}
	};

	// Clear alerts after 5 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			setMessage("");
			setError("");
		}, 10000);

		return () => clearTimeout(timer);
	}, [message, error]);


	return (
		<section className="h-[100vh] flex justify-center flex-col items-center bg-gradient-to-r from-sky-500 to-indigo-500 dark:bg-gradient-to-l dark:from-sky-300 dark:to-indigo-600">

			{/* Success Message */}
			{message && (
						<div className="absolute z-20 top-5 w-11/12 md:w-1/2 animate__animated animate__fadeIn">
							
							<Alert
								color="success"
								title={message}
								variant="solid"
								className=" mx-auto"
							/>
						</div>
					)}

					{/* Error Message */}
					{error && (
					<div className="absolute z-20 top-5 w-11/12 md:w-1/2 animate__animated animate__fadeIn">
						
						<Alert
							color="danger"
							title={error}
							variant="solid"
							className="mx-auto"
						/>
					</div>
			)}

		<div className="book min-h-[60%] md:h-[95vh] w-[95vw] md:w-[80vw] z-10">

		  <div className="w-full md:w-1/2 min-h-full flex justify-center items-center">


			<form onSubmit={handleSubmit(onSubmit)} className="min-h-full w-4/5 space-y-10">
			  <h2 className="text-center text-3xl font-semibold text-blue-500 py-8">
				ADD ITEMS TO YOUR INVENTORY
			  </h2>

			  <div className="relative mb-6">
				<input
				  type="text"
				  {...register("name")}
				  className="peer block w-full md:w-9/12 px-4 py-2 border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-500"
				  placeholder=""
				  id="name"
				  onFocus={() => toggleInputFocus(true)}
				  onBlur={() => toggleInputFocus(false)}
				/>
				<label htmlFor="name" className="absolute left-4 top-2 text-gray-500 pointer-events-none transform transition-transform duration-200 ease-in-out peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-500  peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:text-blue-500">Name</label>

				{errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
			  </div>
  
			  <div className="relative mb-6">
				<input
				  type="text"
				  {...register("description")}
				  className="peer block w-full md:w-9/12 px-4 py-2 border-b-2 border-gray-300 appearance-none focus:outline-none focus:border-blue-500"
				  placeholder=""
				  id="description"
				  onFocus={() => toggleInputFocus(true)}
				  onBlur={() => toggleInputFocus(false)}
				/>
				<label htmlFor="description" className="absolute left-4 top-2 text-gray-500 pointer-events-none transform transition-transform duration-200 ease-in-out peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-blue-500  peer-[&:not(:placeholder-shown)]:-translate-y-6 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:text-blue-500">Description</label>

				{errors.description && <p className="text-red-500 text-small">{errors.description.message}</p>}
			  </div>

			  <div>
				<Button type="submit" isLoading={loading? true : false} className="text-blue-400 border-blue-400 "
				variant="bordered"
				size="lg"
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
					Add Item
				</Button>

			  </div>
  
			
				<div className="block md:hidden"></div>
  
			</form>
		  </div>
		</div>
	  </section>
	);
}

export default AddItemsPage;
