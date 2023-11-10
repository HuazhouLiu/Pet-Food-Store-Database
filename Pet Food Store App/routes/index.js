var express = require("express");
var router = express.Router();
const {
  createCustomer,
  readCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getPet,
  createPet,
  updatePet,
  deletePet,
  getPets,
} = require("../db/dbConnector_Sqlite.js");

router.get("/", async function (req, res) {
  try {
    const customers = await getCustomers();
    res.render("index", {
      title: "Customer Dashboard",
      customers: customers,
      err: null,
      type: "success",
    });
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("index", {
      customer: [],
      err: `Error executing SQL ${exception}`,
      type: "danger",
    });
  }
});

router.get("/customer/create", function (req, res) {
  res.render("customer_create", {
  });
});

router.post("/customer/create", async function (req, res) {
  try {
    await createCustomer(req.body);
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/customer/:id", async function (req, res) {
  try {
    const customerId = req.params.id;
    console.log("Customer ID:", customerId);
    const customer = await readCustomer(req.params.id);
    console.log("Customer:", customer);
    const pet = await getPets(req.params.id);
    console.log("Pet:", pet);
    if (!customer) {
      res.render("customer_detail", {
        customer: null,
        err: "No customer found with ID " + req.params.id,
        type: "danger", 
      });
    } else {
      console.log(`GetDetail: Customer found with ID ${req.params.id}`);
      res.render("customer_detail", {
        customer: customer,
        pet: pet,
        err: null,
        type: null,
      });
    }
  } catch (error) {
    console.error(
      `Error when rendering detail page for customer ID ${req.params.id}:`,
      error
    );
    res.render("customer_detail", {
      customer: null,
      err: "Internal Server Error",
      type: "danger", 
    });
  }
});

router.get("/customer/:id/edit", async function (req, res) {
  try {
    const customer = await readCustomer(req.params.id);
    if (!customer) {
      console.log(`No customer found with ID ${req.params.id}`);
      return res.status(404).send("Customer not found");
    }
    console.log(`Customer found with ID ${req.params.id}`);
    res.render("customer_edit", {
      customer: customer,
      previous_id: req.params.id,
    });
  } catch (error) {
    console.error(
      `Error when rendering edit page for customer ID ${req.params.id}:`,
      error
    );
    res.status(500).send("Internal Server Error");
  }
});

router.post("/customer/:id/edit", async function (req, res) {
  try {
    await updateCustomer(req.params.id, req.body);
    res.redirect("/?success=Customer " + req.params.id + " has been updated");
  } catch (error) {
    console.error("Failed to update the customer:", error);
    res.status(500).send("Failed to update the customer");
  }
});

router.get("/customer/:id/delete", async function (req, res) {
  try {
    await deleteCustomer(req.params.id);
    res.redirect("/"); 
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/pet/create", async function (req, res) {
  console.log("Create pet route", req.body);

  const newPet = req.body;

  try {
    const sqlResCreate = await createPet(newPet);
    console.log("Pet result", sqlResCreate);

    res.redirect(`/pet/${newPet.petID}/?msg=Pet added`);
  } catch (exception) {
    console.log("Error executing sql", exception);
    res.render("pet_detail", {
      customer: null,
      pet: [],
      err: "Error adding pet " + exception,
      type: "danger",
    });
  }
});

router.post("/pet/:pet_id/edit", async function (req, res) {
  const petID = req.params.pet_id;
  const petData = req.body;

  try {
    const sqlResUpdate = await updatePet(petID, petData);
    console.log("Updating pet", sqlResUpdate);

    const editedPet = (await getPet(petID))[0];

    console.log("Edited Pet", editedPet);

    if (sqlResUpdate.changes === 1) {
      res.redirect(
        `/customer/${editedPet.customerID}/?msg=Pet modified`
      );
    } else {
      res.redirect(
        `/customer/${editedPet.customerID}/?msg=Error editing Pet`
      );
    }
  } catch (exception) {
    console.log("Error exceuting sql", exception);
    res.render("customer_details", {
      customer: null,
      pet: [],
      err: "Error deleting pet " + exception,
      type: "danger",
    });
  }
});

router.get("/pet/:pet_id/delete", async function (req, res) {
  console.log("Delete pet route", req.params.pet_id);

  const pet_id = req.params.pet_id;

  try {
    const sqlResFindPet = await getPet(pet_id);
    const oldPet = sqlResFindPet[0];
    const sqlResUpdate = await deletePet(pet_id);
    console.log("Deleting pet", sqlResUpdate);

    if (sqlResUpdate.changes === 1) {
      res.redirect(
        `/customer/${oldPet.customerID}/?msg=Pet deleted`
      );
    } else {
      res.redirect(
        `/customer/${oldPet.customerID}/?msg=Error deleting pet`
      );
    }
  } catch (exception) {
    console.log("Error executing sql", exception);
    res.render("customer_detail", {
      customer: null,
      pet: [],
      err: "Error deleting pet " + exception,
      type: "danger",
    });
  }
});

module.exports = router;
