package org.zest.zestbackend.domain.voltage;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
    name = "lndClient",
    url = "${lnd.base-url}",
    configuration = FeignConfig.class
)
public interface LndFeignClient {

    @GetMapping("/v1/getinfo")
    String getNodeInfo();

    @PostMapping("/v1/invoices")
    String createInvoice(@RequestBody InvoiceRequest invoiceRequest);

    @PostMapping("/v1/channels/transactions")
    String payInvoice(@RequestBody PaymentRequest paymentRequest);
}
