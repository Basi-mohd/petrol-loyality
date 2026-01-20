import 'package:employee/core/error/failures.dart';
import 'package:employee/domain/entities/employee.dart';
import 'package:dartz/dartz.dart';

abstract class AuthRepository {
  Future<Either<Failure, Map<String, dynamic>>> login(String username, String password);
  Future<Either<Failure, Employee>> getEmployeeProfile();
  Future<void> logout();
}
