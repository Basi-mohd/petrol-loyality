import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:client/core/di/service_locator.dart';
import 'package:client/core/database/app_database.dart';
import 'package:client/core/database/database_helper.dart';
import 'package:client/core/network/api_client.dart';
import 'package:client/core/network/network_info.dart';
import 'package:client/core/storage/secure_storage_service.dart';
import 'package:client/data/datasources/local/local_data_source.dart';
import 'package:client/data/datasources/remote/remote_data_source.dart';
import 'package:client/data/datasources/remote/otp_remote_data_source.dart';
import 'package:client/data/datasources/local/qr_cache_data_source.dart';
import 'package:client/data/repositories/auth_repository_impl.dart';
import 'package:client/domain/repositories/auth_repository.dart';
import 'package:client/presentation/bloc/otp/otp_bloc.dart';
import 'package:client/presentation/bloc/qr/qr_bloc.dart';

Future<void> init() async {
  getIt.registerLazySingleton<SecureStorageService>(
    () => SecureStorageService(),
  );

  getIt.registerLazySingleton<DatabaseHelper>(
    () => DatabaseHelper.instance,
  );

  getIt.registerLazySingleton<AppDatabase>(
    () => AppDatabase(getIt<DatabaseHelper>()),
  );

  getIt.registerLazySingleton<Connectivity>(
    () => Connectivity(),
  );

  getIt.registerLazySingleton<NetworkInfo>(
    () => NetworkInfoImpl(getIt<Connectivity>()),
  );

  getIt.registerLazySingleton<ApiClient>(
    () => ApiClient(getIt<SecureStorageService>()),
  );

  getIt.registerLazySingleton<LocalDataSource>(
    () => LocalDataSourceImpl(getIt<DatabaseHelper>()),
  );

  getIt.registerLazySingleton<RemoteDataSource>(
    () => RemoteDataSourceImpl(getIt<ApiClient>()),
  );

  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepositoryImpl(
      remoteDataSource: getIt<RemoteDataSource>(),
      localDataSource: getIt<LocalDataSource>(),
      networkInfo: getIt<NetworkInfo>(),
      secureStorage: getIt<SecureStorageService>(),
    ),
  );

  getIt.registerLazySingleton<OtpRemoteDataSource>(
    () => OtpRemoteDataSource(getIt<ApiClient>()),
  );

  getIt.registerLazySingleton<QrCacheDataSource>(
    () => QrCacheDataSource(getIt<DatabaseHelper>()),
  );

  getIt.registerFactory<OtpBloc>(
    () => OtpBloc(
      remoteDataSource: getIt<OtpRemoteDataSource>(),
      secureStorage: getIt<SecureStorageService>(),
    ),
  );

  getIt.registerFactory<QrBloc>(
    () => QrBloc(
      remoteDataSource: getIt<OtpRemoteDataSource>(),
      cacheDataSource: getIt<QrCacheDataSource>(),
      secureStorage: getIt<SecureStorageService>(),
    ),
  );

  await getIt<AppDatabase>().initialize();
}
