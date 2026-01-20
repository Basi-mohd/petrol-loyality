import 'package:dio/dio.dart';
import 'package:employee/core/config/app_config.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/core/services/crypto/crypto_service.dart';
import 'package:employee/core/services/device/device_service.dart';
import 'package:employee/core/error/failures.dart';
import 'package:employee/core/error/error_handler.dart';

class ApiClient {
  late final Dio _dio;
  final SecureStorageService _secureStorage;
  final CryptoService _cryptoService;
  final DeviceService _deviceService;

  ApiClient(
    this._secureStorage,
    this._cryptoService,
    this._deviceService,
  ) {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBaseUrl,
        connectTimeout: AppConfig.apiTimeout,
        receiveTimeout: AppConfig.apiTimeout,
        sendTimeout: AppConfig.apiTimeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    _dio.interceptors.addAll([
      AuthInterceptor(_secureStorage),
      DeviceInterceptor(_deviceService),
      ErrorInterceptor(),
    ]);
  }

  Dio get dio => _dio;

  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.get(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.post(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleDioException(e);
    }
  }

  Failure _handleDioException(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout) {
      return NetworkFailure(message: 'Request timeout');
    }

    if (e.type == DioExceptionType.connectionError) {
      return NetworkFailure(message: 'Network connection failed');
    }

    if (e.response != null) {
      final statusCode = e.response!.statusCode;
      final message = e.response!.data?['message'] ?? e.message ?? 'Server error';
      
      if (statusCode == 401) {
        return AuthenticationFailure(message: message);
      }
      
      return ServerFailure(message: message, statusCode: statusCode);
    }

    return NetworkFailure(message: e.message ?? 'Network error');
  }
}

class AuthInterceptor extends Interceptor {
  final SecureStorageService _secureStorage;

  AuthInterceptor(this._secureStorage);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _secureStorage.getJwtToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
}

class DeviceInterceptor extends Interceptor {
  final DeviceService _deviceService;

  DeviceInterceptor(this._deviceService);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final deviceInfo = await _deviceService.getDeviceInfo();
    options.headers['X-Device-ID'] = deviceInfo['device_id'] as String;
    options.headers['X-Device-Fingerprint'] = deviceInfo['fingerprint'] as String;
    handler.next(options);
  }
}

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    handler.next(err);
  }
}
