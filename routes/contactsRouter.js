import express from "express";
import controllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import isValidId from "../helpers/isValidId.js";

const contactsRouter = express.Router();
const jsonParse = express.json();

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", isValidId, controllers.getOneContact);

contactsRouter.delete("/:id", isValidId, controllers.deleteContact);

contactsRouter.post(
  "/",
  jsonParse,
  validateBody(createContactSchema),
  controllers.createContact
);

contactsRouter.put(
  "/:id",
  isValidId,
  jsonParse,
  validateBody(updateContactSchema),
  controllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  jsonParse,
  validateBody(updateContactSchema),
  controllers.updateStatusContact
);

export default contactsRouter;
