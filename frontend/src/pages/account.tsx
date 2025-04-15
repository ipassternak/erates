import { useEffect, useState } from "react";
import { API_URL } from "../const";
import { useNavigate } from "react-router-dom";

type UserData = {
  item: {
    full_name: string;
    email: string;
    role: string;
  };
};

export const AccountPage = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div>Loading...</div>;

  if (!userData)
    return (
      <div>
        <h1>You are not logged in</h1>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    );

  return (
    <div className="account-page">
      <h1>Name: {userData.item.full_name}</h1>
      <p>Email: {userData.item.email}</p>
      <p>Member since: {userData.item.role}</p>
    </div>
  );
};
