import { useState } from "react";
import { Link, useNavigate } from "react-router"; 
import { api } from "../../../lib/apiBase";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth";

export const Profile = () => {
    const [error, setError] = useState<string | null>(null);
    const { setUser } = useUserAuth();
    const nav = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await api.post("/auth/logout")
            setUser(res.data.user);
            nav("/");
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Error when signing out")
        }
    }

    return (
        <section>
            <h1>Profile</h1>
            <h2><Link to={"/Personal_Information"}>Personal Information</Link></h2>
            <h2><Link to={"/My_Messurements"}>My Messurements</Link></h2>
            <button onClick={handleSubmit}>Sign Out</button>
        </section>
    )
}