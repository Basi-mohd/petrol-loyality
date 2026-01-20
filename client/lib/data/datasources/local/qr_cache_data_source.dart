import 'package:sqflite/sqflite.dart';
import 'package:client/core/database/database_helper.dart';

class QrCacheDataSource {
  final DatabaseHelper databaseHelper;

  QrCacheDataSource(this.databaseHelper);

  Future<void> cacheQrIdentity({
    required String customerId,
    required String qrToken,
  }) async {
    try {
      final db = await databaseHelper.database;
      await db.insert(
        'qr_cache',
        {
          'customer_id': customerId,
          'qr_token': qrToken,
          'cached_at': DateTime.now().toIso8601String(),
        },
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    } catch (e) {
    }
  }

  Future<Map<String, dynamic>?> getCachedQrIdentity(String customerId) async {
    try {
      final db = await databaseHelper.database;
      final result = await db.query(
        'qr_cache',
        where: 'customer_id = ?',
        whereArgs: [customerId],
        orderBy: 'cached_at DESC',
        limit: 1,
      );

      if (result.isEmpty) {
        return null;
      }

      return {
        'customerId': result.first['customer_id'],
        'qrToken': result.first['qr_token'],
        'cachedAt': result.first['cached_at'],
      };
    } catch (e) {
      return null;
    }
  }

  Future<void> clearCache() async {
    final db = await databaseHelper.database;
    await db.delete('qr_cache');
  }
}
