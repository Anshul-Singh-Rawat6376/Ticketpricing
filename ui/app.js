// ========================================
// MULTIPLEX TICKET PRICING ENGINE
// ========================================


// ========================================
// PRICING RULES
// ========================================

const RULES = {
    festivalRate: 0.10,
    memberRate: 0.05,
    memberCap: 100,
    convenienceFee: 20,
    gstRate: 0.18
};


// ========================================
// GET HTML ELEMENTS
// ========================================

const rows = document.querySelectorAll(".tier-row");

const memberToggle =
    document.getElementById("member-toggle");


// ========================================
// MONEY FUNCTIONS
// ========================================

function roundMoney(value) {

    return Math.round(
        (Number(value) + Number.EPSILON) * 100
    ) / 100;

}


function currency(value) {

    return "₹" + roundMoney(value).toFixed(2);

}


// ========================================
// CALCULATE BILL
// ========================================

function calculateBill() {

    let baseAmount = 0;

    let ticketCount = 0;

    let unavailableSelected = false;

    let lineItems = [];


    // ------------------------------------
    // READ EACH SEAT TYPE
    // ------------------------------------

    rows.forEach(function(row) {

        const tier =
            row.dataset.tier;


        const priceInput =
            row.querySelector(".price-input");


        const quantityInput =
            row.querySelector(".quantity-input");


        const availabilityInput =
            row.querySelector(".availability-input");


        const tierNameElement =
            row.querySelector(".tier-name strong");


        // --------------------------------
        // GET VALUES
        // --------------------------------

        const price =
            Number(priceInput.value) || 0;


        const quantity =
            Math.max(
                0,
                parseInt(quantityInput.value) || 0
            );


        const available =
            availabilityInput.checked;


        const tierName =
            tierNameElement
                ? tierNameElement.textContent
                : tier;


        // --------------------------------
        // UPDATE SOLD OUT CLASS
        // --------------------------------

        row.classList.toggle(
            "sold-out",
            !available
        );


        // --------------------------------
        // TICKET COUNT
        // --------------------------------

        ticketCount += quantity;


        // --------------------------------
        // UNAVAILABLE CHECK
        // --------------------------------

        if (
            quantity > 0 &&
            !available
        ) {

            unavailableSelected = true;

        }


        // --------------------------------
        // CALCULATE TIER PRICE
        // --------------------------------

        if (quantity > 0) {

            const amount =
                roundMoney(
                    price * quantity
                );


            baseAmount += amount;


            lineItems.push({

                tier: tierName,

                quantity: quantity,

                amount: amount

            });

        }

    });


    baseAmount =
        roundMoney(baseAmount);


    // ====================================
    // FESTIVAL DISCOUNT
    // ====================================

    const festivalDiscount =
        roundMoney(
            baseAmount *
            RULES.festivalRate
        );


    const afterFestival =
        roundMoney(
            baseAmount -
            festivalDiscount
        );


    // ====================================
    // MEMBER DISCOUNT
    // ====================================

    let memberDiscount = 0;


    if (
        memberToggle &&
        memberToggle.checked
    ) {

        memberDiscount =
            roundMoney(
                afterFestival *
                RULES.memberRate
            );


        memberDiscount =
            Math.min(
                memberDiscount,
                RULES.memberCap
            );

    }


    // ====================================
    // CONVENIENCE FEE
    // ====================================

    const convenienceFee =
        roundMoney(
            ticketCount *
            RULES.convenienceFee
        );


    // ====================================
    // TAXABLE AMOUNT
    // ====================================

    const taxableAmount =
        roundMoney(
            afterFestival -
            memberDiscount +
            convenienceFee
        );


    // ====================================
    // GST
    // ====================================

    const gst =
        roundMoney(
            taxableAmount *
            RULES.gstRate
        );


    // ====================================
    // FINAL TOTAL
    // ====================================

    const finalTotal =
        roundMoney(
            taxableAmount +
            gst
        );


    return {

        ticketCount,

        baseAmount,

        festivalDiscount,

        memberDiscount,

        convenienceFee,

        gst,

        finalTotal,

        lineItems,

        unavailableSelected

    };

}


// ========================================
// UPDATE BILL ON SCREEN
// ========================================

function updateBill() {

    const bill =
        calculateBill();


    // ====================================
    // TICKET COUNT
    // ====================================

    const ticketCountElement =
        document.getElementById(
            "ticket-count"
        );


    if (ticketCountElement) {

        ticketCountElement.textContent =
            bill.ticketCount +
            (
                bill.ticketCount === 1
                    ? " ticket"
                    : " tickets"
            );

    }


    // ====================================
    // LINE ITEMS
    // ====================================

    const lineItemsElement =
        document.getElementById(
            "line-items"
        );


    if (lineItemsElement) {

        if (bill.lineItems.length === 0) {

            lineItemsElement.innerHTML = `
                <div class="line-item">
                    <span>No tickets selected</span>
                    <span>₹0.00</span>
                </div>
            `;

        } else {

            lineItemsElement.innerHTML =
                bill.lineItems.map(
                    function(item) {

                        return `
                            <div class="line-item">
                                <span>
                                    ${item.tier} × ${item.quantity}
                                </span>

                                <span>
                                    ${currency(item.amount)}
                                </span>
                            </div>
                        `;

                    }
                ).join("");

        }

    }


    // ====================================
    // BASE AMOUNT
    // ====================================

    const baseElement =
        document.getElementById(
            "base-amount"
        );


    if (baseElement) {

        baseElement.textContent =
            currency(
                bill.baseAmount
            );

    }


    // ====================================
    // FESTIVAL DISCOUNT
    // ====================================

    const festivalElement =
        document.getElementById(
            "festival-discount"
        );


    if (festivalElement) {

        festivalElement.textContent =
            "-" +
            currency(
                bill.festivalDiscount
            );

    }


    // ====================================
    // MEMBER DISCOUNT
    // ====================================

    const memberElement =
        document.getElementById(
            "member-discount"
        );


    if (memberElement) {

        memberElement.textContent =
            "-" +
            currency(
                bill.memberDiscount
            );

    }


    // ====================================
    // CONVENIENCE FEE
    // ====================================

    const feeElement =
        document.getElementById(
            "convenience-fee"
        );


    if (feeElement) {

        feeElement.textContent =
            currency(
                bill.convenienceFee
            );

    }


    // ====================================
    // GST
    // ====================================

    const gstElement =
        document.getElementById(
            "gst"
        );


    if (gstElement) {

        gstElement.textContent =
            currency(
                bill.gst
            );

    }


    // ====================================
    // FINAL TOTAL
    // ====================================

    const finalElement =
        document.getElementById(
            "final-total"
        );


    if (finalElement) {

        if (bill.unavailableSelected) {

            finalElement.textContent =
                "Unavailable";

        } else {

            finalElement.textContent =
                currency(
                    bill.finalTotal
                );

        }

    }


    // ====================================
    // MESSAGE
    // ====================================

    const messageElement =
        document.getElementById(
            "bill-message"
        );


    if (messageElement) {

        if (bill.unavailableSelected) {

            messageElement.textContent =
                "⚠ Unavailable tier selected";

        } else if (bill.ticketCount > 0) {

            messageElement.textContent =
                "✓ Booking ready for review";

        } else {

            messageElement.textContent =
                "Select tickets to begin";

        }

    }


    // ====================================
    // UPDATE STATUS TEXT
    // ====================================

    rows.forEach(function(row) {

        const availabilityInput =
            row.querySelector(
                ".availability-input"
            );


        const statusElement =
            row.querySelector(
                ".seat-capacity strong"
            );


        if (
            statusElement &&
            availabilityInput
        ) {

            if (availabilityInput.checked) {

                statusElement.textContent =
                    "AVAILABLE";

            } else {

                statusElement.textContent =
                    "SOLD OUT";

            }

        }

    });

}


// ========================================
// PLUS / MINUS BUTTONS
// ========================================

const quantityButtons =
    document.querySelectorAll(
        ".qty-btn"
    );


quantityButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                // Find the quantity box
                // belonging to this button

                const control =
                    button.closest(
                        ".quantity-control"
                    );


                if (!control) {

                    console.log(
                        "Quantity control not found"
                    );

                    return;

                }


                const input =
                    control.querySelector(
                        ".quantity-input"
                    );


                if (!input) {

                    console.log(
                        "Quantity input not found"
                    );

                    return;

                }


                let quantity =
                    parseInt(
                        input.value
                    ) || 0;


                // =================================
                // INCREASE
                // =================================

                if (
                    button.dataset.action ===
                    "increase"
                ) {

                    quantity++;

                }


                // =================================
                // DECREASE
                // =================================

                if (
                    button.dataset.action ===
                    "decrease"
                ) {

                    quantity =
                        Math.max(
                            0,
                            quantity - 1
                        );

                }


                // Put new value in input

                input.value =
                    quantity;


                // Recalculate bill

                updateBill();

            }
        );

    }
);


// ========================================
// MANUAL QUANTITY INPUT
// ========================================

document
    .querySelectorAll(
        ".quantity-input"
    )
    .forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    let value =
                        parseInt(
                            input.value
                        ) || 0;


                    if (value < 0) {

                        value = 0;

                    }


                    input.value =
                        value;


                    updateBill();

                }
            );


            input.addEventListener(
                "change",
                function() {

                    let value =
                        parseInt(
                            input.value
                        ) || 0;


                    if (value < 0) {

                        value = 0;

                    }


                    input.value =
                        value;


                    updateBill();

                }
            );

        }
    );


// ========================================
// PRICE INPUT
// ========================================

document
    .querySelectorAll(
        ".price-input"
    )
    .forEach(
        function(input) {

            input.addEventListener(
                "input",
                function() {

                    updateBill();

                }
            );

        }
    );


// ========================================
// AVAILABILITY INPUT
// ========================================

document
    .querySelectorAll(
        ".availability-input"
    )
    .forEach(
        function(input) {

            input.addEventListener(
                "change",
                function() {

                    updateBill();

                }
            );

        }
    );


// ========================================
// MEMBER SWITCH
// ========================================

if (memberToggle) {

    memberToggle.addEventListener(
        "change",
        function() {

            updateBill();

        }
    );

}


// ========================================
// CLEAR BUTTON
// ========================================

const clearButton =
    document.getElementById(
        "clear-button"
    );


if (clearButton) {

    clearButton.addEventListener(
        "click",
        function() {


            // Reset all quantities

            document
                .querySelectorAll(
                    ".quantity-input"
                )
                .forEach(
                    function(input) {

                        input.value = 0;

                    }
                );


            // Turn membership off

            if (memberToggle) {

                memberToggle.checked =
                    false;

            }


            // Recalculate

            updateBill();

        }
    );

}


// ========================================
// MOVIE INFORMATION
// ========================================

function updateShowInformation() {

    const movieSelect =
        document.getElementById(
            "movie-select"
        );


    const dateSelect =
        document.getElementById(
            "date-select"
        );


    const timeSelect =
        document.getElementById(
            "time-select"
        );


    const selectedMovie =
        document.getElementById(
            "selected-movie"
        );


    const showSummary =
        document.getElementById(
            "show-summary"
        );


    const movie =
        movieSelect
            ? movieSelect.value
            : "Movie";


    const date =
        dateSelect
            ? dateSelect.value
            : "Today";


    const time =
        timeSelect
            ? timeSelect.value
            : "10:30 AM";


    if (selectedMovie) {

        selectedMovie.textContent =
            movie;

    }


    if (showSummary) {

        showSummary.textContent =
            movie +
            " • " +
            date +
            " • " +
            time;

    }

}


// ========================================
// MOVIE SELECT EVENTS
// ========================================

document
    .querySelectorAll(
        "#movie-select, #date-select, #time-select"
    )
    .forEach(
        function(select) {

            select.addEventListener(
                "change",
                updateShowInformation
            );

        }
    );


// ========================================
// INITIAL LOAD
// ========================================

updateShowInformation();

updateBill();