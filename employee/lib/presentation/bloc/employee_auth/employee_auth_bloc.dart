import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:employee/data/datasources/remote/employee_auth_remote_data_source.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/core/utils/constants.dart';

abstract class EmployeeAuthEvent extends Equatable {
  const EmployeeAuthEvent();

  @override
  List<Object> get props => [];
}

class EmployeeLoginEvent extends EmployeeAuthEvent {
  final String employeeId;
  final String password;

  const EmployeeLoginEvent({
    required this.employeeId,
    required this.password,
  });

  @override
  List<Object> get props => [employeeId, password];
}

abstract class EmployeeAuthState extends Equatable {
  const EmployeeAuthState();

  @override
  List<Object> get props => [];
}

class EmployeeAuthInitial extends EmployeeAuthState {}

class EmployeeAuthLoading extends EmployeeAuthState {}

class EmployeeAuthSuccess extends EmployeeAuthState {
  final String accessToken;
  final String refreshToken;
  final String employeeId;

  const EmployeeAuthSuccess({
    required this.accessToken,
    required this.refreshToken,
    required this.employeeId,
  });

  @override
  List<Object> get props => [accessToken, refreshToken, employeeId];
}

class EmployeeAuthError extends EmployeeAuthState {
  final String message;

  const EmployeeAuthError(this.message);

  @override
  List<Object> get props => [message];
}

class EmployeeAuthBloc
    extends Bloc<EmployeeAuthEvent, EmployeeAuthState> {
  final EmployeeAuthRemoteDataSource remoteDataSource;
  final SecureStorageService secureStorage;

  EmployeeAuthBloc({
    required this.remoteDataSource,
    required this.secureStorage,
  }) : super(EmployeeAuthInitial()) {
    on<EmployeeLoginEvent>(_onLogin);
  }

  Future<void> _onLogin(
    EmployeeLoginEvent event,
    Emitter<EmployeeAuthState> emit,
  ) async {
    emit(EmployeeAuthLoading());
    try {
      final response = await remoteDataSource.login(
        employeeId: event.employeeId,
        password: event.password,
      );

      final accessToken = response['accessToken'] as String?;
      final refreshToken = response['refreshToken'] as String?;
      final employee = response['employee'] as Map<String, dynamic>?;
      final employeeId = employee?['id'] as String?;

      if (accessToken == null ||
          refreshToken == null ||
          employeeId == null) {
        emit(EmployeeAuthError('Invalid response: missing required fields'));
        return;
      }

      await secureStorage.saveAccessToken(accessToken);
      await secureStorage.saveRefreshToken(refreshToken);
      await secureStorage.saveToken(
        AppConstants.employeeIdKey,
        employeeId,
      );

      emit(EmployeeAuthSuccess(
        accessToken: accessToken,
        refreshToken: refreshToken,
        employeeId: employeeId,
      ));
    } catch (e) {
      emit(EmployeeAuthError(e.toString()));
    }
  }
}
