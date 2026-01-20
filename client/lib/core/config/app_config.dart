import 'package:client/core/config/environment.dart';

class AppConfig {
  static Environment _environment = Environment.dev;

  static Environment get environment => _environment;

  static const String _apiBaseUrlOverride =
      String.fromEnvironment('API_BASE_URL', defaultValue: '');

  static String get baseUrl {
    if (_apiBaseUrlOverride.isNotEmpty) {
      return _apiBaseUrlOverride;
    }
    switch (_environment) {
      case Environment.dev:
        return 'http://10.0.2.2:3000';
      case Environment.prod:
        return 'https://api.example.com';
    }
  }

  static String get apiBaseUrl => baseUrl;

  static void setEnvironment(Environment env) {
    _environment = env;
  }

  static bool get isDevelopment => _environment == Environment.dev;
  static bool get isProduction => _environment == Environment.prod;
}
