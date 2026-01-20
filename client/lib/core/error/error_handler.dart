import 'package:flutter/foundation.dart';
import 'package:client/core/error/exceptions.dart';
import 'package:client/core/error/failures.dart';

class ErrorHandler {
  static void setupErrorHandling() {
    FlutterError.onError = (FlutterErrorDetails details) {
      FlutterError.presentError(details);
      _logError(details.exception, details.stack);
    };

    PlatformDispatcher.instance.onError = (error, stack) {
      _logError(error, stack);
      return true;
    };
  }

  static void logError(dynamic error, StackTrace? stack) {
    if (kDebugMode) {
      debugPrint('Error: $error');
      debugPrint('Stack: $stack');
    }
  }

  static void _logError(dynamic error, StackTrace? stack) {
    logError(error, stack);
  }

  static Failure mapExceptionToFailure(Exception exception) {
    if (exception is ServerException) {
      return ServerFailure(exception.message);
    } else if (exception is CacheException) {
      return CacheFailure(exception.message);
    } else if (exception is NetworkException) {
      return NetworkFailure(exception.message);
    } else if (exception is AuthenticationException) {
      return AuthenticationFailure(exception.message);
    } else if (exception is ValidationException) {
      return ValidationFailure(exception.message);
    } else {
      return ServerFailure('An unexpected error occurred: ${exception.toString()}');
    }
  }
}
