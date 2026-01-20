import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:client/data/datasources/remote/otp_remote_data_source.dart';
import 'package:client/data/datasources/local/qr_cache_data_source.dart';
import 'package:client/core/storage/secure_storage_service.dart';
import 'package:client/core/utils/constants.dart';

abstract class QrEvent extends Equatable {
  const QrEvent();

  @override
  List<Object> get props => [];
}

class LoadQrIdentityEvent extends QrEvent {}

class RegenerateQrIdentityEvent extends QrEvent {
  final String customerId;

  const RegenerateQrIdentityEvent(this.customerId);

  @override
  List<Object> get props => [customerId];
}

abstract class QrState extends Equatable {
  const QrState();

  @override
  List<Object> get props => [];
}

class QrInitial extends QrState {}

class QrLoading extends QrState {}

class QrLoaded extends QrState {
  final String qrToken;

  const QrLoaded(this.qrToken);

  @override
  List<Object> get props => [qrToken];
}

class QrRegenerated extends QrState {
  final String qrToken;

  const QrRegenerated(this.qrToken);

  @override
  List<Object> get props => [qrToken];
}

class QrError extends QrState {
  final String message;

  const QrError(this.message);

  @override
  List<Object> get props => [message];
}

class QrBloc extends Bloc<QrEvent, QrState> {
  final OtpRemoteDataSource remoteDataSource;
  final QrCacheDataSource cacheDataSource;
  final SecureStorageService secureStorage;

  QrBloc({
    required this.remoteDataSource,
    required this.cacheDataSource,
    required this.secureStorage,
  }) : super(QrInitial()) {
    on<LoadQrIdentityEvent>(_onLoadQrIdentity);
    on<RegenerateQrIdentityEvent>(_onRegenerateQrIdentity);
  }

  Future<void> _onLoadQrIdentity(
    LoadQrIdentityEvent event,
    Emitter<QrState> emit,
  ) async {
    emit(QrLoading());

    try {
      final customerId = await secureStorage.getToken(AppConstants.customerIdKey);
      if (customerId != null) {
        try {
          final cached = await cacheDataSource.getCachedQrIdentity(customerId);
          if (cached != null && cached['qrToken'] != null) {
            emit(QrLoaded(cached['qrToken'] as String));
          }
        } catch (e) {
        }
      }

      final response = await remoteDataSource.getQrIdentity();
      final qrToken = response['qrToken'];
      final responseCustomerId = response['customerId'];

      if (responseCustomerId != null) {
        await cacheDataSource.cacheQrIdentity(
          customerId: responseCustomerId,
          qrToken: qrToken,
        );
      }

      emit(QrLoaded(qrToken));
    } catch (e) {
      final customerId = await secureStorage.getToken(AppConstants.customerIdKey);
      if (customerId != null) {
        try {
          final cached = await cacheDataSource.getCachedQrIdentity(customerId);
          if (cached != null && cached['qrToken'] != null) {
            emit(QrLoaded(cached['qrToken'] as String));
            return;
          }
        } catch (e) {
        }
      }
      emit(QrError(e.toString()));
    }
  }

  Future<void> _onRegenerateQrIdentity(
    RegenerateQrIdentityEvent event,
    Emitter<QrState> emit,
  ) async {
    emit(QrLoading());
    try {
      final response = await remoteDataSource.regenerateQrIdentity(event.customerId);
      final qrToken = response['qrToken'];

      await cacheDataSource.cacheQrIdentity(
        customerId: event.customerId,
        qrToken: qrToken,
      );

      emit(QrRegenerated(qrToken));
    } catch (e) {
      emit(QrError(e.toString()));
    }
  }
}
