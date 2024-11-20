package org.zest.zestbackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.time.Instant;

@Entity
public class TransactionEntity {
    @Id
    String hash;
    Instant timestamp;
    String sender;
    String recipient;
    double amount;
    Currency currency;

}
