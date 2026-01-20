import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:employee/core/di/service_locator.dart';
import 'package:employee/core/services/crypto/crypto_service.dart';
import 'package:employee/core/services/device/device_service.dart';
import 'package:employee/core/services/geo/geo_fence_service.dart';
import 'package:employee/core/services/logging/fraud_safe_logger.dart';
import 'package:employee/core/services/sync/sync_service.dart';
import 'package:employee/data/datasources/local/local_datasource.dart';
import 'package:employee/data/datasources/remote/remote_datasource.dart';
import 'package:employee/data/datasources/remote/employee_auth_remote_data_source.dart';
import 'package:employee/data/repositories/auth_repository_impl.dart';
import 'package:employee/data/repositories/transaction_repository_impl.dart';
import 'package:employee/data/datasources/local/database/vault_database.dart';
import 'package:employee/core/network/api_client.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/domain/repositories/auth_repository.dart';
import 'package:employee/domain/repositories/transaction_repository.dart';
import 'package:employee/presentation/bloc/employee_auth/employee_auth_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

Future<void> init() async {
  getIt.registerLazySingleton<FlutterSecureStorage>(
    () => const FlutterSecureStorage(
      aOptions: AndroidOptions(
        encryptedSharedPreferences: true,
      ),
      iOptions: IOSOptions(
        accessibility: KeychainAccessibility.first_unlock_this_device,
      ),
    ),
  );

  getIt.registerLazySingleton<SecureStorageService>(
    () => SecureStorageService(getIt<FlutterSecureStorage>()),
  );

  getIt.registerLazySingleton<Connectivity>(
    () => Connectivity(),
  );

  getIt.registerLazySingleton<FraudSafeLogger>(
    () => FraudSafeLogger(),
  );

  getIt.registerLazySingleton<DeviceService>(
    () => DeviceService(),
  );

  getIt.registerLazySingleton<CryptoService>(
    () => CryptoService(getIt<SecureStorageService>()),
  );

  getIt.registerLazySingleton<GeoFenceService>(
    () => GeoFenceService(),
  );

  getIt.registerLazySingleton<VaultDatabase>(
    () => VaultDatabase(getIt<SecureStorageService>()),
  );

  getIt.registerLazySingleton<ApiClient>(
    () => ApiClient(
      getIt<SecureStorageService>(),
      getIt<CryptoService>(),
      getIt<DeviceService>(),
    ),
  );

  getIt.registerLazySingleton<LocalDataSource>(
    () => LocalDataSourceImpl(getIt<VaultDatabase>()),
  );

  getIt.registerLazySingleton<RemoteDataSource>(
    () => RemoteDataSourceImpl(getIt<ApiClient>()),
  );

  getIt.registerLazySingleton<EmployeeAuthRemoteDataSource>(
    () => EmployeeAuthRemoteDataSource(getIt<ApiClient>()),
  );

  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: getIt<RemoteDataSource>(),
      localDataSource: getIt<LocalDataSource>(),
      secureStorage: getIt<SecureStorageService>(),
    ),
  );

  getIt.registerFactory<EmployeeAuthBloc>(
    () => EmployeeAuthBloc(
      remoteDataSource: getIt<EmployeeAuthRemoteDataSource>(),
      secureStorage: getIt<SecureStorageService>(),
    ),
  );

  getIt.registerLazySingleton<TransactionRepository>(
    () => TransactionRepositoryImpl(
      remoteDataSource: getIt<RemoteDataSource>(),
      localDataSource: getIt<LocalDataSource>(),
      cryptoService: getIt<CryptoService>(),
      geoFenceService: getIt<GeoFenceService>(),
      deviceService: getIt<DeviceService>(),
      secureStorage: getIt<SecureStorageService>(),
    ),
  );

  getIt.registerLazySingleton<SyncService>(
    () => SyncService(
      transactionRepository: getIt<TransactionRepository>(),
      localDataSource: getIt<LocalDataSource>(),
      remoteDataSource: getIt<RemoteDataSource>(),
      connectivity: getIt<Connectivity>(),
    ),
  );

  await getIt<VaultDatabase>().initialize();
  await getIt<CryptoService>().initialize();
}
