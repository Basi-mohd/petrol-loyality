import 'package:flutter/material.dart';
import 'package:employee/core/di/service_locator.dart';
import 'package:employee/core/services/sync/sync_service.dart';
import 'package:employee/data/datasources/local/local_datasource.dart';
import 'package:intl/intl.dart';

class SyncStatusPage extends StatefulWidget {
  const SyncStatusPage({super.key});

  @override
  State<SyncStatusPage> createState() => _SyncStatusPageState();
}

class _SyncStatusPageState extends State<SyncStatusPage> {
  Map<String, dynamic> _syncStatus = {};
  bool _isLoading = true;
  bool _isSyncing = false;

  @override
  void initState() {
    super.initState();
    _loadSyncStatus();
  }

  Future<void> _loadSyncStatus() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final localDataSource = getIt<LocalDataSource>();
      final status = await localDataSource.getSyncStatus();
      setState(() {
        _syncStatus = status;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading sync status: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _triggerSync() async {
    setState(() {
      _isSyncing = true;
    });

    try {
      final syncService = getIt<SyncService>();
      await syncService.syncPendingTransactions();
      await _loadSyncStatus();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Sync completed')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sync failed: $e')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSyncing = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sync Status'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadSyncStatus,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(
                                _syncStatus['status'] == 'idle'
                                    ? Icons.check_circle
                                    : _syncStatus['status'] == 'error'
                                        ? Icons.error
                                        : Icons.sync,
                                color: _syncStatus['status'] == 'idle'
                                    ? Colors.green
                                    : _syncStatus['status'] == 'error'
                                        ? Colors.red
                                        : Colors.orange,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                'Status: ${(_syncStatus['status'] as String? ?? 'idle').toUpperCase()}',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          _buildStatusRow(
                            'Last Sync',
                            _syncStatus['last_sync_at'] != null
                                ? DateFormat('dd MMM yyyy, HH:mm:ss').format(
                                    DateTime.fromMillisecondsSinceEpoch(
                                      _syncStatus['last_sync_at'] as int,
                                    ),
                                  )
                                : 'Never',
                          ),
                          const Divider(),
                          _buildStatusRow(
                            'Pending',
                            '${_syncStatus['pending_count'] ?? 0}',
                          ),
                          const Divider(),
                          _buildStatusRow(
                            'Failed',
                            '${_syncStatus['failed_count'] ?? 0}',
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: _isSyncing ? null : _triggerSync,
                    icon: _isSyncing
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.sync),
                    label: Text(_isSyncing ? 'Syncing...' : 'Sync Now'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatusRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 16,
              color: Colors.grey,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}
