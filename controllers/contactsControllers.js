import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contactModel.js";

async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find();
    res.send(contacts);
  } catch (error) {
    next(error);
  }
}

async function getOneContact(req, res, next) {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);

    if (contact === null) {
      return HttpError(404, "Not found");
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

    if (result === null) {
      return HttpError(404, "Not found");
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
}

async function createContact(req, res, next) {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
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

    if (result === null) {
      return HttpError(404, "Not found");
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

    if (result === null) {
      return HttpError(404, "Not found");
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
