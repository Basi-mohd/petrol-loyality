import 'package:equatable/equatable.dart';

class Employee extends Equatable {
  final String id;
  final String name;
  final String email;
  final String? phoneNumber;

  const Employee({
    required this.id,
    required this.name,
    required this.email,
    this.phoneNumber,
  });

  @override
  List<Object?> get props => [id, name, email, phoneNumber];
}
