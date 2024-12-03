package org.zest.zestbackend.domain.voltage;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;

import java.nio.file.Files;
import java.nio.file.Path;

public class FeignConfig {

    @Bean
    public RequestInterceptor macaroonInterceptor() throws Exception {
        // Read the macaroon file as binary data
        byte[] macaroonBytes = Files.readAllBytes(Path.of(System.getProperty("user.home"), "voltage-node", "admin.macaroon"));
        // Convert to hexadecimal string
        String macaroon = bytesToHex(macaroonBytes);
        return requestTemplate -> {
            requestTemplate.header("Grpc-Metadata-macaroon", macaroon);
            requestTemplate.header("Content-Type", "application/json");
        };
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xFF & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
