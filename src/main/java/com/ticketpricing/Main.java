package com.ticketpricing;

import java.math.BigDecimal;
import java.util.List;

public class Main {

    public static void main(String[] args) {
    Booking booking = new Booking(List.of(
        new Ticket(SeatTier.GOLD, new BigDecimal("250.00")),
        new Ticket(SeatTier.SILVER, new BigDecimal("150.00"))), true);
    Bill bill = new PricingEngine().calculate(booking);

    System.out.println("Ticket Pricing Bill");
    System.out.println("Base amount:        " + bill.getBaseAmount());
    System.out.println("Festival discount: -" + bill.getFestivalDiscount());
    System.out.println("Member discount:   -" + bill.getMemberDiscount());
    System.out.println("Convenience fee:    " + bill.getConvenienceFee());
    System.out.println("GST:                " + bill.getGst());
    System.out.println("Final total:        " + bill.getFinalAmount());

    }
}