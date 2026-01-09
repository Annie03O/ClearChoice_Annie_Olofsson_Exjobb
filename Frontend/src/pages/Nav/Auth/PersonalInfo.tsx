import { useEffect, useState } from "react";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth";
import { api } from "../../../lib/apiBase";
import type { AuthUser } from "../../../models/Types/Login/AuthUser";
import { EditPersonalInfo } from "./EditPersonalInfo";
import { SavedPersonalInfo } from "./SavedPersonalInfo";
import { ProfileWrapper } from "../../../components/ul/ProfileWrapper";

export const PersonalInfo = () => {
  const { user, setUser, loading: authLoading } = useUserAuth();

  const [saved, setSaved] = useState<AuthUser | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Hämta /auth/me när sidan öppnas
  useEffect(() => {
    let cancelled = false;

    setRefreshing(true);

    api
      .get("/auth/me")
      .then((res) => {
        if (cancelled) return;

        console.log("[PersonalInfo] Got user data:", res.data);
        setUser(res.data);

        const payload: AuthUser = {
          id: res.data.id,
          name: res.data.name,
          email: res.data.email,
        };

        setSaved(payload);
      })
      .catch((error) => {
        if (cancelled) return;
        console.error("[PersonalInfo] Error fetching user:", error);
        setErr("Kunde inte hämta användarinformation.");
      })
      .finally(() => {
        if (cancelled) return;
        setRefreshing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setUser]);

  const handleSave = async (values: {
    name: string;
    email: string;
    password?: string;
  }) => {
    try {
      setErr(null);
      setSaving(true);

      if (!user) {
        setErr("Ingen användare är inloggad.");
        return;
      }

      const payload: {
        name?: string;
        email?: string;
        password?: string;
      } = {
        name: values.name.trim(),
        email: values.email.trim(),
      };

      if (values.password && values.password.trim()) {
        payload.password = values.password.trim();
      }

      console.log("[PersonalInfo] Updating personal info with", payload);

      // OBS: backend måste ha denna route
      const { data } = await api.put("/auth/me", payload);

      setUser(data);

      const updated: AuthUser = {
        id: data.id,
        name: data.name,
        email: data.email,
      };
      setSaved(updated);

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setErr("Kunde inte spara ändringarna för personuppgifter.");
    } finally {
      setSaving(false);
    }
  };

  // Loading första gången innan vi har data
  if ((authLoading || refreshing) && !saved) {
    return <section>Loading profile...</section>;
  }

  return (
    <ProfileWrapper title="Personal Info" details setIsEditing={() => setIsEditing(true)} isEditing={isEditing} canEdit>
      {err && <p className="text-red-500 mb-2">{err}</p>}

      {!saved ? (
        <p>Inga sparade personuppgifter hittades.</p>
      ) : (
        <section className="whitespace-nowrap w-[clamp(30%,40%,50%)]">
          <header className="flex">
           

           </header>
          {isEditing ? (
            <EditPersonalInfo
              open={true}
              onClose={() => setIsEditing(false)}
              initialName={saved.name ?? ""}
              initialEmail={saved.email ?? ""}
              error={err}
              loading={saving}
              onSave={handleSave}
            />
          ) : (
            <SavedPersonalInfo
              open={true}
              onClose={() => setIsEditing(false)}
              saved={saved}
              error={err}
            />
          )}
        </section>
      )}
    </ProfileWrapper>
  );
};
