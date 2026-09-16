package com.ticketpricing;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

public final class PricingEngine {

    private static final BigDecimal FESTIVAL_DISCOUNT_RATE = new BigDecimal("0.10");
    private static final BigDecimal MEMBER_DISCOUNT_RATE = new BigDecimal("0.05");
    private static final BigDecimal MEMBER_DISCOUNT_CAP = new BigDecimal("100.00");
    private static final BigDecimal CONVENIENCE_FEE_PER_TICKET = new BigDecimal("20.00");
    private static final BigDecimal GST_RATE = new BigDecimal("0.18");
    private static final int MONEY_SCALE = 2;

    public Bill calculate(Booking booking) {
        Objects.requireNonNull(booking, "booking must not be null");

        if (booking.getTickets().stream().anyMatch(ticket -> !ticket.isAvailable())) {
            throw new IllegalStateException("one or more selected ticket tiers are unavailable");
        }

        BigDecimal baseAmount = booking.getTickets().stream()
                .map(Ticket::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal festivalDiscount = percentage(baseAmount, FESTIVAL_DISCOUNT_RATE);
        BigDecimal afterFestival = baseAmount.subtract(festivalDiscount);
        BigDecimal memberDiscount = booking.isMember()
                ? percentage(afterFestival, MEMBER_DISCOUNT_RATE).min(MEMBER_DISCOUNT_CAP)
                : BigDecimal.ZERO;
        BigDecimal discountedAmount = afterFestival.subtract(memberDiscount);
        BigDecimal convenienceFee = CONVENIENCE_FEE_PER_TICKET
                .multiply(BigDecimal.valueOf(booking.getTickets().size()));
        BigDecimal gst = percentage(discountedAmount.add(convenienceFee), GST_RATE);
        BigDecimal finalAmount = discountedAmount.add(convenienceFee).add(gst);

        return new Bill(money(baseAmount), money(festivalDiscount), money(memberDiscount),
                money(convenienceFee), money(gst), money(finalAmount));
    }

    private static BigDecimal percentage(BigDecimal amount, BigDecimal rate) {
        return money(amount.multiply(rate));
    }

    private static BigDecimal money(BigDecimal amount) {
        return amount.setScale(MONEY_SCALE, RoundingMode.HALF_UP);
    }
}