import 'package:client/core/database/database_helper.dart';

class AppDatabase {
  final DatabaseHelper _dbHelper;

  AppDatabase(this._dbHelper);

  DatabaseHelper get databaseHelper => _dbHelper;

  Future<void> initialize() async {
    await _dbHelper.database;
  }

  Future<void> close() async {
    await _dbHelper.close();
  }
}
