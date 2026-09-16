# Reasoning

## 1. Understanding the Problem

The problem requires a reliable pricing engine for multiplex ticket bookings.

A booking can contain tickets from different seat tiers such as Silver, Gold, and Recliner. Each tier can have its own price and availability.

After calculating the ticket price, the system needs to process discounts, convenience fees, and GST according to the specified business rules.

The final requirement is not only to calculate the total but also to provide a transparent line-by-line bill.

---

## 2. Main Approach

The pricing calculation is divided into independent steps rather than calculating everything in a single expression.

The overall flow is:

```text
Validate Booking
       ↓
Validate Availability
       ↓
Calculate Base Amount
       ↓
Festival Discount
       ↓
Member Discount
       ↓
Convenience Fee
       ↓
GST
       ↓
Final Total
       ↓
Detailed Bill
```

This makes the calculation easier to understand, test, and maintain.

---

## 3. Ticket Tier Design

The three ticket tiers are represented using an enum:

```text
SILVER
GOLD
RECLINER
```

Using an enum prevents invalid tier names from being passed into the pricing engine.

The actual price is kept separately so that the engine is not permanently tied to one cinema or one show.

This allows different shows or cinemas to provide different pricing configurations.

---

## 4. Availability Handling

Before calculating the final price, the system checks whether the requested ticket tier is available.

A sold-out tier must not be bookable.

This validation is performed before the booking is finalized so that an unavailable ticket cannot accidentally contribute to the bill.

This also keeps pricing and availability logically separate.

---

## 5. Base Amount Calculation

The first monetary calculation is the normal ticket amount.

For each ticket:

```text
Ticket Price × Quantity
```

The amounts for all selected ticket tiers are then added together.

For example:

```text
Silver subtotal
+ Gold subtotal
+ Recliner subtotal
-------------------
Base Amount
```

This base amount is calculated before applying discounts.

---

## 6. Festival Discount

The festival discount is applied according to the rules defined in the assignment.

The discount is calculated as a separate amount instead of modifying the ticket prices directly.

This makes the bill easier to understand:

```text
Base Amount
- Festival Discount
= Amount After Festival Discount
```

Keeping the discount separate also makes it easier to test independently.

---

## 7. Membership Discount

If the customer is a member, the membership percentage discount is applied according to the assignment rules.

The membership discount is subject to the specified maximum cap.

Therefore, the actual discount is conceptually:

```text
Calculated Member Discount
          ↓
Compare with Discount Cap
          ↓
Use permitted discount
```

This prevents the membership discount from exceeding the allowed maximum.

---

## 8. Convenience Fee

The convenience fee is applied per ticket.

Therefore, the calculation is based on the total number of tickets rather than the number of ticket categories.

For example:

```text
Number of Tickets × Convenience Fee Per Ticket
```

This amount is then added to the discounted ticket amount.

---

## 9. GST Calculation

GST is calculated according to the tax rules provided in the assignment.

The taxable amount is determined from the pricing rules rather than assuming that GST should automatically be applied to every component.

GST is maintained as a separate value in the bill so that the customer can clearly see the tax amount.

---

## 10. Order of Calculations

The order of operations is important because changing the order can produce a different final amount.

The implementation therefore follows the specified sequence:

```text
Base Ticket Amount
        ↓
Festival Discount
        ↓
Member Discount
        ↓
Convenience Fee
        ↓
GST
        ↓
Final Total
```

The calculation is deliberately separated into these stages rather than using one large formula.

---

## 11. Why BigDecimal?

Money should not be represented using `double` or `float`.

Floating-point numbers can introduce precision problems.

For example, values that appear simple in decimal currency can internally be represented with small binary precision differences.

Since the assignment requires the total to be accurate to the exact paisa, `BigDecimal` is used for all monetary calculations.

This provides better control over:

* Precision
* Rounding
* Decimal arithmetic
* Final currency values

---

## 12. Rounding Strategy

Rounding is performed explicitly according to the assignment's monetary rules.

The system does not depend on Java's default floating-point behavior.

Each monetary calculation is represented using `BigDecimal`, and the appropriate scale and rounding mode are applied where required.

This ensures that intermediate and final values remain predictable.

---

## 13. Separation of Responsibilities

The project is divided into multiple classes instead of placing all logic inside `Main`.

For example:

### `SeatTier`

Represents the available ticket categories.

### `Ticket`

Represents a ticket and its price.

### `Booking`

Represents the customer's booking information.

### `PricingEngine`

Contains the main pricing calculation.

### `Bill`

Stores the individual pricing components and final amount.

### `Discount`

Represents discount-related rules.

### `Main`

Provides the application entry point.

This separation makes the application easier to maintain and extend.

---

## 14. Reusability

The engine is designed for different cinemas and shows.

Prices and availability should be treated as data/configuration rather than hard-coded assumptions for one particular movie.

For example, one cinema may have:

```text
Silver    ₹200
Gold      ₹300
Recliner  ₹500
```

while another show may have different prices.

The pricing engine can still use the same calculation logic.

---

## 15. Error Handling

Invalid bookings should be rejected before calculating the final bill.

Examples include:

* Invalid ticket quantity
* Negative values
* Unavailable ticket tier
* Invalid pricing configuration
* Invalid discount configuration

Rejecting invalid input early prevents incorrect bills.

---

## 16. Testing Strategy

The pricing engine should be tested using multiple independent scenarios.

Important test cases include:

1. Single Silver ticket.
2. Multiple Silver tickets.
3. Gold tickets.
4. Recliner tickets.
5. Mixed ticket tiers.
6. Sold-out tier.
7. Festival discount.
8. Member discount.
9. Member discount reaching its cap.
10. Convenience fee calculation.
11. GST calculation.
12. Rounding cases.
13. Multiple discounts together.
14. Final bill calculation.

The purpose of these tests is to verify both normal cases and boundary cases.

---

## 17. Detailed Bill

The engine does not return only one final number.

Instead, it keeps each component separately:

```text
Base Amount
Festival Discount
Member Discount
Convenience Fee
GST
Final Total
```

This allows the application to display a transparent bill and makes debugging easier.

If the final amount is incorrect, each intermediate component can be checked independently.

---

## 18. Design Principle

The main design principle is:

> Calculate each business rule independently, in the required order, and keep every monetary component visible.

This reduces the chance of hidden calculation errors and makes the pricing engine easier to verify.

---

## 19. Conclusion

The solution focuses on correctness, precision, maintainability, and reusability.

Using Java with `BigDecimal`, separate domain classes, explicit calculation stages, validation, and automated tests provides a structured approach to building a trustworthy multiplex ticket pricing engine.
