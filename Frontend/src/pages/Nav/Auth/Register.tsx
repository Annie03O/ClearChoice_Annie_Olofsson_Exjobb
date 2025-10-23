import { useState } from "react";
import { api } from "../../../lib/apiBase";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth";
import { useNavigate, Link } from "react-router-dom"

export const Register = () => {
    const { setUser } = useUserAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({name: "", email: "", password: ""});
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await api.post("/auth/register", form);
            setUser(res.data.user);
            nav("/dashboard")
        } catch (error: any) {
            setError(error?.response?.data?.error ?? "Something went wrong")           
        }
    }

    return (
        <section className="registerContainer">
            <h1>Create an account</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Full Name</label>
                <input placeholder="Full Name" value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} />

                <label htmlFor="email">Email</label>
                <input placeholder="Email" type="email" value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}/>

                <label htmlFor="password">Password</label>
                <input placeholder="Password" type="password" value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})} />
                <button type="submit">Create Account</button>
                {error && <p>{error}</p>}
            </form>
            <p>Do you already have an account? <Link to={"/Login"}>Sign In</Link></p>
        </section>
    )
}