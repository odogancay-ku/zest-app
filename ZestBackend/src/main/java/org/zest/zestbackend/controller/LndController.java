package org.zest.zestbackend.controller;

import org.springframework.web.bind.annotation.*;
import org.zest.zestbackend.domain.voltage.LndService;

@RestController
@RequestMapping("/api/lnd")
public class LndController {

    private final LndService lndService;

    public LndController(LndService lndService) {
        this.lndService = lndService;
    }

    @GetMapping("/nodeinfo")
    public String getNodeInfo() {
        return lndService.getNodeInfo();
    }

    @PostMapping("/invoice")
    public String createInvoice(@RequestParam long amount, @RequestParam(required = false) String memo) {
        return lndService.createInvoice(amount, memo != null ? memo : "No memo provided");
    }

    @PostMapping("/pay")
    public String payInvoice(@RequestParam String bolt11Invoice) {
        return lndService.payInvoice(bolt11Invoice);
    }
}
