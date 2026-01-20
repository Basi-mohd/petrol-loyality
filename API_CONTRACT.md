# API Contract - OTP-Based Customer Onboarding & QR Identity

## Base URL
```
Production: https://api.example.com/api/v1
Development: https://api-dev.example.com/api/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. Request OTP
**POST** `/otp/request`

Request an OTP to be sent via SMS to the provided phone number.

**Headers:**
```
Content-Type: application/json
x-device-id: <unique-device-identifier>
```

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "deviceId": "device-unique-id"
}
```

**Response:** `200 OK`
```json
{
  "otpId": "uuid-of-otp",
  "expiresInMinutes": 2
}
```

**Error Responses:**
- `400 Bad Request` - Invalid phone number format
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

### 2. Verify OTP
**POST** `/otp/verify`

Verify the OTP code and complete customer onboarding/login.

**Headers:**
```
Content-Type: application/json
x-device-id: <unique-device-identifier>
```

**Request Body:**
```json
{
  "otpId": "uuid-of-otp",
  "code": "123456",
  "phoneNumber": "+1234567890",
  "deviceId": "device-unique-id"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "customer": {
    "id": "customer-uuid",
    "phoneNumber": "+1234567890",
    "qrToken": "secure-random-qr-token"
  },
  "isNewCustomer": true
}
```

**Error Responses:**
- `400 Bad Request` - Invalid OTP, expired, or already verified
- `401 Unauthorized` - Device mismatch or invalid credentials
- `500 Internal Server Error` - Server error

---

### 3. Get QR Identity
**GET** `/customer/qr`

Retrieve the active QR identity token for the authenticated customer.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "qrToken": "secure-random-qr-token",
  "customerId": "customer-uuid"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - QR identity not found
- `500 Internal Server Error` - Server error

---

### 4. Regenerate QR Identity
**POST** `/customer/qr/regenerate`

Generate a new QR identity token, invalidating the previous one.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "customerId": "customer-uuid"
}
```

**Response:** `200 OK`
```json
{
  "qrToken": "new-secure-random-qr-token"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token or unauthorized customer
- `500 Internal Server Error` - Server error

---

## Rate Limiting

- **OTP Request:** Maximum 3 requests per phone number per device per 5-minute window
- **OTP Verification:** Maximum 5 attempts per OTP
- **General API:** 100 requests per minute per IP

Rate limit headers:
```
X-RateLimit-Limit: 3
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1633024800
```

---

## Device Binding

All OTP endpoints require a `x-device-id` header that uniquely identifies the device. This enables:
- Per-device rate limiting
- Device binding for security
- Prevention of OTP sharing across devices

---

## OTP Specifications

- **Length:** 6 digits
- **Expiry:** 2 minutes from generation
- **Generation:** Cryptographically secure random (crypto.randomBytes)
- **Max Attempts:** 5 verification attempts per OTP
- **Rate Limit:** 3 requests per phone/device per 5 minutes

---

## QR Token Specifications

- **Length:** 32 characters (base64url encoded)
- **Format:** Base64URL
- **Uniqueness:** Guaranteed unique per customer
- **Regeneration:** Previous tokens are deactivated (not deleted)
- **Mapping:** One-to-one mapping to immutable customer ID

---

## Error Response Format

All errors follow this format:
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
