# AI logs

- Scaffolded the Maven project and ticket-pricing domain requested in the project layout.
- Added unit tests covering empty bookings, mixed seat tiers, and discounts.
# AI Conversation Log Summary

## Project

**Multiplex Ticket Pricing Engine**

## Project Objective

The project is a cinema ticket pricing engine designed to calculate the exact booking amount for different seat tiers while handling availability, discounts, convenience fees, GST, and a clear bill breakdown.

The system supports three seat tiers:

* Silver
* Gold
* Recliner

Each tier has its own ticket price and availability status.

## Pricing Rules Discussed

The frontend currently uses these pricing rules:

* Silver ticket: ₹100
* Gold ticket: ₹150
* Recliner ticket: ₹250
* Festival discount: 10%
* Member discount: 5%
* Maximum member discount: ₹100
* Convenience fee: ₹20 per ticket
* GST: 18%

The calculation flow implemented in the frontend is:

1. Calculate the base ticket amount.
2. Apply the festival discount.
3. Apply the member discount if membership is selected.
4. Add the convenience fee for every ticket.
5. Calculate GST on the discounted amount plus convenience fee.
6. Calculate the final payable amount.

The frontend uses JavaScript number handling for the preview, while the backend is expected to use `BigDecimal` so that monetary calculations can be handled accurately to the exact paisa.

## Frontend Structure

The frontend consists of three files:

```text
frontend/
├── index.html
├── styles.css
└── app.js
```

The HTML file contains the cinema booking interface.

The CSS file provides:

* Dark cinema-themed design
* Header/navigation
* Hero section
* Movie selector
* Movie poster card
* Seat tier cards
* Availability switches
* Quantity controls
* Membership switch
* Pricing rules section
* Bill/receipt section
* Offers section
* Footer
* Responsive layouts for tablet and mobile screens

The JavaScript file handles:

* Ticket quantity changes
* Seat availability
* Member selection
* Local bill calculation
* API communication
* Bill rendering
* Movie/show information
* Clear booking functionality
* API connection status

## Backend API

The frontend is configured to communicate with:

```text
http://localhost:8081/api/calculate
```

The frontend sends booking information using a POST request with:

```text
application/x-www-form-urlencoded
```

The expected backend response contains fields such as:

* `baseAmount`
* `festivalDiscount`
* `memberDiscount`
* `convenienceFee`
* `gst`
* `finalAmount`

If the backend is unavailable, the frontend falls back to a local calculation and displays:

```text
Local preview
```

When the backend is available, the interface displays:

```text
API connected
```

## Availability Handling

Each seat tier has an availability switch.

If a tier is unavailable and the user selects tickets from that tier, the interface marks the tier as sold out and displays:

```text
Unavailable tier selected
```

The final amount is displayed as:

```text
Unavailable
```

This prevents unavailable seats from being treated as a valid booking.

## Quantity Controls

Each seat tier has:

* Increase button
* Decrease button
* Quantity input

The quantity cannot become negative.

The bill automatically updates whenever the quantity, price, availability, or membership status changes.

## Bill Breakdown

The bill provides a line-by-line breakdown containing:

* Selected ticket types and quantities
* Base amount
* Festival discount
* Member discount
* Convenience fee
* GST
* Final total

This was implemented to satisfy the requirement that customers should receive a clear billing breakdown.

## JavaScript Implementation

The JavaScript was structured into separate functions:

* `money()` — handles monetary rounding for frontend calculations.
* `currency()` — formats values as Indian Rupee amounts.
* `collectBooking()` — collects ticket and booking information.
* `calculateLocally()` — calculates the bill when the backend is unavailable.
* `renderBill()` — updates the bill displayed on the page.
* `setApiStatus()` — displays backend connection status.
* `updateShowInformation()` — updates movie/date/time information.
* `update()` — performs the main calculation and API request.

The JavaScript also uses a request counter to prevent an older API response from overwriting a newer calculation.

## CSS Debugging

During development, an error occurred because Markdown code-fence symbols were accidentally considered part of the CSS/JavaScript files.

The important clarification was:

The following should NOT be pasted into the actual file:

````text
```css
````

and

```text
```

````

The actual `styles.css` file must begin directly with CSS code, for example:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
````

Similarly, `app.js` must begin directly with JavaScript code and must not contain Markdown code-fence symbols.

## HTML References

The HTML file should reference the CSS and JavaScript files using:

```html
<link rel="stylesheet" href="styles.css">
<script src="app.js" defer></script>
```

The JavaScript depends on specific HTML selectors/classes such as:

```text
.tier-row
.seat-icon
.tier-name strong
.availability-input
.price-input
.quantity-control
.qty-btn
.quantity-input
#member-toggle
#api-status
#movie-select
#date-select
#time-select
#selected-movie
#show-summary
#line-items
#base-amount
#festival-discount
#member-discount
#convenience-fee
#gst
#final-total
#bill-message
#ticket-count
#clear-button
```

These selectors must match between `index.html`, `styles.css`, and `app.js`.

## GitHub Submission Requirements

The project is intended to be submitted through a public GitHub repository.

The root of the repository should contain:

```text
README.md
REASONING.md
AI_LOGS.md
```

The README should explain:

* Project setup
* How to run the application
* How to debug common problems

`REASONING.md` should explain the design and implementation decisions.

`AI_LOGS.md` should document the AI-assisted development conversation and decisions.

## Development Approach

The recommended development approach was:

1. Build the basic ticket calculation.
2. Add different seat tiers.
3. Add seat availability.
4. Add festival discount.
5. Add member discount and cap.
6. Add convenience fee.
7. Add GST.
8. Add exact money handling.
9. Add API integration.
10. Add line-by-line bill breakdown.
11. Add frontend styling and responsive design.
12. Test different combinations and edge cases.
13. Document the project in README.md, REASONING.md, and AI_LOGS.md.

## Important Note

The assignment wording describes a **flat festival discount**, while the current frontend implementation uses a **10% festival discount**. This should be checked against the original assignment specification before final submission. If the actual requirement is a fixed rupee discount, both frontend and backend calculations should be changed accordingly.

## Current Status

The frontend structure and styling have been prepared, including:

* `index.html`
* `styles.css`
* `app.js`

The CSS was provided as a clean file without Markdown code-fence characters.

The next development step is to ensure the HTML, JavaScript, and backend API are correctly connected and then test the complete booking and pricing flow.
