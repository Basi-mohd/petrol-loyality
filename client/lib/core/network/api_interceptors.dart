import 'package:dio/dio.dart';
import 'package:client/core/config/app_config.dart';
import 'package:client/core/error/exceptions.dart';
import 'package:client/core/storage/secure_storage_service.dart';

class AuthInterceptor extends Interceptor {
  final SecureStorageService secureStorage;

  AuthInterceptor(this.secureStorage);

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await secureStorage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final refreshToken = await secureStorage.getRefreshToken();
      if (refreshToken != null) {
        try {
          final dio = Dio();
          final response = await dio.post(
            '${AppConfig.apiBaseUrl}/auth/refresh',
            data: {'refreshToken': refreshToken},
          );
          
          if (response.statusCode == 200) {
            final newAccessToken = response.data['accessToken'] as String;
            await secureStorage.saveAccessToken(newAccessToken);
            
            err.requestOptions.headers['Authorization'] = 'Bearer $newAccessToken';
            final opts = Options(
              method: err.requestOptions.method,
              headers: err.requestOptions.headers,
            );
            final cloneReq = await dio.request(
              err.requestOptions.path,
              options: opts,
              data: err.requestOptions.data,
              queryParameters: err.requestOptions.queryParameters,
            );
            return handler.resolve(cloneReq);
          }
        } catch (e) {
          await secureStorage.clearTokens();
        }
      } else {
        await secureStorage.clearTokens();
      }
    }
    handler.next(err);
  }
}

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    Exception exception;
    
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        exception = NetworkException('Connection timeout. Please check your internet connection and ensure the backend server is running.');
        break;
      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode;
        final message = err.response?.data?['message'] ?? err.message ?? 'Server error';
        if (statusCode == 401) {
          exception = AuthenticationException(message);
        } else if (statusCode != null && statusCode >= 400 && statusCode < 500) {
          exception = ValidationException(message);
        } else {
          exception = ServerException(message, statusCode: statusCode);
        }
        break;
      case DioExceptionType.cancel:
        exception = NetworkException('Request cancelled');
        break;
      case DioExceptionType.unknown:
        if (err.error?.toString().contains('SocketException') == true) {
          exception = NetworkException('No internet connection');
        } else {
          exception = NetworkException(err.message ?? 'Unknown error');
        }
        break;
      default:
        exception = NetworkException(err.message ?? 'Unknown error');
    }
    
    handler.reject(DioException(
      requestOptions: err.requestOptions,
      error: exception,
      type: err.type,
      response: err.response,
    ));
  }
}

class LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    if (AppConfig.isDevelopment) {
      // ignore: avoid_print
      print('REQUEST[${options.method}] => PATH: ${options.path}');
      // ignore: avoid_print
      print('Headers: ${options.headers}');
      // ignore: avoid_print
      print('Data: ${options.data}');
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    if (AppConfig.isDevelopment) {
      // ignore: avoid_print
      print('RESPONSE[${response.statusCode}] => PATH: ${response.requestOptions.path}');
      // ignore: avoid_print
      print('Data: ${response.data}');
    }
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (AppConfig.isDevelopment) {
      // ignore: avoid_print
      print('ERROR[${err.response?.statusCode}] => PATH: ${err.requestOptions.path}');
      // ignore: avoid_print
      print('Message: ${err.message}');
    }
    handler.next(err);
  }
}
