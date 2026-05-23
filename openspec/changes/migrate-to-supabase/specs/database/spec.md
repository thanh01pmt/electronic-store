## ADDED Requirements

### Requirement: Database Cart Sync
The system SHALL persist shopping cart items in the PostgreSQL `carts` and `cart_items` tables for authenticated users.

#### Scenario: Authenticated Cart Saved
- **WHEN** user adds an item with name "10k Resistor" and quantity 10 to their cart
- **THEN** insert or update the record in the database associated with the user's ID

### Requirement: Guest Cart Merge
The system SHALL merge guest cart items from the browser cookies into the user's authenticated cart upon signing in.

#### Scenario: Cart Merged Successfully
- **WHEN** user signs in with an existing guest cart containing "Gerber File A"
- **THEN** copy the guest cart items into the user's authenticated cart and delete the guest cart record

### Requirement: Relational Order Logging
The system SHALL record placed orders inside the relational `orders` database table.

#### Scenario: Order Created Successfully
- **WHEN** user completes checkout with a payment ID
- **THEN** insert the order record into the `orders` table and clear the user's cart
