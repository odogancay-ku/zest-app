package org.zest.zestbackend.domain.voltage;

public class InvoiceRequest {
    private long value;
    private String memo;

    public InvoiceRequest(long value, String memo) {
        this.value = value;
        this.memo = memo;
    }

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }
}
