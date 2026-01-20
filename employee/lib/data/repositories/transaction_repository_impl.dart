import 'dart:convert';
import 'package:dartz/dartz.dart';
import 'package:employee/core/error/failures.dart';
import 'package:employee/core/services/crypto/crypto_service.dart';
import 'package:employee/core/services/device/device_service.dart';
import 'package:employee/core/services/geo/geo_fence_service.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/data/datasources/local/local_datasource.dart';
import 'package:employee/data/datasources/remote/remote_datasource.dart';
import 'package:employee/domain/entities/transaction.dart';
import 'package:employee/domain/repositories/transaction_repository.dart';
import 'package:geolocator/geolocator.dart';
import 'package:uuid/uuid.dart';

class TransactionRepositoryImpl implements TransactionRepository {
  final RemoteDataSource _remoteDataSource;
  final LocalDataSource _localDataSource;
  final CryptoService _cryptoService;
  final GeoFenceService _geoFenceService;
  final DeviceService _deviceService;
  final SecureStorageService _secureStorage;
  final Uuid _uuid = const Uuid();

  TransactionRepositoryImpl({
    required RemoteDataSource remoteDataSource,
    required LocalDataSource localDataSource,
    required CryptoService cryptoService,
    required GeoFenceService geoFenceService,
    required DeviceService deviceService,
    required SecureStorageService secureStorage,
  })  : _remoteDataSource = remoteDataSource,
        _localDataSource = localDataSource,
        _cryptoService = cryptoService,
        _geoFenceService = geoFenceService,
        _deviceService = deviceService,
        _secureStorage = secureStorage;

  @override
  Future<Either<Failure, Transaction>> createTransaction({
    required String customerId,
    required double amount,
    required String transactionType,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final transactionId = _uuid.v4();
      
      final transactionTypeUpper = transactionType.toUpperCase();
      if (transactionTypeUpper != 'CREDIT' && transactionTypeUpper != 'DEBIT' && transactionTypeUpper != 'REFUND') {
        return Left(ValidationFailure(message: 'Invalid transaction type: $transactionType'));
      }

      final transactionData = {
        'customerId': customerId,
        'amount': amount,
        'type': transactionTypeUpper,
        'metadata': metadata ?? {},
      };

      final signedPayload = await _cryptoService.createSignedTransactionPayload(transactionData);
      
      final requestPayload = {
        'customerId': customerId,
        'amount': amount,
        'type': transactionTypeUpper,
        'signature': signedPayload['signature'] as String,
        'publicKey': await _secureStorage.getPrivateKey() ?? 'default_public_key',
        if (metadata != null) 'metadata': metadata,
      };

      final response = await _remoteDataSource.syncTransaction(requestPayload);
      
      final transaction = Transaction(
        id: transactionId,
        customerId: customerId,
        amount: amount,
        transactionType: transactionType,
        createdAt: DateTime.now(),
        metadata: metadata,
      );

      return Right(transaction);
    } on Failure catch (e) {
      return Left(e);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, List<Transaction>>> getPendingTransactions() async {
    try {
      final transactions = await _localDataSource.getPendingTransactions();
      final result = transactions.map((t) {
        final payload = jsonDecode(t['payload'] as String) as Map<String, dynamic>;
        return Transaction(
          id: t['id'] as String,
          customerId: t['customer_id'] as String,
          amount: (t['amount'] as num).toDouble(),
          transactionType: t['transaction_type'] as String,
          createdAt: DateTime.fromMillisecondsSinceEpoch(t['created_at'] as int),
          metadata: payload['metadata'] as Map<String, dynamic>?,
        );
      }).toList();
      return Right(result);
    } catch (e) {
      return Left(CacheFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> syncPendingTransactions() async {
    try {
      final transactions = await _localDataSource.getPendingTransactions();
      for (final transaction in transactions) {
        try {
          final payload = jsonDecode(transaction['payload'] as String) as Map<String, dynamic>;
          await _remoteDataSource.syncTransaction(payload);
          await _localDataSource.deletePendingTransaction(transaction['id'] as String);
        } catch (e) {
          final retryCount = (transaction['retry_count'] as int?) ?? 0;
          if (retryCount < 3) {
            await _localDataSource.updatePendingTransactionRetryCount(
              transaction['id'] as String,
              retryCount + 1,
            );
          } else {
            await _localDataSource.markTransactionAsFailed(transaction['id'] as String);
          }
        }
      }
      return const Right(null);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
