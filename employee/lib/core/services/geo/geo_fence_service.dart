import 'package:geolocator/geolocator.dart';
import 'package:employee/core/config/app_config.dart';
import 'package:employee/core/error/failures.dart';

class GeoFenceService {
  static const double _defaultLatitude = 0.0;
  static const double _defaultLongitude = 0.0;

  double? _pumpLatitude;
  double? _pumpLongitude;

  void setPumpLocation(double latitude, double longitude) {
    _pumpLatitude = latitude;
    _pumpLongitude = longitude;
  }

  Future<bool> isWithinGeoFence() async {
    if (_pumpLatitude == null || _pumpLongitude == null) {
      return true;
    }

    try {
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: AppConfig.geoLocationTimeout,
      );

      final distance = Geolocator.distanceBetween(
        _pumpLatitude!,
        _pumpLongitude!,
        position.latitude,
        position.longitude,
      );

      return distance <= AppConfig.geoFenceRadiusMeters;
    } catch (e) {
      throw GeoFenceFailure(message: 'Failed to check geo-fence: $e');
    }
  }

  Future<Position> getCurrentLocation() async {
    try {
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw GeoFenceFailure(message: 'Location services are disabled');
      }

      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw GeoFenceFailure(message: 'Location permissions are denied');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw GeoFenceFailure(message: 'Location permissions are permanently denied');
      }

      return await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
        timeLimit: AppConfig.geoLocationTimeout,
      );
    } catch (e) {
      if (e is GeoFenceFailure) {
        rethrow;
      }
      throw GeoFenceFailure(message: 'Failed to get location: $e');
    }
  }

  Future<double> getDistanceFromPump() async {
    if (_pumpLatitude == null || _pumpLongitude == null) {
      return 0.0;
    }

    try {
      final position = await getCurrentLocation();
      return Geolocator.distanceBetween(
        _pumpLatitude!,
        _pumpLongitude!,
        position.latitude,
        position.longitude,
      );
    } catch (e) {
      throw GeoFenceFailure(message: 'Failed to calculate distance: $e');
    }
  }
}
