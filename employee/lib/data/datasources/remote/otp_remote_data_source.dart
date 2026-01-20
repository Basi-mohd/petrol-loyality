import 'package:dio/dio.dart';
import 'package:employee/core/network/api_client.dart';
import 'package:employee/core/error/failures.dart';

class OtpRemoteDataSource {
  final ApiClient apiClient;

  OtpRemoteDataSource(this.apiClient);

  Map<String, dynamic> _unwrapData(Response response) {
    final body = response.data;
    if (body is Map && body['data'] is Map<String, dynamic>) {
      return Map<String, dynamic>.from(body['data'] as Map<String, dynamic>);
    }
    if (body is Map<String, dynamic>) {
      return Map<String, dynamic>.from(body);
    }
    throw Exception('Unexpected response format');
  }

  Future<Map<String, dynamic>> requestOtp({
    required String phoneNumber,
    required String deviceId,
  }) async {
    try {
      final response = await apiClient.post(
        '/employee/otp/request',
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
    } on Failure catch (e) {
      String message;
      if (e is ServerFailure) {
        message = e.message;
      } else if (e is NetworkFailure) {
        message = e.message;
      } else if (e is CacheFailure) {
        message = e.message;
      } else if (e is ValidationFailure) {
        message = e.message;
      } else if (e is AuthenticationFailure) {
        message = e.message;
      } else if (e is GeoFenceFailure) {
        message = e.message;
      } else if (e is CryptoFailure) {
        message = e.message;
      } else {
        message = e.toString();
      }
      throw Exception('Failed to request OTP: $message');
    } on DioException catch (e) {
      throw Exception('Failed to request OTP: ${e.message}');
    } catch (e) {
      throw Exception('Failed to request OTP: $e');
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
        '/employee/otp/verify',
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
    } on Failure catch (e) {
      String message;
      if (e is ServerFailure) {
        message = e.message;
      } else if (e is NetworkFailure) {
        message = e.message;
      } else if (e is CacheFailure) {
        message = e.message;
      } else if (e is ValidationFailure) {
        message = e.message;
      } else if (e is AuthenticationFailure) {
        message = e.message;
      } else if (e is GeoFenceFailure) {
        message = e.message;
      } else if (e is CryptoFailure) {
        message = e.message;
      } else {
        message = e.toString();
      }
      throw Exception('Failed to verify OTP: $message');
    } on DioException catch (e) {
      throw Exception('Failed to verify OTP: ${e.message}');
    } catch (e) {
      throw Exception('Failed to verify OTP: $e');
    }
  }
}
