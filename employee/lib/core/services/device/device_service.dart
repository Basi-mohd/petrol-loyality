import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:employee/core/di/service_locator.dart';
import 'package:crypto/crypto.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';

class DeviceService {
  final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();
  static const String _deviceFingerprintKey = 'device_fingerprint';
  static const String _deviceIdKey = 'device_id';

  Future<String> getDeviceFingerprint() async {
    final storage = getIt<FlutterSecureStorage>();
    final cached = await storage.read(key: _deviceFingerprintKey);
    if (cached != null) return cached;

    String fingerprint;
    if (Platform.isAndroid) {
      final androidInfo = await _deviceInfo.androidInfo;
      fingerprint = _generateFingerprint([
        androidInfo.id,
        androidInfo.id,
        androidInfo.model,
        androidInfo.manufacturer,
        androidInfo.brand,
        androidInfo.device,
      ]);
    } else if (Platform.isIOS) {
      final iosInfo = await _deviceInfo.iosInfo;
      fingerprint = _generateFingerprint([
        iosInfo.identifierForVendor ?? '',
        iosInfo.model,
        iosInfo.name,
        iosInfo.systemName,
      ]);
    } else {
      throw UnsupportedError('Platform not supported');
    }

    await storage.write(key: _deviceFingerprintKey, value: fingerprint);
    return fingerprint;
  }

  Future<String> getDeviceId() async {
    final storage = getIt<FlutterSecureStorage>();
    final cached = await storage.read(key: _deviceIdKey);
    if (cached != null) return cached;

    String deviceId;
    if (Platform.isAndroid) {
      final androidInfo = await _deviceInfo.androidInfo;
      deviceId = androidInfo.id;
    } else if (Platform.isIOS) {
      final iosInfo = await _deviceInfo.iosInfo;
      deviceId = iosInfo.identifierForVendor ?? 'unknown';
    } else {
      deviceId = 'unknown';
    }

    await storage.write(key: _deviceIdKey, value: deviceId);
    return deviceId;
  }

  String _generateFingerprint(List<String> components) {
    final combined = components.join(':');
    final bytes = utf8.encode(combined);
    final digest = sha256.convert(bytes);
    return digest.toString();
  }

  Future<Map<String, dynamic>> getDeviceInfo() async {
    final fingerprint = await getDeviceFingerprint();
    final deviceId = await getDeviceId();

    if (Platform.isAndroid) {
      final androidInfo = await _deviceInfo.androidInfo;
      return {
        'device_id': deviceId,
        'fingerprint': fingerprint,
        'platform': 'android',
        'model': androidInfo.model,
        'manufacturer': androidInfo.manufacturer,
        'brand': androidInfo.brand,
        'device': androidInfo.device,
        'version': androidInfo.version.release,
        'sdk': androidInfo.version.sdkInt.toString(),
      };
    } else if (Platform.isIOS) {
      final iosInfo = await _deviceInfo.iosInfo;
      return {
        'device_id': deviceId,
        'fingerprint': fingerprint,
        'platform': 'ios',
        'model': iosInfo.model,
        'name': iosInfo.name,
        'system_name': iosInfo.systemName,
        'system_version': iosInfo.systemVersion,
      };
    }

    return {
      'device_id': deviceId,
      'fingerprint': fingerprint,
      'platform': 'unknown',
    };
  }
}
