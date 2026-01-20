import 'package:dartz/dartz.dart';
import 'package:employee/core/error/failures.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/data/datasources/local/local_datasource.dart';
import 'package:employee/data/datasources/remote/remote_datasource.dart';
import 'package:employee/domain/entities/employee.dart';
import 'package:employee/domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final RemoteDataSource _remoteDataSource;
  final LocalDataSource _localDataSource;
  final SecureStorageService _secureStorage;

  AuthRepositoryImpl({
    required RemoteDataSource remoteDataSource,
    required LocalDataSource localDataSource,
    required SecureStorageService secureStorage,
  })  : _remoteDataSource = remoteDataSource,
        _localDataSource = localDataSource,
        _secureStorage = secureStorage;

  @override
  Future<Either<Failure, Map<String, dynamic>>> login(
    String username,
    String password,
  ) async {
    try {
      final response = await _remoteDataSource.login(username, password);
      await _secureStorage.saveJwtToken(response['access_token'] as String);
      if (response['refresh_token'] != null) {
        await _secureStorage.saveRefreshToken(response['refresh_token'] as String);
      }
      if (response['employee'] != null) {
        await _secureStorage.saveEmployeeId((response['employee'] as Map)['id'] as String);
      }
      return Right(response);
    } on Failure catch (e) {
      return Left(e);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, Employee>> getEmployeeProfile() async {
    try {
      final response = await _remoteDataSource.getEmployeeProfile();
      final employee = Employee(
        id: response['id'] as String,
        name: response['name'] as String,
        email: response['email'] as String,
        phoneNumber: response['phone_number'] as String?,
      );
      return Right(employee);
    } on Failure catch (e) {
      return Left(e);
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }

  @override
  Future<void> logout() async {
    await _secureStorage.clearAll();
  }
}
