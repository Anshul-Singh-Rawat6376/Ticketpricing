package com.ticketpricing;

import java.math.BigDecimal;

public enum Discount {
    NONE("0.00"),
    STUDENT("0.10"),
    MEMBER("0.15"),
    EARLY_BIRD("0.20");

    private final BigDecimal rate;

    Discount(String rate) {
        this.rate = new BigDecimal(rate);
    }

    public BigDecimal getRate() {
        return rate;
    }
}
