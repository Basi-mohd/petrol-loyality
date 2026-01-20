import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:employee/core/di/service_locator.dart';
import 'package:employee/core/services/logging/fraud_safe_logger.dart';
import 'package:employee/data/datasources/local/local_datasource.dart';
import 'package:employee/data/datasources/remote/remote_datasource.dart';
import 'package:employee/domain/repositories/transaction_repository.dart';

class SyncService {
  final TransactionRepository _transactionRepository;
  final LocalDataSource _localDataSource;
  final RemoteDataSource _remoteDataSource;
  final Connectivity _connectivity;
  bool _isSyncing = false;

  SyncService({
    required TransactionRepository transactionRepository,
    required LocalDataSource localDataSource,
    required RemoteDataSource remoteDataSource,
    required Connectivity connectivity,
  })  : _transactionRepository = transactionRepository,
        _localDataSource = localDataSource,
        _remoteDataSource = remoteDataSource,
        _connectivity = connectivity;

  Future<void> syncPendingTransactions() async {
    if (_isSyncing) {
      getIt<FraudSafeLogger>().logInfo('Sync already in progress');
      return;
    }

    _isSyncing = true;
    try {
      final connectivityResult = await _connectivity.checkConnectivity();
      if (connectivityResult == ConnectivityResult.none) {
        getIt<FraudSafeLogger>().logInfo('No network connection, skipping sync');
        return;
      }

      final pendingTransactions = await _localDataSource.getPendingTransactions();
      if (pendingTransactions.isEmpty) {
        await _localDataSource.updateSyncStatus(
          lastSyncAt: DateTime.now(),
          pendingCount: 0,
          failedCount: 0,
          status: 'idle',
        );
        return;
      }

      int successCount = 0;
      int failCount = 0;

      for (final transaction in pendingTransactions) {
        try {
          await _remoteDataSource.syncTransaction(transaction);
          await _localDataSource.deletePendingTransaction(transaction['id'] as String);
          successCount++;
        } catch (e) {
          getIt<FraudSafeLogger>().logError(e, null, context: 'Sync Transaction');
          final retryCount = (transaction['retry_count'] as int?) ?? 0;
          if (retryCount < 3) {
            await _localDataSource.updatePendingTransactionRetryCount(
              transaction['id'] as String,
              retryCount + 1,
            );
          } else {
            await _localDataSource.markTransactionAsFailed(transaction['id'] as String);
            failCount++;
          }
        }
      }

      await _localDataSource.updateSyncStatus(
        lastSyncAt: DateTime.now(),
        pendingCount: pendingTransactions.length - successCount - failCount,
        failedCount: failCount,
        status: 'completed',
      );

      getIt<FraudSafeLogger>().logInfo(
        'Sync completed: $successCount succeeded, $failCount failed',
      );
    } catch (e) {
      getIt<FraudSafeLogger>().logError(e, null, context: 'Sync Service');
      await _localDataSource.updateSyncStatus(
        status: 'error',
      );
    } finally {
      _isSyncing = false;
    }
  }

  Future<Map<String, dynamic>> getSyncStatus() async {
    return await _localDataSource.getSyncStatus();
  }

  bool get isSyncing => _isSyncing;
}
