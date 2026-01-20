import 'package:employee/core/error/failures.dart';
import 'package:employee/domain/entities/transaction.dart';
import 'package:dartz/dartz.dart';

abstract class TransactionRepository {
  Future<Either<Failure, Transaction>> createTransaction({
    required String customerId,
    required double amount,
    required String transactionType,
    Map<String, dynamic>? metadata,
  });
  Future<Either<Failure, List<Transaction>>> getPendingTransactions();
  Future<Either<Failure, void>> syncPendingTransactions();
}
