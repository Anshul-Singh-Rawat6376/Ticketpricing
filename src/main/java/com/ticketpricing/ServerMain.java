package com.ticketpricing;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public final class ServerMain {
    private static final int DEFAULT_PORT = 8081;
    private static final PricingEngine PRICING_ENGINE = new PricingEngine();

    private ServerMain() {
    }

    public static void main(String[] args) throws IOException {
        int port = args.length == 0 ? DEFAULT_PORT : Integer.parseInt(args[0]);
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api/health", ServerMain::health);
        server.createContext("/api/calculate", ServerMain::calculate);
        server.setExecutor(Executors.newFixedThreadPool(4));
        server.start();
        System.out.println("Ticket pricing API running at http://localhost:" + port);
        System.out.println("Open ui/index.html in a browser to use the counter.");
    }

    private static void health(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            respond(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }
        respond(exchange, 200, "{\"status\":\"online\"}");
    }

    private static void calculate(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            respond(exchange, 405, "{\"error\":\"Method not allowed\"}");
            return;
        }

        try {
            Map<String, String> values = parseForm(exchange);
            List<Ticket> tickets = new ArrayList<>();
            addTickets(values, tickets, "silver", SeatTier.SILVER);
            addTickets(values, tickets, "gold", SeatTier.GOLD);
            addTickets(values, tickets, "recliner", SeatTier.RECLINER);

            boolean member = Boolean.parseBoolean(values.getOrDefault("member", "false"));
            Bill bill = PRICING_ENGINE.calculate(new Booking(tickets, member));
            respond(exchange, 200, billJson(bill));
        } catch (IllegalArgumentException | IllegalStateException error) {
            respond(exchange, 422, "{\"error\":\"" + escape(error.getMessage()) + "\"}");
        }
    }

    private static void addTickets(Map<String, String> values, List<Ticket> tickets,
                                   String key, SeatTier tier) {
        int quantity = integer(values.getOrDefault(key + "Quantity", "0"), key + " quantity");
        BigDecimal price = decimal(values.getOrDefault(key + "Price", "0"), key + " price");
        boolean available = Boolean.parseBoolean(values.getOrDefault(key + "Available", "false"));
        for (int index = 0; index < quantity; index++) {
            tickets.add(new Ticket(tier, price, available));
        }
    }

    private static Map<String, String> parseForm(HttpExchange exchange) throws IOException {
        String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        Map<String, String> values = new HashMap<>();
        for (String pair : body.split("&")) {
            if (pair.isBlank()) {
                continue;
            }
            String[] parts = pair.split("=", 2);
            String key = decode(parts[0]);
            String value = parts.length == 2 ? decode(parts[1]) : "";
            values.put(key, value);
        }
        return values;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static int integer(String value, String field) {
        try {
            int parsed = Integer.parseInt(value);
            if (parsed < 0) {
                throw new IllegalArgumentException(field + " must not be negative");
            }
            return parsed;
        } catch (NumberFormatException error) {
            throw new IllegalArgumentException(field + " must be a whole number");
        }
    }

    private static BigDecimal decimal(String value, String field) {
        try {
            BigDecimal parsed = new BigDecimal(value);
            if (parsed.signum() < 0) {
                throw new IllegalArgumentException(field + " must not be negative");
            }
            return parsed;
        } catch (NumberFormatException error) {
            throw new IllegalArgumentException(field + " must be a valid amount");
        }
    }

    private static String billJson(Bill bill) {
        return "{" +
                "\"baseAmount\":" + bill.getBaseAmount().toPlainString() + "," +
                "\"festivalDiscount\":" + bill.getFestivalDiscount().toPlainString() + "," +
                "\"memberDiscount\":" + bill.getMemberDiscount().toPlainString() + "," +
                "\"convenienceFee\":" + bill.getConvenienceFee().toPlainString() + "," +
                "\"gst\":" + bill.getGst().toPlainString() + "," +
                "\"finalAmount\":" + bill.getFinalAmount().toPlainString() +
                "}";
    }

    private static void respond(HttpExchange exchange, int status, String body) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }

    private static String escape(String value) {
        return value == null ? "Request could not be processed" : value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
