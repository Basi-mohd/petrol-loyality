import 'package:dio/dio.dart';
import 'package:client/core/network/api_client.dart';

class OtpRemoteDataSource {
  final ApiClient apiClient;

  OtpRemoteDataSource(this.apiClient);

  Map<String, dynamic> _unwrapData(Response response) {
    final body = response.data;
    if (body is Map<String, dynamic>) {
      if (body.containsKey('data') && body['data'] is Map<String, dynamic>) {
        return Map<String, dynamic>.from(body['data'] as Map<String, dynamic>);
      }
      return Map<String, dynamic>.from(body);
    }
    throw Exception('Unexpected response format: ${body.runtimeType}');
  }

  Future<Map<String, dynamic>> requestOtp({
    required String phoneNumber,
    required String deviceId,
  }) async {
    try {
      final response = await apiClient.post(
        '/otp/request',
        data: {
          'phoneNumber': phoneNumber,
          'deviceId': deviceId,
        },
        options: Options(
          headers: {
            'x-device-id': deviceId,
          },
        ),
      );
      return _unwrapData(response);
    } on DioException catch (e) {
      throw Exception('Failed to request OTP: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> verifyOtp({
    required String otpId,
    required String code,
    required String phoneNumber,
    required String deviceId,
  }) async {
    try {
      final response = await apiClient.post(
        '/otp/verify',
        data: {
          'otpId': otpId,
          'code': code,
          'phoneNumber': phoneNumber,
          'deviceId': deviceId,
        },
        options: Options(
          headers: {
            'x-device-id': deviceId,
          },
        ),
      );
      return _unwrapData(response);
    } on DioException catch (e) {
      throw Exception('Failed to verify OTP: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> getQrIdentity() async {
    try {
      final response = await apiClient.get('/customer/qr');
      return _unwrapData(response);
    } on DioException catch (e) {
      throw Exception('Failed to get QR identity: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> regenerateQrIdentity(String customerId) async {
    try {
      final response = await apiClient.post(
        '/customer/qr/regenerate',
        data: {'customerId': customerId},
      );
      return _unwrapData(response);
    } on DioException catch (e) {
      throw Exception('Failed to regenerate QR identity: ${e.message}');
    }
  }

  Future<Map<String, dynamic>> getBalance() async {
    try {
      final response = await apiClient.get('/customer/balance');
      return _unwrapData(response);
    } on DioException catch (e) {
      throw Exception('Failed to get balance: ${e.message}');
    }
  }
}
