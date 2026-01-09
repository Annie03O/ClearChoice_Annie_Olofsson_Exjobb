import { useState } from "react";
import { api } from "../../../lib/apiBase";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth";
import { useNavigate, Link } from "react-router-dom"
import { InfoInput } from "../../../components/ul/InfoInput"; 
import { Button } from "../../../components/ul/Button";

export const Register = () => {
    const { setUser } = useUserAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({name: "", email: "", password: ""});
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            console.log("Attempting registration with:", form);
            await api.post("/auth/register", form);
            // After registration, fetch user data
            const { data } = await api.get("/auth/me");
            setUser(data);
            nav("/dashboard");
        } catch (error: any) {
            console.error("Registration error:", error.response?.data);
            setError(error?.response?.data?.message ?? "Something went wrong")           
        }
    }

    return (
        <section className="bg-white w-[30%] text-[#010057] align-center justify-center p-6 rounded mx-auto mt-20">
            <h1 className="text-2xl">Create an account</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <section className="flex flex-col gap-1">
                    <label className="text-xl" htmlFor="name">Full Name</label>
                    <InfoInput placeholder="Full Name"  value={form.name} 
                    onChange={(e) => setForm({...form, name: e.target.value})} />
                </section>
                <section className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-xl">Email</label>
                    <InfoInput placeholder="Email" type="email" value={form.email} 
                    onChange={(e) => setForm({...form, email: e.target.value})}/>
                </section>
                <section className="flex flex-col gap-1">
                    <label className="text-xl" htmlFor="password">Password</label>
                    <InfoInput placeholder="Password"  type="password" value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})} />
                </section>
                 <section className="flex w-full pt-1 relative">
                      <span className="text-[18px] flex whitespace-nowrap relative align-center">
                        Do you already have an account? <Link className="ml-1 text-blue-400 nowrap" to={"/Login"}>Sign In</Link>                  
                      </span>   
                      <span className="absolute right-0">
                        <Button type="submit" size="small" variant="primary">Create Account</Button>
                      </span>
                     {error && <p>{error}</p>}
                 </section>
            </form>
           
        </section>
    )
}