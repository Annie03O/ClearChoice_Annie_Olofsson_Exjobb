import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../components/Login/LoginUserProvider";
import { Button } from "../../../components/ul/Button";
import { InfoInput } from "../../../components/ul/InfoInput";


export const Login = ({onClose, lastVisited}: {onClose: () => void, lastVisited: string}) => {
    const { login } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({ email: "", password: ""});
    const [error, setError] = useState<string | null>(null);
    
    console.log("lastVisited", lastVisited );
    
    const navToRegister = () => {
        nav("/Register");
        onClose();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);


        try {
            console.log("[Login] Attempting login with:", form);
            const success = await login(form.email, form.password);
            console.log("[Login] Login returned:", success);
            
            if (success) {
                console.log("[Login] Login successful, navigating to dashboard...");
                // Small delay to ensure state is updated
                setTimeout(() => {
                    nav(lastVisited, {replace: true});
                }, 100);
                onClose();
            } else {
                console.log("[Login] Login failed - success was false");
                setError("Login failed");
            }
        } catch (err: any) {
            console.error("[Login] Login error:", err);
            setError(err?.response?.data?.message ?? "Error when signing in")
        }
    }
    return (
        <section className={`bg-white text-black w-[50%] align-center justify-center p-6 rounded mx-auto `}>
            <h1 className="text-2xl">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <section className="flex flex-col gap-1">
                    <label className="text-xl" htmlFor="email">Email</label>
                    <InfoInput placeholder="Email" type="email" value={form.email}  onChange={(e) => setForm({...form, email: e.target.value})}/>
                </section>
                <section className="flex flex-col gap-1">
                    <label className="text-xl" htmlFor="password">Password</label>
                    <InfoInput placeholder="Password" type="password" value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}/>
                </section>
                <section className="flex w-full pt-1 gap-[6em]">
                    <section>
                        Not registered? 
                        <button onClick={navToRegister} className="text-blue-400 nowrap">Create an Account</button>
                    </section>
                    <section>
                        <Button type="submit" size="small" variant="primary">Sign In</Button>
                    </section>
                    {error && <p>{error}</p>}
                </section>
            </form>
        </section>
    )
}