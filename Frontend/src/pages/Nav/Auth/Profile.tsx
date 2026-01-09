import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { api } from "../../../lib/apiBase";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth";
import { ProfileWrapper } from "../../../components/ul/ProfileWrapper";

export const Profile = () => {
    const [error, setError] = useState<string | null>(null);
    const { user, setUser } = useUserAuth();
    const nav = useNavigate();
    const navigate = useNavigate();


    console.log(user);
    

    const handleSubmit = async () => {
        setError("");
        
        try {
            const res = await api.post("/auth/logout")
            setUser(res.data.user);
            nav("/");
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Error when signing out")
        }
    }

    const goToPersonalInfo = () => {
        navigate("/dashboard/Personal_Information")
    }

    const goToMyMessurements = () => {
        navigate("/dashboard/My_Messurements")
    }

    const goToOrders = () => {
        navigate("/dashboard/Order_History")
    }
    return (
        <ProfileWrapper title="Profile" isEditing={false} handleSubmit={handleSubmit} canEdit={false}>     
            {user && <p className="text-[clamp(15px,2vw,35px)] mb-4">Welcome, {user.name}!</p>}
            <section className="flex flex-col gap-2 mb-2 w-full items-center justify-center">
                {error && <p>{error}</p>}
                <button type="submit" className="w-fit border-b hover:text-gray-500" onClick={goToPersonalInfo}>
                    <h1 className="text-[clamp(20px,2vw,45px)] whitespace-nowrap">Personal Information</h1>
                </button>
                 <button type="submit" className="w-fit border-b hover:text-gray-500" onClick={goToMyMessurements}>
                    <h1 className="text-[clamp(20px,2vw,45px)] whitespace-nowrap">My Messurements</h1>
                </button>
                <button type="submit" className="w-fit border-b hover:text-gray-500" onClick={goToOrders}>
                    <h1 className="text-[clamp(20px,2vw,45px)] whitespace-nowrap">Order History</h1>
                </button>
            </section>
           
        </ProfileWrapper>

    )
}