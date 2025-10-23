import { useEffect, useState } from "react";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth"
import { api } from "../../../lib/apiBase";

export const PersonalInfo = () => {
    const {user, setUser, loading} = useUserAuth();
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!user) return;
        setRefreshing(true);

        api.get("/auth/me")
        .then(res => setUser(res.data.user))
        .catch(() => {})
        .finally(() => setRefreshing(false));
    }, []);

    if (loading || refreshing) return <div>Loading profile...</div>

    return <section>
            <h1>Personal Information</h1>
            <p><b>Name</b> {user?.name}</p>
            <p><b>Email</b> {user?.email}</p>
        </section>
}