BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Customer" (
	"customerID"	INTEGER NOT NULL,
	"firstName"	TEXT,
	"lastName"	TEXT,
	"email"	TEXT,
	"phone"	TEXT,
	"address"	TEXT,
	PRIMARY KEY("customerID")
);
CREATE TABLE IF NOT EXISTS "Pet" (
	"petID"	INTEGER NOT NULL,
	"petName"	TEXT,
	"age"	NUMERIC,
	"species"	TEXT,
	"breed"	TEXT,
	"customerID"	INTEGER NOT NULL,
	PRIMARY KEY("petID"),
	FOREIGN KEY("customerID") REFERENCES "Customer"("customerID")
);
CREATE TABLE IF NOT EXISTS "OrderDetails" (
	"orderDetailID"	INTEGER NOT NULL,
	"quantity"	REAL,
	"unitPrice"	NUMERIC,
	"orderID"	INTEGER NOT NULL,
	PRIMARY KEY("orderDetailID"),
	FOREIGN KEY("orderID") REFERENCES "Order"("orderID")
);
CREATE TABLE IF NOT EXISTS "Order" (
	"orderID"	INTEGER NOT NULL,
	"orderDate"	TEXT,
	"totalAmount"	NUMERIC,
	"status"	TEXT,
	"customerID"	INTEGER NOT NULL,
	PRIMARY KEY("orderID"),
	FOREIGN KEY("customerID") REFERENCES "Customer"("customerID")
);
COMMIT;
