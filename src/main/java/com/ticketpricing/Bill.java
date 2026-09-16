package com.ticketpricing;

import java.math.BigDecimal;

public class Bill {

    private final BigDecimal baseAmount;
    private final BigDecimal festivalDiscount;
    private final BigDecimal memberDiscount;
    private final BigDecimal convenienceFee;
    private final BigDecimal gst;
    private final BigDecimal finalAmount;

    public Bill(
            BigDecimal baseAmount,
            BigDecimal festivalDiscount,
            BigDecimal memberDiscount,
            BigDecimal convenienceFee,
            BigDecimal gst,
            BigDecimal finalAmount) {

        this.baseAmount = baseAmount;
        this.festivalDiscount = festivalDiscount;
        this.memberDiscount = memberDiscount;
        this.convenienceFee = convenienceFee;
        this.gst = gst;
        this.finalAmount = finalAmount;
    }

    public BigDecimal getBaseAmount() {
        return baseAmount;
    }

    public BigDecimal getFestivalDiscount() {
        return festivalDiscount;
    }

    public BigDecimal getMemberDiscount() {
        return memberDiscount;
    }

    public BigDecimal getConvenienceFee() {
        return convenienceFee;
    }

    public BigDecimal getGst() {
        return gst;
    }

    public BigDecimal getFinalAmount() {
        return finalAmount;
    }
}