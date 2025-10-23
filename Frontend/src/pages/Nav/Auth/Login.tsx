import { useState } from "react";
import { api } from "../../../lib/apiBase";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth";
import { useNavigate, Link } from "react-router";

export const Login = () => {
    const { setUser } = useUserAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({ email: "", password: ""});
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await api.post("/auth/login", form); 
            setUser(res.data.user);
            nav("/dashboard");
        } catch (err: any) {
            setError(err?.response?.data?.error ?? "Error when signing in")
        }
    }

    return (
        <section className="logInContainer">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input placeholder="Email" type="email" value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}/>
                <br />
                <label htmlFor="password">Password</label>
                <input placeholder="Password" type="password" value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}/>

                <br />
                <button type="submit">Sign In</button>
                {error && <p>{error}</p>}
                <p>
                    Not registered? <Link to="/register">Create an Accunt</Link>
                </p>
            </form>
        </section>
    )
}