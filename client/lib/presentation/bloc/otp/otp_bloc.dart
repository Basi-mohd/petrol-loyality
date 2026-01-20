import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:client/data/datasources/remote/otp_remote_data_source.dart';
import 'package:client/core/storage/secure_storage_service.dart';
import 'package:client/core/utils/constants.dart';

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
  final String customerId;
  final String qrToken;

  const OtpVerifySuccess({
    required this.accessToken,
    required this.refreshToken,
    required this.customerId,
    required this.qrToken,
  });

  @override
  List<Object> get props => [accessToken, refreshToken, customerId, qrToken];
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
      final otpId = response['otpId'] as String?;
      if (otpId == null || otpId.isEmpty) {
        emit(OtpError('Invalid response: otpId is missing'));
        return;
      }
      emit(OtpRequestSuccess(otpId));
    } catch (e) {
      String errorMessage = 'Failed to request OTP';
      if (e.toString().contains('timeout') || e.toString().contains('Connection')) {
        errorMessage = 'Cannot connect to server. Please check:\n1. Backend is running\n2. Correct IP address configured\n3. Device and server on same network';
      } else if (e.toString().contains('Failed to request OTP')) {
        errorMessage = e.toString().replaceFirst('Exception: ', '');
      } else {
        errorMessage = e.toString();
      }
      emit(OtpError(errorMessage));
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

      final accessToken = response['accessToken'] as String?;
      final refreshToken = response['refreshToken'] as String?;
      final customer = response['customer'] as Map<String, dynamic>?;
      final customerId = customer?['id'] as String?;
      final qrToken = customer?['qrToken'] as String?;

      if (accessToken == null || refreshToken == null || customerId == null || qrToken == null) {
        emit(OtpError('Invalid response: missing required fields'));
        return;
      }

      await secureStorage.saveAccessToken(accessToken);
      await secureStorage.saveRefreshToken(refreshToken);
      await secureStorage.saveToken(
        AppConstants.customerIdKey,
        customerId,
      );

      emit(OtpVerifySuccess(
        accessToken: accessToken,
        refreshToken: refreshToken,
        customerId: customerId,
        qrToken: qrToken,
      ));
    } catch (e) {
      emit(OtpError(e.toString()));
    }
  }
}
