# Ticket Pricing Engine

## Overview

The Ticket Pricing Engine is a reusable Java-based pricing system designed for multiplex cinema ticket bookings.

The system calculates the final booking amount by processing ticket prices, seat availability, applicable discounts, convenience fees, and GST. It also provides a clear line-by-line breakdown of the bill so that the customer can understand how the final amount was calculated.

The engine is designed to work with different cinema counters and shows instead of being tied to a single movie or show.

---

## Features

* Supports multiple ticket tiers:

  * Silver
  * Gold
  * Recliner
* Handles different ticket prices for each tier.
* Checks whether a selected ticket tier is available before booking.
* Calculates the base ticket amount.
* Applies the festival discount according to the defined pricing rules.
* Applies the membership percentage discount with the specified cap.
* Adds the convenience fee per ticket.
* Calculates GST according to the defined tax rules.
* Uses exact monetary calculations to avoid floating-point errors.
* Generates a detailed bill showing every pricing component.
* Supports multiple tickets and different ticket tiers in a single booking.
* Designed as a reusable pricing engine rather than a show-specific solution.

---

## Technology Used

* **Programming Language:** Java
* **Build Tool:** Maven
* **Testing Framework:** JUnit
* **Money Representation:** `BigDecimal`

---

## Project Structure

```text
ticket-pricing/
│
├── README.md
├── REASONING.md
├── AI_LOGS.md
├── pom.xml
│
└── src/
    ├── main/
    │   └── java/
    │       └── com/
    │           └── ticketpricing/
    │               ├── Main.java
    │               ├── Booking.java
    │               ├── Bill.java
    │               ├── Discount.java
    │               ├── PricingEngine.java
    │               ├── SeatTier.java
    │               └── Ticket.java
    │
    └── test/
        └── java/
            └── com/
                └── ticketpricing/
                    └── PricingEngineTest.java
```

---

## Requirements

Before running the project, make sure the following are installed:

* Java 17 or compatible Java version
* Maven
* Git

Check Java:

```bash
java -version
```

Check Maven:

```bash
mvn -version
```

---

## How to Run

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Move into the project directory:

```bash
cd ticket-pricing
```

Compile and package the project:

```bash
mvn package
```

Run the application:

```bash
java -cp target/classes com.ticketpricing.Main
```

---

## How to Run Tests

Run all automated tests using:

```bash
mvn test
```

The tests verify important pricing scenarios such as:

* Different ticket tiers
* Multiple tickets
* Unavailable/sold-out tiers
* Festival discount
## Browser UI

Open `ui/index.html` directly in a browser for the interactive pricing counter. You can change ticket prices, quantities, availability, and membership status to see the bill update live.

To serve it locally instead:

```bash
python3 -m http.server 8080 --directory ui
```

Then visit `http://localhost:8080`.

## Backend API

Start the Java pricing backend in a second terminal:

```bash
mvn package
java -cp target/classes com.ticketpricing.ServerMain 8081
```

The UI automatically uses `POST /api/calculate` when the backend is available and shows a local preview when it is opened without the API. A `GET /api/health` endpoint is also available for a quick connectivity check. Pass another port as the first argument if needed.
* Membership discount
* Membership discount cap
* Convenience fee
* GST calculation
* Monetary rounding
* Final bill calculation

---

## Pricing Flow

The pricing engine processes a booking in the following order:

```text
Booking Input
     ↓
Validate Ticket Availability
     ↓
Calculate Base Ticket Amount
     ↓
Apply Festival Discount
     ↓
Apply Member Discount
     ↓
Add Convenience Fee
     ↓
Calculate GST
     ↓
Calculate Final Total
     ↓
Generate Detailed Bill
```

The implementation follows the pricing rules specified in the assignment.

---

## Money and Rounding

`BigDecimal` is used for monetary calculations instead of `double` or `float`.

This is important because floating-point arithmetic can introduce precision errors when handling currency values.

The application follows the required rounding and precision rules specified by the assignment so that the final amount is accurate to the exact paisa.

---

## Example Bill

A booking produces a detailed breakdown similar to:

```text
----------------------------------------
          TICKET BILL
----------------------------------------

Silver Tickets        ₹XXX.XX
Gold Tickets          ₹XXX.XX
Recliner Tickets      ₹XXX.XX
----------------------------------------
Base Amount            ₹XXX.XX

Festival Discount     -₹XX.XX
Member Discount       -₹XX.XX
----------------------------------------
Amount After Discount  ₹XXX.XX

Convenience Fee        ₹XX.XX
GST                    ₹XX.XX
----------------------------------------
Final Total            ₹XXX.XX
----------------------------------------
```

The actual values depend on the booking and pricing configuration.

---

## Debugging

If the project does not compile, first check the Java version:

```bash
java -version
```

Then check Maven:

```bash
mvn -version
```

To perform a clean build:

```bash
mvn clean package
```

To run the tests:

```bash
mvn test
```

If a test fails, check the pricing calculation order, discount rules, fee calculation, GST calculation, and rounding logic.

---

## Design Goals

The main goals of the project are:

1. Correctness of monetary calculations.
2. Clear separation of pricing responsibilities.
3. Reusability for different cinemas and shows.
4. Easy testing and debugging.
5. Transparent bill generation.
6. Maintainable and readable code.

---

## Repository

The final solution is maintained in a public GitHub repository as required by the assignment.

Repository:

```text
<YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
```
