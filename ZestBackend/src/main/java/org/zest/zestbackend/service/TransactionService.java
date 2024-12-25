package org.zest.zestbackend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;


@Service
public class TransactionService {
    private static final String API_URL = "https://blockstream.info/testnet/api/address/{address}/txs";

    @GetMapping("/wallet/gain")
    public ResponseEntity<String> getTransactionHistory(@RequestParam String walletAddress) {
        System.out.println("hello");
        RestTemplate restTemplate = new RestTemplate();
        String url = API_URL.replace("{address}", walletAddress);

        try {
            // Fetch transactions
            JsonNode transactions = restTemplate.getForObject(url, JsonNode.class);

            if (transactions == null || !transactions.isArray()) {
                return ResponseEntity.badRequest().body("Invalid response from the API");
            }

            long totalGain = 0;

            for (JsonNode transaction : transactions) {
                if (transaction.has("vout")) {
                    for (JsonNode vout : transaction.get("vout")) {
                        String scriptpubkeyAddress = vout.get("scriptpubkey_address").asText();
                        if (scriptpubkeyAddress.equals(walletAddress)) {
                            long value = vout.get("value").asLong();
                            totalGain += value;
                        }
                    }
                }
            }

            return ResponseEntity.ok("Total gain for wallet: " + totalGain + " satoshis");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
}
