package com.ticketpricing;

import java.math.BigDecimal;
import java.util.Objects;

public final class Ticket {

    private final SeatTier tier;
    private final BigDecimal price;
    private final boolean available;

    public Ticket(SeatTier tier, BigDecimal price) {
        this(tier, price, true);
    }

    public Ticket(SeatTier tier, BigDecimal price, boolean available) {
        this.tier = Objects.requireNonNull(tier, "tier must not be null");
        this.price = Objects.requireNonNull(price, "price must not be null");
        if (price.signum() < 0) {
            throw new IllegalArgumentException("price must not be negative");
        }
        this.available = available;
    }

    public SeatTier getTier() {
        return tier;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public boolean isAvailable() {
        return available;
    }
}