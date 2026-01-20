import 'package:employee/data/datasources/local/database/vault_database.dart';
import 'package:sqflite_sqlcipher/sqflite.dart';

abstract class LocalDataSource {
  Future<void> savePendingTransaction(Map<String, dynamic> transaction);
  Future<List<Map<String, dynamic>>> getPendingTransactions();
  Future<void> deletePendingTransaction(String id);
  Future<void> updatePendingTransactionRetryCount(String id, int retryCount);
  Future<void> markTransactionAsFailed(String id);
  Future<void> updateSyncStatus({
    DateTime? lastSyncAt,
    int? pendingCount,
    int? failedCount,
    required String status,
  });
  Future<Map<String, dynamic>> getSyncStatus();
}

class LocalDataSourceImpl implements LocalDataSource {
  final VaultDatabase _database;

  LocalDataSourceImpl(this._database);

  @override
  Future<void> savePendingTransaction(Map<String, dynamic> transaction) async {
    await _database.database.insert(
      'pending_transactions',
      {
        'id': transaction['id'],
        'customer_id': transaction['customer_id'],
        'amount': transaction['amount'],
        'transaction_type': transaction['transaction_type'],
        'payload': transaction['payload'],
        'signature': transaction['signature'],
        'device_info': transaction['device_info'],
        'geo_location': transaction['geo_location'],
        'created_at': transaction['created_at']?.millisecondsSinceEpoch ?? DateTime.now().millisecondsSinceEpoch,
        'sync_status': transaction['sync_status'] ?? 'pending',
        'retry_count': transaction['retry_count'] ?? 0,
      },
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  @override
  Future<List<Map<String, dynamic>>> getPendingTransactions() async {
    final results = await _database.database.query(
      'pending_transactions',
      where: 'sync_status = ?',
      whereArgs: ['pending'],
      orderBy: 'created_at ASC',
    );
    return results;
  }

  @override
  Future<void> deletePendingTransaction(String id) async {
    await _database.database.delete(
      'pending_transactions',
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  @override
  Future<void> updatePendingTransactionRetryCount(String id, int retryCount) async {
    await _database.database.update(
      'pending_transactions',
      {'retry_count': retryCount},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  @override
  Future<void> markTransactionAsFailed(String id) async {
    await _database.database.update(
      'pending_transactions',
      {'sync_status': 'failed'},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  @override
  Future<void> updateSyncStatus({
    DateTime? lastSyncAt,
    int? pendingCount,
    int? failedCount,
    required String status,
  }) async {
    final updateData = <String, dynamic>{'status': status};
    if (lastSyncAt != null) {
      updateData['last_sync_at'] = lastSyncAt.millisecondsSinceEpoch;
    }
    if (pendingCount != null) {
      updateData['pending_count'] = pendingCount;
    }
    if (failedCount != null) {
      updateData['failed_count'] = failedCount;
    }

    final count = await _database.database.rawQuery('SELECT COUNT(*) as count FROM sync_status');
    if (count.first['count'] == 0) {
      await _database.database.insert('sync_status', updateData);
    } else {
      await _database.database.update('sync_status', updateData, where: 'id = 1');
    }
  }

  @override
  Future<Map<String, dynamic>> getSyncStatus() async {
    final results = await _database.database.query('sync_status', limit: 1);
    if (results.isEmpty) {
      return {
        'last_sync_at': null,
        'pending_count': 0,
        'failed_count': 0,
        'status': 'idle',
      };
    }
    return results.first;
  }
}
