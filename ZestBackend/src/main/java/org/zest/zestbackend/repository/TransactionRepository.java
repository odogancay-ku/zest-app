package org.zest.zestbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zest.zestbackend.model.Currency;
import org.zest.zestbackend.model.TransactionEntity;

import java.time.Instant;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionEntity, String> {
    // Find transactions by sender
    List<TransactionEntity> findBySender(String sender);

    // Find transactions by recipient
    List<TransactionEntity> findByRecipient(String recipient);

    // Find transactions by sender and recipient
    List<TransactionEntity> findBySenderAndRecipient(String sender, String recipient);

    // Find transactions by currency
    List<TransactionEntity> findByCurrency(Currency currency);

    // Find transactions within a timestamp range
    List<TransactionEntity> findByTimestampBetween(Instant start, Instant end);
}
