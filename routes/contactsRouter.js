import express from "express";
import controllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import isValidId from "../helpers/isValidId.js";
import auth from "../middleware/auth.js";

const contactsRouter = express.Router();
const jsonParse = express.json();

contactsRouter.get("/", auth, controllers.getAllContacts);

contactsRouter.get("/:id", auth, isValidId, controllers.getOneContact);

contactsRouter.delete("/:id", auth, isValidId, controllers.deleteContact);

contactsRouter.post(
  "/",
  auth,
  jsonParse,
  validateBody(createContactSchema),
  controllers.createContact
);

contactsRouter.put(
  "/:id",
  auth,
  isValidId,
  jsonParse,
  validateBody(updateContactSchema),
  controllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  auth,
  isValidId,
  jsonParse,
  validateBody(updateContactSchema),
  controllers.updateStatusContact
);

export default contactsRouter;
