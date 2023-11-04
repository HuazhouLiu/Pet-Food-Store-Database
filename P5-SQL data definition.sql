BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Pet" (
	"petID"	INTEGER NOT NULL,
	"petName"	TEXT,
	"age"	NUMERIC,
	"species"	TEXT,
	"breed"	TEXT,
	FOREIGN KEY("petID") REFERENCES "Customer"("customerID"),
	PRIMARY KEY("petID")
);
CREATE TABLE IF NOT EXISTS "Order" (
	"orderID"	INTEGER NOT NULL,
	"orderDate"	TEXT,
	"totalAmount"	NUMERIC,
	"status"	TEXT,
	FOREIGN KEY("orderID") REFERENCES "Customer"("customerID"),
	PRIMARY KEY("orderID")
);
CREATE TABLE IF NOT EXISTS "Customer" (
	"customerID"	INTEGER NOT NULL,
	"firstName"	TEXT,
	"lastName"	TEXT,
	"email"	TEXT,
	"phone"	TEXT,
	"address"	TEXT,
	PRIMARY KEY("customerID")
);
CREATE TABLE IF NOT EXISTS "OrderDetails" (
	"orderDetailID"	INTEGER NOT NULL,
	"quantity"	REAL,
	"unitPrice"	NUMERIC,
	FOREIGN KEY("orderDetailID") REFERENCES "Order"("orderID"),
	PRIMARY KEY("orderDetailID")
);
COMMIT;
