import 'package:dartz/dartz.dart';
import 'package:client/core/error/failures.dart';
import 'package:client/domain/entities/user.dart';
import 'package:client/domain/repositories/auth_repository.dart';

class LoginUseCase {
  final AuthRepository repository;

  LoginUseCase(this.repository);

  Future<Either<Failure, User>> call(String email, String password) async {
    return await repository.login(email, password);
  }
}
