import 'package:dio/dio.dart';
import 'package:employee/core/network/api_client.dart';
import 'package:employee/core/error/failures.dart';

class EmployeeAuthRemoteDataSource {
  final ApiClient apiClient;

  EmployeeAuthRemoteDataSource(this.apiClient);

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

  Future<Map<String, dynamic>> login({
    required String employeeId,
    required String password,
  }) async {
    try {
      final response = await apiClient.post(
        '/employee/login',
        data: {
          'employeeId': employeeId,
          'password': password,
        },
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
      throw Exception('Failed to login: $message');
    } on DioException catch (e) {
      throw Exception('Failed to login: ${e.message}');
    } catch (e) {
      throw Exception('Failed to login: $e');
    }
  }

  Future<Map<String, dynamic>> resolveQrToken(String qrToken) async {
    try {
      final response = await apiClient.post(
        '/customer/qr/resolve',
        data: {
          'qrToken': qrToken,
        },
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
      throw Exception('Failed to resolve QR token: $message');
    } on DioException catch (e) {
      throw Exception('Failed to resolve QR token: ${e.message}');
    } catch (e) {
      throw Exception('Failed to resolve QR token: $e');
    }
  }
}
