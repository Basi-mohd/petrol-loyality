import 'package:flutter/material.dart';
import 'dart:async';
import 'package:employee/core/config/app_config.dart';
import 'package:employee/core/config/environment.dart';
import 'package:employee/core/di/injection_container.dart' as di;
import 'package:employee/core/error/error_handler.dart';
import 'package:employee/core/di/service_locator.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/presentation/pages/main/main_page.dart';
import 'package:employee/presentation/pages/auth/employee_login_page.dart';
import 'package:employee/presentation/bloc/employee_auth/employee_auth_bloc.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:employee/presentation/navigation/app_router.dart';
void main() async {
  runZonedGuarded(
    () async {
      WidgetsFlutterBinding.ensureInitialized();

      ErrorHandler.setupErrorHandling();

      AppConfig.setEnvironment(Environment.dev);

      await di.init();

      runApp(const EmployeeApp());
    },
    (error, stack) {
      ErrorHandler.logError(error, stack);
    },
  );
}

class EmployeeApp extends StatelessWidget {
  const EmployeeApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<EmployeeAuthBloc>(
          create: (_) => getIt<EmployeeAuthBloc>(),
        ),
      ],
      child: MaterialApp(
        title: 'Employee App',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
          useMaterial3: true,
        ),
        onGenerateRoute: AppRouter.generateRoute,
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
          return const EmployeeLoginPage();
        }
        return const MainPage();
      },
    );
  }
}
