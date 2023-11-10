--Join of Three Tables:
--Query to retrieve the customer's first name, pet name, and order date for each customer who has made an order with their pet's details.
SELECT c.firstName, p.petName, o.orderDate
FROM Customer c
JOIN Pet p ON c.customerID = p.customerID
JOIN "Order" o ON c.customerID = o.customerID;

--Subquery:
-- Query to find all customers who have made orders with a total amount greater than the average total amount of all orders.
SELECT c.firstName, c.lastName, COUNT(o.orderID) AS orderCount, AVG(o.totalAmount) AS avgTotalAmount
FROM Customer c
JOIN "Order" o ON c.customerID = o.customerID
GROUP BY c.customerID, c.firstName, c.lastName;

--Group By with Having Clause:
--Query to find customers who have placed more than 3 orders and their average order total is greater than 100.
SELECT c.firstName, c.lastName, COUNT(o.orderID) AS orderCount, AVG(o.totalAmount) AS avgTotalAmount
FROM Customer c
JOIN "Order" o ON c.customerID = o.customerID
GROUP BY c.customerID, c.firstName, c.lastName
HAVING COUNT(o.orderID) > 3 AND AVG(o.totalAmount) > 100;


--Complex Search Criterion:
--Query to retrieve orders placed by customers named "John" or "Jane" and the order status is True
SELECT o.orderID, c.firstName, c.lastName, o.status
FROM Customer c
JOIN "Order" o ON c.customerID = o.customerID
WHERE (c.firstName = 'John' OR c.firstName = 'Jane') AND (o.status = 'TRUE' );

--SELECT CASE/WHEN:
--Query to categorize customers based on the number of pets they have. Group them as "Single Pet Owner," "Multiple Pet Owner," or "No Pets."
SELECT c.firstName, c.lastName,
       CASE
           WHEN (SELECT COUNT(*) FROM Pet p WHERE p.customerID = c.customerID) = 1 THEN 'Single Pet Owner'
           WHEN (SELECT COUNT(*) FROM Pet p WHERE p.customerID = c.customerID) > 1 THEN 'Multiple Pet Owner'
           ELSE 'No Pets'
       END AS petOwnerCategory
FROM Customer c;