import 'dart:developer' as developer;
import 'package:logger/logger.dart';

class FraudSafeLogger {
  final Logger _logger;

  FraudSafeLogger()
      : _logger = Logger(
          printer: PrettyPrinter(
            methodCount: 0,
            errorMethodCount: 8,
            lineLength: 120,
            colors: true,
            printEmojis: true,
            printTime: true,
          ),
        );

  void logError(dynamic error, StackTrace? stack, {String? context}) {
    final contextPrefix = context != null ? '[$context] ' : '';
    _logger.e(
      '$contextPrefix$error',
      error: error,
      stackTrace: stack,
    );
    developer.log(
      error.toString(),
      name: 'Error',
      error: error,
      stackTrace: stack,
    );
  }

  void logInfo(String message, {Map<String, dynamic>? data}) {
    _logger.i(message, error: data);
  }

  void logWarning(String message, {Map<String, dynamic>? data}) {
    _logger.w(message, error: data);
  }

  void logDebug(String message, {Map<String, dynamic>? data}) {
    _logger.d(message, error: data);
  }

  void logTransaction(String transactionId, String action, {Map<String, dynamic>? metadata}) {
    final logData = {
      'transaction_id': transactionId,
      'action': action,
      if (metadata != null) ...metadata,
    };
    _logger.i('Transaction Event: $action', error: logData);
  }
}
