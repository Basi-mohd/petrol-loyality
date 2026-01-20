import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:employee/core/network/api_client.dart';
import 'package:employee/core/error/failures.dart';

abstract class RemoteDataSource {
  Future<Map<String, dynamic>> login(String username, String password);
  Future<Map<String, dynamic>> syncTransaction(Map<String, dynamic> transaction);
  Future<Map<String, dynamic>> getEmployeeProfile();
}

class RemoteDataSourceImpl implements RemoteDataSource {
  final ApiClient _apiClient;

  RemoteDataSourceImpl(this._apiClient);

  Map<String, dynamic> _unwrapData(Response response) {
    final body = response.data;
    if (body is String) {
      try {
        final decoded = jsonDecode(body);
        if (decoded is Map<String, dynamic>) {
          return decoded;
        }
        if (decoded is Map && decoded['data'] is Map<String, dynamic>) {
          return Map<String, dynamic>.from(decoded['data'] as Map<String, dynamic>);
        }
      } catch (_) {}
    }
    if (body is Map && body['data'] is Map<String, dynamic>) {
      return Map<String, dynamic>.from(body['data'] as Map<String, dynamic>);
    }
    if (body is Map<String, dynamic>) {
      return Map<String, dynamic>.from(body);
    }
    throw Exception('Unexpected response format: ${body.runtimeType}');
  }

  @override
  Future<Map<String, dynamic>> login(String username, String password) async {
    try {
      final response = await _apiClient.post(
        '/auth/login',
        data: {
          'username': username,
          'password': password,
        },
      );
      return _unwrapData(response);
    } catch (e) {
      if (e is Failure) rethrow;
      throw ServerFailure(message: e.toString());
    }
  }

  @override
  Future<Map<String, dynamic>> syncTransaction(Map<String, dynamic> transaction) async {
    try {
      final response = await _apiClient.post(
        '/transactions',
        data: transaction,
      );
      return _unwrapData(response);
    } catch (e) {
      if (e is Failure) rethrow;
      throw ServerFailure(message: e.toString());
    }
  }

  @override
  Future<Map<String, dynamic>> getEmployeeProfile() async {
    try {
      final response = await _apiClient.get('/employees/me');
      return _unwrapData(response);
    } catch (e) {
      if (e is Failure) rethrow;
      throw ServerFailure(message: e.toString());
    }
  }
}
