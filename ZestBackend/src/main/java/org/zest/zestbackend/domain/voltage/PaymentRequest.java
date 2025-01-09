package org.zest.zestbackend.domain.voltage;

public class PaymentRequest {
    private String paymentRequest;


    public PaymentRequest(String paymentRequest) {
        this.paymentRequest = paymentRequest;
    }

    public String getPaymentRequest() {
        return paymentRequest;
    }

    public void setPaymentRequest(String paymentRequest) {
        this.paymentRequest = paymentRequest;
    }
}