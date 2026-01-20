import 'package:dartz/dartz.dart';
import 'package:client/core/error/failures.dart';
import 'package:client/core/error/error_handler.dart';
import 'package:client/core/network/network_info.dart';
import 'package:client/core/storage/secure_storage_service.dart';
import 'package:client/data/datasources/local/local_data_source.dart';
import 'package:client/data/datasources/remote/remote_data_source.dart';
import 'package:client/domain/entities/user.dart';
import 'package:client/domain/repositories/auth_repository.dart';
import 'package:client/data/models/user_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final RemoteDataSource remoteDataSource;
  final LocalDataSource localDataSource;
  final NetworkInfo networkInfo;
  final SecureStorageService secureStorage;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
    required this.networkInfo,
    required this.secureStorage,
  });

  @override
  Future<Either<Failure, User>> login(String email, String password) async {
    if (await networkInfo.isConnected) {
      try {
        final userModel = await remoteDataSource.login(email, password);
        await localDataSource.cacheData('current_user', userModel.toJson());
        return Right(userModel);
      } on Exception catch (e) {
        return Left(ErrorHandler.mapExceptionToFailure(e));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }

  @override
  Future<Either<Failure, void>> logout() async {
    if (await networkInfo.isConnected) {
      try {
        await remoteDataSource.logout();
      } on Exception catch (e) {
        return Left(ErrorHandler.mapExceptionToFailure(e));
      }
    }
    
    await secureStorage.clearTokens();
    await localDataSource.clearCache('current_user');
    return const Right(null);
  }

  @override
  Future<Either<Failure, User?>> getCurrentUser() async {
    try {
      if (await networkInfo.isConnected) {
        final user = await remoteDataSource.getCurrentUser();
        if (user != null) {
          await localDataSource.cacheData('current_user', user.toJson());
          return Right(user);
        }
      }
      
      final cached = await localDataSource.getCachedData('current_user');
      if (cached != null) {
        return Right(UserModel.fromJson(cached));
      }
      
      return const Right(null);
    } on Exception catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, void>> refreshToken() async {
    if (await networkInfo.isConnected) {
      try {
        final refreshToken = await secureStorage.getRefreshToken();
        if (refreshToken == null) {
          return const Left(AuthenticationFailure('No refresh token available'));
        }
        
        return const Right(null);
      } on Exception catch (e) {
        return Left(ErrorHandler.mapExceptionToFailure(e));
      }
    } else {
      return const Left(NetworkFailure('No internet connection'));
    }
  }
}
