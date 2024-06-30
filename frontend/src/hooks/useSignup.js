import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();

	const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
		const success = handleInputErrors({ fullName, username, password, confirmPassword, gender });
		if (!success) return; // if some error like not filled any field by user then we will return

		setLoading(true);// untill the data goes to backend the user will se loading 
		try {  
			const res = await fetch("/api/auth/signup", {
			//If validation passes, it sets the loading state to true and makes an HTTP POST request to the backend endpoint /api/auth/signup
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, password, confirmPassword, gender }),
				//converts a JavaScript object into a JSON string. 
				//JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write and easy for machines to parse and generate.
			});

			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}
			localStorage.setItem("chat-user", JSON.stringify(data));// this is cookie data is stored in client browser
			 // we will also store the data of user signed in local databse 
			 // because when refresh the page we get the data if user was already logged in then let it remain logged
			setAuthUser(data);//updates the authenticated user state using setAuthUser.// using context(see authcontext.jsx) so that when user gets logged in it goes to home page                             
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};
export default useSignup;

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");  
		// we made these checks in backend also and here also we are checking 
		//because user can cheat by manipulating frontend but not the backend 
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
