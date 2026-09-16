package com.ticketpricing;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Objects;

public final class Booking {

    private final List<Ticket> tickets;
    private final boolean member;

    public Booking(List<Ticket> tickets, boolean member) {
        Objects.requireNonNull(tickets, "tickets must not be null");
        if (tickets.stream().anyMatch(Objects::isNull)) {
            throw new IllegalArgumentException("tickets must not contain null values");
        }
        this.tickets = Collections.unmodifiableList(new ArrayList<>(tickets));
        this.member = member;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public boolean isMember() {
        return member;
    }
}