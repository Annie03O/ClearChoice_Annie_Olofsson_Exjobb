import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useUserAuth } from "../../../hooks/Auth/useUserAuth";
import type { SizePayload } from "../../../services/size";
import { EditMessurements } from "./EditMessurements";
import { SavedMessurements } from "./SavedMessurements";
import { useNavigate } from "react-router";
import { api } from "../../../lib/apiBase";
import { ProfileWrapper } from "../../../components/ul/ProfileWrapper";

export const Messurements = () => {
  const [saved, setSaved] = useState<SizePayload>();
  const [edit, setEdit] = useState({
    shoulders: "",
    chest: "",
    waist: "",
  });
  const { user, setUser } = useUserAuth();
  const [err, setErr] = useState<string | null>(null);
  const [, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);   
  const nav = useNavigate();

  // 🔹 Läs sparade mått från localStorage när user finns
  useEffect(() => {
    try {
      if (!user) return;

      const storedMessurements = localStorage.getItem("messurements");
      console.log("[Messurements] Raw localStorage value:", storedMessurements);

      if (!storedMessurements) {
        console.log("No messurements found in localStorage.");
        return;
      }

      const messurements = JSON.parse(storedMessurements) as any;
      console.log("[Messurements] Parsed object:", messurements);

      const shoulders = messurements.shoulders || messurements.shoulder;
      const userId = messurements.id;

      if (!shoulders) {
        console.error(
          "No shoulder measurement found in localStorage.",
          messurements
        );
        return;
      }

      if (userId === user.id) {
        console.log(
          "[Messurements] User ID matches, setting saved measurements"
        );
        const payload: SizePayload = {
          id: userId,
          chest: messurements.chest,
          shoulders,
          waist: messurements.waist,
        };
        setSaved(payload);

        // Fyll inputfälten med sparade värden
        setEdit({
          shoulders: String(payload.shoulders ?? ""),
          chest: String(payload.chest ?? ""),
          waist: String(payload.waist ?? ""),
        });
      } else {
        console.log(
          "[Messurements] User ID doesn't match. Stored:",
          userId,
          "Current:",
          user.id
        );
      }
    } catch (err) {
      console.error("[Messurements] Error parsing localStorage:", err);
    }
  }, [user]);

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);

    try {

      if (!user) {
        setErr("User not found");
        return;
      }

      console.log("Saving measurements:", edit);

      const shoulders = Number(edit.shoulders);
      const chest = Number(edit.chest);
      const waist = Number(edit.waist);

      if (!shoulders || !chest || !waist) {
        setErr("All measurements must be provided to save.");
        return;
      }

      const messurements: SizePayload = {
        id: user.id,
        shoulders,
        chest,
        waist,
      };

      // uppdatera user i auth-context
      setUser?.({
        ...user,
        messurements,
      });

      // spara i localStorage
      localStorage.setItem("messurements", JSON.stringify(messurements));

      // uppdatera lokalt "saved"
      setSaved(messurements);

      // stäng edit-läget
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      setErr("Couldn't save measurements");
    } finally {
      setLoading(false);
    }
  };

  const editShoulder = (value: string) => {
    setEdit((prev) => ({
      ...prev,
      shoulders: value,
    }));
  };

  const editChest = (value: string) => {
    setEdit((prev) => ({
      ...prev,
      chest: value,
    }));
  };

  const editWaist = (value: string) => {
    setEdit((prev) => ({
      ...prev,
      waist: value,
    }));
  };

  const handleSubmit = async () => {
      setErr("");
      
      try {
          const res = await api.post("/auth/logout")
          setUser(res.data.user);
          nav("/");
      } catch (err: any) {
          setErr(err?.response?.data?.error ?? "Error when signing out")
      }
    }

  return (
    <ProfileWrapper title="My Messurements" details handleSubmit={handleSubmit} isEditing={isEditing} setIsEditing={setIsEditing} canEdit>
      
      {!saved ? (
        <p>No messurements are saved in browser.</p>
      ) : (
        <section className="whitespace-nowrap w-[clamp(50%,3vw,70%)] ">
          {err && <p className="text-red-500">{err}</p>}


          {isEditing ? (
            <EditMessurements
              open={true}
              onClose={() => setIsEditing(false)}
              edit={edit}
              error={err}
              onSubmit={handleSave}
              onShoulderChange={editShoulder}
              onChestChange={editChest}
              onWaistChange={editWaist}
            />
          ) : (
            <SavedMessurements
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
