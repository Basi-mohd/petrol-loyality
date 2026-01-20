import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/core/error/failures.dart';

class CryptoService {
  final SecureStorageService _secureStorage;
  static const String _privateKeyKey = 'private_key';

  CryptoService(this._secureStorage);

  Future<void> initialize() async {
    final privateKey = await _secureStorage.getPrivateKey();
    if (privateKey == null) {
      await _generateKeyPair();
    }
  }

  Future<void> _generateKeyPair() async {
    final random = DateTime.now().millisecondsSinceEpoch.toString();
    final keyBytes = utf8.encode(random + 'employee_app_secret_salt');
    final hash = sha256.convert(keyBytes);
    final privateKey = base64Encode(hash.bytes);
    await _secureStorage.savePrivateKey(privateKey);
  }

  Future<String> signPayload(String payload) async {
    try {
      final privateKey = await _secureStorage.getPrivateKey();
      if (privateKey == null) {
        throw CryptoFailure(message: 'Private key not found');
      }

      final payloadBytes = utf8.encode(payload);
      final keyBytes = base64Decode(privateKey);
      
      final hmac = Hmac(sha256, keyBytes);
      final digest = hmac.convert(payloadBytes);
      
      return base64Encode(digest.bytes);
    } catch (e) {
      throw CryptoFailure(message: 'Failed to sign payload: $e');
    }
  }

  Future<Map<String, dynamic>> createSignedTransactionPayload(
    Map<String, dynamic> transactionData,
  ) async {
    final timestamp = DateTime.now().toIso8601String();
    final payload = {
      ...transactionData,
      'timestamp': timestamp,
    };
    
    final jsonString = jsonEncode(payload);
    final signature = await signPayload(jsonString);
    
    return {
      ...payload,
      'signature': signature,
    };
  }
}
