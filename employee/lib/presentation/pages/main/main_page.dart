import 'package:flutter/material.dart';
import 'package:employee/presentation/navigation/app_router.dart';
import 'package:employee/presentation/pages/transaction/scan_qr_page.dart';
import 'package:employee/presentation/pages/transaction/pending_transactions_page.dart';
import 'package:employee/presentation/pages/sync/sync_status_page.dart';
import 'package:employee/presentation/pages/profile/profile_page.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/core/di/service_locator.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    const ScanQrPage(),
    const PendingTransactionsPage(),
    const SyncStatusPage(),
    const ProfilePage(),
  ];

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final secureStorage = getIt<SecureStorageService>();
    final token = await secureStorage.getJwtToken();
    if (token == null && mounted) {
      Navigator.of(context).pushReplacementNamed(AppRouter.login);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.qr_code_scanner),
            label: 'Scan QR',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.pending_actions),
            label: 'Pending',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.sync),
            label: 'Sync',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
