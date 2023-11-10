const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function connect() {
  return open({
    filename: "./db/PetFood.sqlite3",
    driver: sqlite3.Database,
  });
}


async function getCustomers() {
  console.log("get customer");
  const db = await connect();
  const customers = await db.all(
    "SELECT customerID, firstName, lastName, email, phone, address FROM Customer ORDER BY CustomerID DESC LIMIT 20;"
  );
  console.log(customers[0]);
  await db.close();
  return customers;
}

async function createCustomer(customerData) {
  const db = await connect();
  const { firstName, lastName, email, phone, address } = customerData;
  await db.run(
    `INSERT INTO Customer (firstName, lastName, email, phone, address) VALUES (?, ?, ?, ?, ?)`,
    firstName,
    lastName,
    email,
    phone,
    address
  );
  await db.close();
}

async function readCustomer(customerId) {
  const db = await connect();
  try {
    const customer = await db.get(
      "SELECT * FROM Customer WHERE customerID = ?",
      customerId
    );
    return customer;
  } catch (error) {
    console.error(`Error in readCustomer function for ID ${customerId}:`, error);
    throw error;
  } finally {
    await db.close();
  }
}

async function updateCustomer(customerID, updateData) {
  const db = await connect();
  const { firstName, lastName, email, phone, address } = updateData;
  await db.run(
    `UPDATE Customer SET firstName = ?, lastName = ?, email = ?, phone = ?, address = ? WHERE customerID = customerID`,
    firstName,
    lastName,
    email,
    phone,
    address
  );
  await db.close();
}

async function deleteCustomer(customerID) {
  const db = await connect();
  await db.run(`DELETE FROM Customer WHERE customerID = ?`, customerID);
  await db.close();
}

/***** Pet *****/

async function getPet(petId) {
  console.log("Get pet", petId);
  const db = await connect();
  try {
    const stmt = await db.prepare(
      `SELECT * FROM Pet WHERE petID = :petID`
    );
    stmt.bind({
      ":petID": petId,
    });
    const pets = await stmt.all();

    await stmt.finalize();
    return pets;
  } finally {
    await db.close();
  }
}

// Read all pets for a customer
async function getPets(customerId) {
  const db = await connect();
  try {
    const pets = await db.all(
      "SELECT * FROM Pet WHERE customerID = ?",
      customerId
    );
    return pets;
  } finally {
    await db.close();
  }
}

// Create a new pet
async function createPet(petData) {
  const db = await connect();
  try {
    const { petName, age, species, breed, customerID } = petData;
    const result = await db.run(
      `INSERT INTO Pet (petName, age, species, breed, customerID) VALUES (?, ?, ?, ?, ?)`,
      petName,
      age,
      species,
      breed,
      customerID
    );
    return result.lastID; 
  } finally {
    await db.close();
  }
}

async function updatePet(petId, petData) {
  const db = await connect();
  try {
    const stmt = await db.prepare(`
      UPDATE pet
      SET
        petName = :petName,
        age = :age,
        species = :species,
        breed = :breed,
        customerID = :customerID
      WHERE
        petID = :petID
    `);

    stmt.bind({
      ":petID": petId,
      ":petName": petData.petName,
      ":age": petData.age,
      ":species": petData.species,
      ":breed": petData.breed,    
    });

    const result = await stmt.run();
    await stmt.finalize();
    return result;
  } finally {
    await db.close();
  }
}

async function deletePet(petID) {
  const db = await connect();
  try {
    const result = await db.run(
      `DELETE FROM Pet WHERE petID = ?`,
      petID
    );
    return result.changes; 
  } finally {
    await db.close();
  }
}
module.exports = {
  getCustomers,
  createCustomer,
  readCustomer,
  updateCustomer,
  deleteCustomer,
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
};
