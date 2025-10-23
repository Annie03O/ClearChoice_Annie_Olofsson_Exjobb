import { Router } from "express";
import { requireAuth } from "../middlewares/Auth";
import { getUserSizes } from "../helpers/getUserSizes";
import { isValidSizePayload } from "../helpers/isValidSizePayload";
import { saveUserSizes } from "../helpers/saveUserSizes";

export const saveSizeRouter = Router();

saveSizeRouter.get("/saveSize", requireAuth, async (req, res) => {
   const userId = req.user!.id;
   const size = await getUserSizes(userId);
   return res.json({size});
}
)
  

saveSizeRouter.post("/saveSize", requireAuth, async (req, res) => {
  const userId = req.user!.id;

  if (!isValidSizePayload(req.body)) {
    return res.status(400).json({error: "Invalid payload"});
  }

  await saveUserSizes({
    userId,
    shoulderSize: req.body.shoulderSize,
    chestSize: req.body.chestSize,
    waistSize: req.body.waistSize
  })

  return res.sendStatus(204);
})