package org.zest.zestbackend.domain.voltage;

import org.springframework.stereotype.Service;

@Service
public class LndService {

    private final LndFeignClient lndFeignClient;

    public LndService(LndFeignClient lndFeignClient) {
        this.lndFeignClient = lndFeignClient;
    }

    public String getNodeInfo() {
        return lndFeignClient.getNodeInfo();
    }

    public String createInvoice(long amount, String memo) {
        InvoiceRequest request = new InvoiceRequest(amount, memo);
        return lndFeignClient.createInvoice(request);
    }

    public String payInvoice(String bolt11Invoice) {
        PaymentRequest request = new PaymentRequest(bolt11Invoice);
        return lndFeignClient.payInvoice(request);
    }
}
