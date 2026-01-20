import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:client/presentation/bloc/qr/qr_bloc.dart';
import 'package:client/core/storage/secure_storage_service.dart';
import 'package:client/core/utils/constants.dart';

class QrIdentityPage extends StatefulWidget {
  const QrIdentityPage({super.key});

  @override
  State<QrIdentityPage> createState() => _QrIdentityPageState();
}

class _QrIdentityPageState extends State<QrIdentityPage> {
  String? _cachedQrToken;
  String? _customerId;

  @override
  void initState() {
    super.initState();
    _loadCachedQr();
    context.read<QrBloc>().add(LoadQrIdentityEvent());
  }

  Future<void> _loadCachedQr() async {
    final secureStorage = SecureStorageService();
    final customerId = await secureStorage.getToken('customer_id');
    if (customerId != null) {
      setState(() {
        _customerId = customerId;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My QR Code'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              if (_customerId != null) {
                context.read<QrBloc>().add(RegenerateQrIdentityEvent(_customerId!));
              }
            },
          ),
        ],
      ),
      body: BlocConsumer<QrBloc, QrState>(
        listener: (context, state) {
          if (state is QrError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: Colors.red,
              ),
            );
          } else if (state is QrLoaded || state is QrRegenerated) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('QR code updated'),
                backgroundColor: Colors.green,
              ),
            );
          }
        },
        builder: (context, state) {
          String? qrToken;
          bool isLoading = false;

          if (state is QrLoaded) {
            qrToken = state.qrToken;
          } else if (state is QrRegenerated) {
            qrToken = state.qrToken;
          } else if (state is QrLoading) {
            isLoading = true;
            qrToken = _cachedQrToken;
          } else if (state is QrError && _cachedQrToken != null) {
            qrToken = _cachedQrToken;
          } else {
            qrToken = _cachedQrToken;
          }

          if (qrToken == null && !isLoading) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.qr_code_scanner,
                    size: 80,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No QR code available',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            );
          }

          return Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Scan this QR code at the petrol pump',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 10,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: isLoading
                        ? const SizedBox(
                            width: 250,
                            height: 250,
                            child: Center(
                              child: CircularProgressIndicator(),
                            ),
                          )
                        : QrImageView(
                            data: qrToken ?? '',
                            version: QrVersions.auto,
                            size: 250,
                            backgroundColor: Colors.white,
                          ),
                  ),
                  const SizedBox(height: 32),
                  if (state is QrError && _cachedQrToken != null)
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.orange.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Row(
                        children: [
                          Icon(Icons.info_outline, color: Colors.orange),
                          SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              'Showing cached QR code. Please check your internet connection.',
                              style: TextStyle(color: Colors.orange),
                            ),
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
