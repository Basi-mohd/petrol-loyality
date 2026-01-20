import 'package:flutter/material.dart';
import 'package:employee/presentation/pages/auth/employee_login_page.dart';
import 'package:employee/presentation/pages/transaction/scan_qr_page.dart';
import 'package:employee/presentation/pages/transaction/enter_amount_page.dart';
import 'package:employee/presentation/pages/transaction/pending_transactions_page.dart';
import 'package:employee/presentation/pages/sync/sync_status_page.dart';
import 'package:employee/presentation/pages/profile/profile_page.dart';

class AppRouter {
  static const String login = '/login';
  static const String scanQr = '/scan-qr';
  static const String enterAmount = '/enter-amount';
  static const String pendingTransactions = '/pending-transactions';
  static const String syncStatus = '/sync-status';
  static const String profile = '/profile';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case login:
        return MaterialPageRoute(builder: (_) => const EmployeeLoginPage());
      case scanQr:
        return MaterialPageRoute(builder: (_) => const ScanQrPage());
      case enterAmount:
        final args = settings.arguments as Map<String, dynamic>?;
        return MaterialPageRoute(
          builder: (_) => EnterAmountPage(
            customerId: args?['customerId'] as String? ?? '',
          ),
        );
      case pendingTransactions:
        return MaterialPageRoute(builder: (_) => const PendingTransactionsPage());
      case syncStatus:
        return MaterialPageRoute(builder: (_) => const SyncStatusPage());
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfilePage());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
