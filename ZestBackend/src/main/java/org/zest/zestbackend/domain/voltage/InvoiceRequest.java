package org.zest.zestbackend.domain.voltage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceRequest {
    private long value; // Amount in satoshis
    private String memo; // Optional memo
}
