import 'package:flutter/material.dart';
import 'dart:async';
import 'package:client/core/config/app_config.dart';
import 'package:client/core/config/environment.dart';
import 'package:client/core/di/injection_container.dart' as di;
import 'package:client/core/error/error_handler.dart';
import 'package:client/core/sync/background_sync_service.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:client/presentation/pages/main/main_page.dart';
import 'package:client/presentation/pages/otp/otp_request_page.dart';
import 'package:client/core/di/service_locator.dart';
import 'package:client/core/storage/secure_storage_service.dart';
import 'package:client/presentation/bloc/otp/otp_bloc.dart';
import 'package:client/presentation/bloc/qr/qr_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  ErrorHandler.setupErrorHandling();

  AppConfig.setEnvironment(Environment.dev);

  await di.init();

  try {
    await BackgroundSyncService.initialize();
    await BackgroundSyncService.registerPeriodicTask();
  } catch (e) {
    ErrorHandler.logError(e, StackTrace.current);
  }

  runZonedGuarded(
    () {
      runApp(const LoyaltyWalletApp());
    },
    (error, stack) {
      ErrorHandler.logError(error, stack);
    },
  );
}

class LoyaltyWalletApp extends StatelessWidget {
  const LoyaltyWalletApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<OtpBloc>(
          create: (_) => getIt<OtpBloc>(),
        ),
        BlocProvider<QrBloc>(
          create: (_) => getIt<QrBloc>(),
        ),
      ],
      child: MaterialApp(
        title: 'Loyalty Wallet',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.orange),
          useMaterial3: true,
        ),
        home: const _AuthGate(),
      ),
    );
  }
}

class _AuthGate extends StatelessWidget {
  const _AuthGate();

  Future<bool> _isLoggedIn() async {
    final secureStorage = getIt<SecureStorageService>();
    final token = await secureStorage.getAccessToken();
    return token != null && token.isNotEmpty;
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: _isLoggedIn(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        final isLoggedIn = snapshot.data ?? false;
        if (!isLoggedIn) {
          return const OtpRequestPage();
        }
        return const MainPage();
      },
    );
  }
}
