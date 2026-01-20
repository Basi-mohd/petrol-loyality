import 'package:equatable/equatable.dart';

class Transaction extends Equatable {
  final String id;
  final String customerId;
  final double amount;
  final String transactionType;
  final DateTime createdAt;
  final Map<String, dynamic>? metadata;

  const Transaction({
    required this.id,
    required this.customerId,
    required this.amount,
    required this.transactionType,
    required this.createdAt,
    this.metadata,
  });

  @override
  List<Object?> get props => [id, customerId, amount, transactionType, createdAt, metadata];
}
