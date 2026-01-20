import 'package:employee/core/config/environment.dart';

class AppConfig {
  static Environment _environment = Environment.dev;
  static Environment get environment => _environment;

  static const String _apiBaseUrlOverride =
      String.fromEnvironment('API_BASE_URL', defaultValue: '');

  static void setEnvironment(Environment env) {
    _environment = env;
  }

  static String get baseUrl {
    if (_apiBaseUrlOverride.isNotEmpty) {
      return _apiBaseUrlOverride;
    }
    switch (_environment) {
      case Environment.dev:
        return 'http://10.0.2.2:3000';
      case Environment.staging:
        return 'https://api-staging.example.com';
      case Environment.prod:
        return 'https://api.example.com';
    }
  }

  static String get apiBaseUrl => baseUrl;

  static String get databaseName => 'employee_vault.db';
  static int get databaseVersion => 1;
  static int get geoFenceRadiusMeters => 20;
  static int get syncIntervalMinutes => 5;
  static int get maxRetryAttempts => 3;
  static Duration get apiTimeout => const Duration(seconds: 30);
  static Duration get geoLocationTimeout => const Duration(seconds: 10);
}
