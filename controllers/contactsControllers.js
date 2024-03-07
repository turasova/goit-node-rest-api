import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contactModel.js";

async function getAllContacts(req, res, next) {
  const { page = 1, limit = 2 } = req.query;
  const skip = (page - 1) * limit;
  try {
    const contacts = await Contact.find(
      { owner: req.user._id },
      "-createdAt -updatedAt",
      { skip, limit }
    ).populate("owner", "name email");

    console.log(req.user._id);

    res.send(contacts);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);

    if (!contact) {
      throw HttpError(404, "Not found");
    }

    if (contact.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.send(contact);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  const { id } = req.params;

  try {
    const result = await Contact.findByIdAndDelete(id);

    if (!result) {
      throw HttpError(404, "Not found");
    }

    if (result.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  console.log(req.user);
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    owner: req.user._id,
  };

  try {
    const result = await Contact.create(contact);
    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  const { id } = req.params;

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });

    if (!result) {
      throw HttpError(404, "Not found");
    }
    if (result.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res, next) {
  const { id } = req.params;

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };

  try {
    const result = await Contact.findByIdAndUpdate(id, contact, {
      new: true,
    });

    if (!result) {
      throw HttpError(404, "Not found");
    }
    if (result.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
}

export default {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
};
