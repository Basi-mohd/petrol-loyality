import 'package:client/core/database/database_helper.dart';
import 'package:client/core/error/exceptions.dart';
import 'dart:convert';

abstract class LocalDataSource {
  Future<void> cacheData(String key, Map<String, dynamic> data, {int? expiresInSeconds});
  Future<Map<String, dynamic>?> getCachedData(String key);
  Future<void> clearCache(String key);
  Future<void> addToSyncQueue(String method, String endpoint, Map<String, dynamic>? body);
  Future<List<Map<String, dynamic>>> getSyncQueue();
  Future<void> removeFromSyncQueue(int id);
}

class LocalDataSourceImpl implements LocalDataSource {
  final DatabaseHelper dbHelper;

  LocalDataSourceImpl(this.dbHelper);

  @override
  Future<void> cacheData(String key, Map<String, dynamic> data, {int? expiresInSeconds}) async {
    try {
      final expiresAt = expiresInSeconds != null
          ? DateTime.now().add(Duration(seconds: expiresInSeconds)).millisecondsSinceEpoch
          : null;
      
      await dbHelper.insert('cached_data', {
        'key': key,
        'value': jsonEncode(data),
        'expires_at': expiresAt,
        'created_at': DateTime.now().millisecondsSinceEpoch,
      });
    } catch (e) {
      throw CacheException('Failed to cache data: $e');
    }
  }

  @override
  Future<Map<String, dynamic>?> getCachedData(String key) async {
    try {
      final results = await dbHelper.query(
        'cached_data',
        where: 'key = ?',
        whereArgs: [key],
      );

      if (results.isEmpty) return null;

      final cached = results.first;
      final expiresAt = cached['expires_at'] as int?;

      if (expiresAt != null && DateTime.now().millisecondsSinceEpoch > expiresAt) {
        await dbHelper.delete('cached_data', where: 'key = ?', whereArgs: [key]);
        return null;
      }

      return jsonDecode(cached['value'] as String) as Map<String, dynamic>;
    } catch (e) {
      throw CacheException('Failed to get cached data: $e');
    }
  }

  @override
  Future<void> clearCache(String key) async {
    try {
      await dbHelper.delete('cached_data', where: 'key = ?', whereArgs: [key]);
    } catch (e) {
      throw CacheException('Failed to clear cache: $e');
    }
  }

  @override
  Future<void> addToSyncQueue(String method, String endpoint, Map<String, dynamic>? body) async {
    try {
      await dbHelper.insert('sync_queue', {
        'method': method,
        'endpoint': endpoint,
        'body': body != null ? jsonEncode(body) : null,
        'created_at': DateTime.now().millisecondsSinceEpoch,
      });
    } catch (e) {
      throw CacheException('Failed to add to sync queue: $e');
    }
  }

  @override
  Future<List<Map<String, dynamic>>> getSyncQueue() async {
    try {
      return await dbHelper.query('sync_queue', orderBy: 'created_at ASC');
    } catch (e) {
      throw CacheException('Failed to get sync queue: $e');
    }
  }

  @override
  Future<void> removeFromSyncQueue(int id) async {
    try {
      await dbHelper.delete('sync_queue', where: 'id = ?', whereArgs: [id]);
    } catch (e) {
      throw CacheException('Failed to remove from sync queue: $e');
    }
  }
}
