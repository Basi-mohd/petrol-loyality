import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:employee/core/services/logging/fraud_safe_logger.dart';
import 'package:employee/core/di/service_locator.dart';
import 'package:employee/core/error/failures.dart';

class ErrorHandler {
  static void setupErrorHandling() {
    FlutterError.onError = (FlutterErrorDetails details) {
      FlutterError.presentError(details);
      if (kReleaseMode) {
        getIt<FraudSafeLogger>().logError(
          details.exception,
          details.stack,
          context: 'Flutter Error',
        );
      }
    };

    PlatformDispatcher.instance.onError = (error, stack) {
      getIt<FraudSafeLogger>().logError(error, stack, context: 'Platform Error');
      return true;
    };
  }

  static void logError(dynamic error, StackTrace? stack, {String? context}) {
    getIt<FraudSafeLogger>().logError(error, stack, context: context);
  }

  static Failure mapExceptionToFailure(dynamic exception) {
    if (exception is Failure) {
      return exception;
    }

    final errorMessage = exception.toString();

    if (errorMessage.contains('SocketException') ||
        errorMessage.contains('NetworkException') ||
        errorMessage.contains('Connection')) {
      return NetworkFailure(message: 'Network connection failed');
    }

    if (errorMessage.contains('TimeoutException')) {
      return NetworkFailure(message: 'Request timeout');
    }

    if (errorMessage.contains('FormatException')) {
      return ValidationFailure(message: 'Invalid data format');
    }

    return ServerFailure(message: errorMessage);
  }
}
