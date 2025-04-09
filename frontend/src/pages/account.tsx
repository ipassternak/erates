import { useEffect, useState } from "react";
import { API_URL } from "../const";

export const AccountPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/account/data`)
      .then((response) => response.json())
      .then((data) => setUserData(data));
  }, []);

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="account-page">
      <h1>Account: {userData.user.name}</h1>
      <p>Email: {userData.user.email}</p>
      <p>Member since: {userData.stats.joined}</p>
    </div>
  );
};
