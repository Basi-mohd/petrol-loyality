import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String email;
  final String? name;
  final String? phone;

  const User({
    required this.id,
    required this.email,
    this.name,
    this.phone,
  });

  @override
  List<Object?> get props => [id, email, name, phone];
}
