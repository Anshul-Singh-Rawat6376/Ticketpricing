package com.ticketpricing;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;

class PricingEngineTest {
    private final PricingEngine pricingEngine = new PricingEngine();

    @Test
    void calculatesMixedTierBooking() {
        Booking booking = new Booking(List.of(
            new Ticket(SeatTier.SILVER, new BigDecimal("100.00")),
            new Ticket(SeatTier.RECLINER, new BigDecimal("200.00"))), false);

        Bill bill = pricingEngine.calculate(booking);

        assertEquals("300.00", bill.getBaseAmount().toPlainString());
        assertEquals("30.00", bill.getFestivalDiscount().toPlainString());
        assertEquals("365.80", bill.getFinalAmount().toPlainString());
    }

    @Test
    void appliesMemberDiscountAndFeeAndTax() {
        Booking booking = new Booking(
                List.of(new Ticket(SeatTier.GOLD, new BigDecimal("100.00"))), true);

        Bill bill = pricingEngine.calculate(booking);

        assertEquals("4.50", bill.getMemberDiscount().toPlainString());
        assertEquals("20.00", bill.getConvenienceFee().toPlainString());
        assertEquals("18.99", bill.getGst().toPlainString());
        assertEquals("124.49", bill.getFinalAmount().toPlainString());

        
        }

        @Test
        void capsMemberDiscount() {
        Booking booking = new Booking(
            List.of(new Ticket(SeatTier.RECLINER, new BigDecimal("3000.00"))), true);

        Bill bill = pricingEngine.calculate(booking);

        assertEquals("100.00", bill.getMemberDiscount().toPlainString());
    }

    @Test
    void unavailableTicketCannotBePriced() {
        Booking booking = new Booking(
                List.of(new Ticket(SeatTier.GOLD, new BigDecimal("100.00"), false)), false);

        org.junit.jupiter.api.Assertions.assertThrows(
                IllegalStateException.class, () -> pricingEngine.calculate(booking));
    }
}
