import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService(this._storage);

  static const String _jwtTokenKey = 'jwt_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _employeeIdKey = 'employee_id';
  static const String _privateKeyKey = 'private_key';
  static const String _databasePasswordKey = 'db_password';

  Future<void> saveJwtToken(String token) async {
    await _storage.write(key: _jwtTokenKey, value: token);
  }

  Future<String?> getJwtToken() async {
    return await _storage.read(key: _jwtTokenKey);
  }

  Future<void> saveAccessToken(String token) async {
    await _storage.write(key: _jwtTokenKey, value: token);
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: _jwtTokenKey);
  }

  Future<void> saveRefreshToken(String token) async {
    await _storage.write(key: _refreshTokenKey, value: token);
  }

  Future<String?> getRefreshToken() async {
    return await _storage.read(key: _refreshTokenKey);
  }

  Future<void> saveEmployeeId(String employeeId) async {
    await _storage.write(key: _employeeIdKey, value: employeeId);
  }

  Future<String?> getEmployeeId() async {
    return await _storage.read(key: _employeeIdKey);
  }

  Future<void> savePrivateKey(String privateKey) async {
    await _storage.write(key: _privateKeyKey, value: privateKey);
  }

  Future<String?> getPrivateKey() async {
    return await _storage.read(key: _privateKeyKey);
  }

  Future<void> saveDatabasePassword(String password) async {
    await _storage.write(key: _databasePasswordKey, value: password);
  }

  Future<String?> getDatabasePassword() async {
    return await _storage.read(key: _databasePasswordKey);
  }

  Future<void> saveToken(String key, String value) async {
    await _storage.write(key: key, value: value);
  }

  Future<String?> getToken(String key) async {
    return await _storage.read(key: key);
  }

  Future<void> clearTokens() async {
    await _storage.delete(key: _jwtTokenKey);
    await _storage.delete(key: _refreshTokenKey);
  }

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
