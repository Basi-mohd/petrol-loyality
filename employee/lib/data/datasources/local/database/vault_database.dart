import 'package:sqflite_sqlcipher/sqflite.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:employee/core/config/app_config.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/core/error/failures.dart';
import 'dart:io';

class VaultDatabase {
  final SecureStorageService _secureStorage;
  Database? _database;

  VaultDatabase(this._secureStorage);

  Future<void> initialize() async {
    if (_database != null) return;

    var password = await _secureStorage.getDatabasePassword();
    if (password == null) {
      password = _generatePassword();
      await _secureStorage.saveDatabasePassword(password);
    }

    final documentsDirectory = await getApplicationDocumentsDirectory();
    final databasesPath = join(documentsDirectory.path, 'databases');
    final dbDir = Directory(databasesPath);
    if (!await dbDir.exists()) {
      await dbDir.create(recursive: true);
    }
    final path = join(databasesPath, AppConfig.databaseName);

    try {
      _database = await openDatabase(
        path,
        password: password,
        version: AppConfig.databaseVersion,
        onCreate: _onCreate,
        onUpgrade: _onUpgrade,
      );
    } catch (e) {
      final dbFile = File(path);
      if (await dbFile.exists()) {
        try {
          await dbFile.delete();
        } catch (_) {}
      }
      
      final dbWalFile = File('$path-wal');
      if (await dbWalFile.exists()) {
        try {
          await dbWalFile.delete();
        } catch (_) {}
      }
      
      final dbShmFile = File('$path-shm');
      if (await dbShmFile.exists()) {
        try {
          await dbShmFile.delete();
        } catch (_) {}
      }

      _database = await openDatabase(
        path,
        password: password,
        version: AppConfig.databaseVersion,
        onCreate: _onCreate,
        onUpgrade: _onUpgrade,
      );
    }
  }

  Database get database {
    if (_database == null) {
      throw CacheFailure(message: 'Database not initialized');
    }
    return _database!;
  }

  String _generatePassword() {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final random = timestamp.toString();
    return 'vault_$random';
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE pending_transactions (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        amount REAL NOT NULL,
        transaction_type TEXT NOT NULL,
        payload TEXT NOT NULL,
        signature TEXT NOT NULL,
        device_info TEXT,
        geo_location TEXT,
        created_at INTEGER NOT NULL,
        sync_status TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0
      )
    ''');

    await db.execute('''
      CREATE TABLE sync_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        last_sync_at INTEGER,
        pending_count INTEGER DEFAULT 0,
        failed_count INTEGER DEFAULT 0,
        status TEXT NOT NULL
      )
    ''');

    await db.execute('''
      CREATE INDEX idx_pending_transactions_sync_status 
      ON pending_transactions(sync_status)
    ''');

    await db.execute('''
      CREATE INDEX idx_pending_transactions_created_at 
      ON pending_transactions(created_at)
    ''');

    await db.execute('''
      INSERT INTO sync_status (status, pending_count, failed_count) 
      VALUES ('idle', 0, 0)
    ''');
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < newVersion) {
      await db.execute('DROP TABLE IF EXISTS pending_transactions');
      await db.execute('DROP TABLE IF EXISTS sync_status');
      await _onCreate(db, newVersion);
    }
  }

  Future<void> close() async {
    await _database?.close();
    _database = null;
  }
}
