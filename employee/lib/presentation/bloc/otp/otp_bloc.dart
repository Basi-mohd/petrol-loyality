import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:employee/data/datasources/remote/otp_remote_data_source.dart';
import 'package:employee/core/services/storage/secure_storage_service.dart';
import 'package:employee/core/utils/constants.dart';

abstract class OtpEvent extends Equatable {
  const OtpEvent();

  @override
  List<Object> get props => [];
}

class RequestOtpEvent extends OtpEvent {
  final String phoneNumber;
  final String deviceId;

  const RequestOtpEvent({
    required this.phoneNumber,
    required this.deviceId,
  });

  @override
  List<Object> get props => [phoneNumber, deviceId];
}

class VerifyOtpEvent extends OtpEvent {
  final String otpId;
  final String code;
  final String phoneNumber;
  final String deviceId;

  const VerifyOtpEvent({
    required this.otpId,
    required this.code,
    required this.phoneNumber,
    required this.deviceId,
  });

  @override
  List<Object> get props => [otpId, code, phoneNumber, deviceId];
}

abstract class OtpState extends Equatable {
  const OtpState();

  @override
  List<Object> get props => [];
}

class OtpInitial extends OtpState {}

class OtpLoading extends OtpState {}

class OtpRequestSuccess extends OtpState {
  final String otpId;

  const OtpRequestSuccess(this.otpId);

  @override
  List<Object> get props => [otpId];
}

class OtpVerifySuccess extends OtpState {
  final String accessToken;
  final String refreshToken;
  final String employeeId;

  const OtpVerifySuccess({
    required this.accessToken,
    required this.refreshToken,
    required this.employeeId,
  });

  @override
  List<Object> get props => [accessToken, refreshToken, employeeId];
}

class OtpError extends OtpState {
  final String message;

  const OtpError(this.message);

  @override
  List<Object> get props => [message];
}

class OtpBloc extends Bloc<OtpEvent, OtpState> {
  final OtpRemoteDataSource remoteDataSource;
  final SecureStorageService secureStorage;

  OtpBloc({
    required this.remoteDataSource,
    required this.secureStorage,
  }) : super(OtpInitial()) {
    on<RequestOtpEvent>(_onRequestOtp);
    on<VerifyOtpEvent>(_onVerifyOtp);
  }

  Future<void> _onRequestOtp(
    RequestOtpEvent event,
    Emitter<OtpState> emit,
  ) async {
    emit(OtpLoading());
    try {
      final response = await remoteDataSource.requestOtp(
        phoneNumber: event.phoneNumber,
        deviceId: event.deviceId,
      );
      emit(OtpRequestSuccess(response['otpId']));
    } catch (e) {
      emit(OtpError(e.toString()));
    }
  }

  Future<void> _onVerifyOtp(
    VerifyOtpEvent event,
    Emitter<OtpState> emit,
  ) async {
    emit(OtpLoading());
    try {
      final response = await remoteDataSource.verifyOtp(
        otpId: event.otpId,
        code: event.code,
        phoneNumber: event.phoneNumber,
        deviceId: event.deviceId,
      );

      await secureStorage.saveAccessToken(response['accessToken']);
      await secureStorage.saveRefreshToken(response['refreshToken']);
      await secureStorage.saveToken(
        AppConstants.employeeIdKey,
        response['employee']['id'],
      );

      emit(OtpVerifySuccess(
        accessToken: response['accessToken'],
        refreshToken: response['refreshToken'],
        employeeId: response['employee']['id'],
      ));
    } catch (e) {
      emit(OtpError(e.toString()));
    }
  }
}
