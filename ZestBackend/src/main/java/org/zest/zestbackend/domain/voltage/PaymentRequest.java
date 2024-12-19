package org.zest.zestbackend.domain.voltage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private String payment_request; // BOLT11 invoice
}
