import express from "express";
import controllers from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();
const jsonParse = express.json();

contactsRouter.get("/", controllers.getAllContacts);

contactsRouter.get("/:id", controllers.getOneContact);

contactsRouter.delete("/:id", controllers.deleteContact);

contactsRouter.post(
  "/",
  jsonParse,
  validateBody(createContactSchema),
  controllers.createContact
);

contactsRouter.put(
  "/:id",
  jsonParse,
  validateBody(updateContactSchema),
  controllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  jsonParse,
  validateBody(updateContactSchema),
  controllers.updateStatusContact
);

export default contactsRouter;
