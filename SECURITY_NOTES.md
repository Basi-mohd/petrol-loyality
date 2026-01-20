# Security Notes - Banking-Grade OTP & QR Identity System

## Overview
This document outlines the security measures implemented in the OTP-based customer onboarding and QR identity generation system, following banking-grade security practices.

---

## OTP Security

### 1. Cryptographic Random Generation
- **Implementation:** Uses Node.js `crypto.randomBytes()` for cryptographically secure random number generation
- **OTP Range:** 100000-999999 (6 digits)
- **Entropy:** 3 bytes of random data (24 bits of entropy)
- **No Predictability:** OTPs cannot be predicted or guessed

### 2. Expiry Management
- **Expiry Time:** 2 minutes from generation
- **Server-Side Validation:** Expiry checked server-side only
- **Automatic Cleanup:** Expired OTPs are periodically deleted from database

### 3. Rate Limiting & Anti-Brute Force
- **Per-Device Rate Limit:** 3 OTP requests per phone/device per 5-minute window
- **Verification Attempts:** Maximum 5 attempts per OTP
- **Redis-Based Tracking:** Rate limits tracked in Redis for distributed systems
- **Progressive Lockout:** After max attempts, OTP is marked as exhausted

### 4. Device Binding
- **Device ID Required:** All OTP operations require unique device identifier
- **Binding Storage:** Device-phone bindings stored in PostgreSQL
- **Verification:** OTP verification validates device matches request device
- **Prevention:** Prevents OTP sharing across devices

---

## QR Identity Security

### 1. Token Generation
- **Random Source:** `crypto.randomBytes(32)` - 256 bits of entropy
- **Encoding:** Base64URL encoding (URL-safe, no padding)
- **Length:** 32 characters
- **Uniqueness:** Database-enforced unique constraint
- **Non-Guessable:** Cryptographically random, cannot be predicted

### 2. Immutable Customer Mapping
- **One-to-One:** Each QR token maps to exactly one customer ID
- **Immutable ID:** Customer ID never changes, even if QR regenerated
- **Append-Only:** QR identity history maintained (deactivation, not deletion)
- **Audit Trail:** All QR generation/regeneration events logged

### 3. Regeneration Security
- **Previous Deactivation:** Old QR tokens are deactivated (not deleted)
- **Server-Side Only:** QR regeneration requires authentication
- **Authorization Check:** Customers can only regenerate their own QR
- **Audit Logging:** All regeneration events logged with timestamp

---

## Authentication & Authorization

### 1. JWT Tokens
- **Access Token:** Short-lived (1 hour default)
- **Refresh Token:** Long-lived (7 days default)
- **Secret Management:** Secrets stored in environment variables (.env)
- **No Hardcoding:** Zero secrets in source code
- **Token Validation:** Server-side validation on every request

### 2. Secure Storage (Flutter)
- **Storage:** `flutter_secure_storage` (encrypted keychain/keystore)
- **Tokens:** Access and refresh tokens stored securely
- **No Plaintext:** Tokens never stored in plaintext
- **Platform Security:** Leverages iOS Keychain and Android Keystore

---

## Database Security

### 1. Append-Only Ledger Model
- **Immutable Records:** Critical writes are append-only
- **Audit Trail:** All customer creation events logged
- **Transaction Integrity:** PostgreSQL ACID guarantees
- **No Deletion:** Historical records preserved for audit

### 2. Data Protection
- **OTP Storage:** OTPs stored with expiry timestamps
- **Hashed Storage:** Consider hashing OTPs in production (optional enhancement)
- **Encryption at Rest:** Database encryption recommended for production
- **Backup Security:** Encrypted backups required

---

## Network Security

### 1. HTTPS Only
- **TLS 1.2+:** All API communication over HTTPS
- **Certificate Pinning:** Recommended for mobile apps (optional)
- **No HTTP:** HTTP endpoints disabled in production

### 2. Request Validation
- **Input Sanitization:** All inputs validated and sanitized
- **Phone Format:** E.164 format validation
- **Device ID:** Device ID format validation
- **SQL Injection:** TypeORM parameterized queries prevent SQL injection

---

## SMS Security (MSG91)

### 1. API Security
- **API Key:** Stored in environment variables
- **No Exposure:** API keys never exposed to client
- **Template ID:** Approved MSG91 template required
- **Rate Limiting:** MSG91 provider-level rate limiting

### 2. Message Content
- **No Sensitive Data:** OTP only, no customer information
- **Template-Based:** Uses MSG91 approved templates
- **Compliance:** Follows SMS regulatory requirements

---

## Rate Limiting Architecture

### 1. Multi-Layer Protection
- **Application Level:** NestJS middleware for general API rate limiting
- **OTP Service:** Service-level rate limiting per phone/device
- **Redis-Based:** Distributed rate limiting using Redis
- **Sliding Window:** Time-window based rate limiting

### 2. Rate Limit Headers
- **Transparency:** Rate limit status in response headers
- **Client Guidance:** Headers indicate when limits reset
- **Graceful Degradation:** Clear error messages for rate limit exceeded

---

## Audit Logging

### 1. Onboarding Events
- **OTP Request:** Logged with phone, device, timestamp, IP
- **OTP Verification:** Logged with success/failure, attempts
- **Customer Creation:** Logged with customer ID, phone, timestamp
- **QR Generation:** Logged with customer ID, QR token, timestamp

### 2. Security Events
- **Failed Attempts:** All failed OTP attempts logged
- **Rate Limit Hits:** Rate limit violations logged
- **Device Mismatches:** Device binding violations logged
- **Unauthorized Access:** Unauthorized API access attempts logged

---

## Flutter App Security

### 1. Secure Storage
- **Token Storage:** Secure storage for JWT tokens
- **QR Cache:** Offline QR cache encrypted
- **No Logging:** Tokens never logged to console
- **Memory Safety:** Tokens cleared from memory after use

### 2. Offline QR Cache
- **Encrypted Storage:** QR tokens cached in encrypted SQLite
- **Fallback:** Offline QR display when network unavailable
- **Expiry Handling:** Cache expiry logic for stale QR codes
- **Privacy:** QR tokens treated as sensitive data

### 3. Device Identification
- **Unique ID:** Platform-specific device ID generation
- **Persistence:** Device ID persisted securely
- **Privacy:** Device ID not linked to personal information

---

## Environment & Secrets Management

### 1. Configuration
- **Environment Variables:** All secrets in .env file
- **No Hardcoding:** Zero secrets in source code
- **Git Ignore:** .env files excluded from version control
- **Separate Environments:** Dev/staging/prod environment separation

### 2. Required Secrets
```
JWT_SECRET=<256-bit-random-secret>
JWT_REFRESH_SECRET=<256-bit-random-secret>
MSG91_API_KEY=<msg91-api-key>
MSG91_TEMPLATE_ID=<approved-template-id>
DB_PASSWORD=<database-password>
REDIS_PASSWORD=<redis-password>
```

---

## Production Recommendations

### 1. Additional Security Measures
- **OTP Hashing:** Consider hashing OTPs before storage
- **Certificate Pinning:** Implement for mobile apps
- **WAF:** Web Application Firewall for API protection
- **DDoS Protection:** Cloud-based DDoS mitigation
- **Intrusion Detection:** Monitor for suspicious patterns

### 2. Monitoring & Alerting
- **Failed Login Alerts:** Alert on multiple failed OTP attempts
- **Rate Limit Alerts:** Alert on rate limit violations
- **Anomaly Detection:** Detect unusual patterns
- **Security Logs:** Centralized security event logging

### 3. Compliance
- **GDPR:** Customer data handling compliance
- **PCI DSS:** If handling payment data
- **SOC 2:** Security controls documentation
- **Regular Audits:** Security audits and penetration testing

---

## Threat Model

### Mitigated Threats
1. ✅ **OTP Guessing:** Cryptographically random, rate-limited
2. ✅ **OTP Replay:** Expiry and single-use verification
3. ✅ **Brute Force:** Rate limiting and attempt limits
4. ✅ **Device Sharing:** Device binding prevents cross-device use
5. ✅ **QR Token Guessing:** Cryptographically random, unique
6. ✅ **Token Theft:** Secure storage, HTTPS, JWT expiration
7. ✅ **Man-in-the-Middle:** HTTPS, certificate pinning (recommended)

### Remaining Risks
1. **SIM Swapping:** Mitigated by device binding, but SMS-based OTP vulnerable
2. **Social Engineering:** User education required
3. **Malware:** Device compromise can access secure storage
4. **Server Compromise:** Requires defense-in-depth

---

## Security Best Practices Followed

1. ✅ **Defense in Depth:** Multiple security layers
2. ✅ **Least Privilege:** Minimal required permissions
3. ✅ **Fail Secure:** Errors don't leak information
4. ✅ **Secure by Default:** Secure configurations
5. ✅ **No Security Through Obscurity:** Open security model
6. ✅ **Audit Everything:** Comprehensive logging
7. ✅ **Encryption:** Data in transit and at rest
8. ✅ **Input Validation:** All inputs validated
9. ✅ **Output Encoding:** Prevent injection attacks
10. ✅ **Error Handling:** Secure error messages

---

## Incident Response

### Security Incident Procedure
1. **Detection:** Automated monitoring detects anomalies
2. **Containment:** Immediate rate limiting and blocking
3. **Investigation:** Audit logs analyzed
4. **Remediation:** Vulnerabilities patched
5. **Communication:** Affected users notified
6. **Post-Mortem:** Security review and improvements

---

## Conclusion

This system implements banking-grade security practices with:
- Cryptographically secure OTP generation
- Multi-layer rate limiting
- Device binding
- Secure QR token generation
- Comprehensive audit logging
- Secure token storage
- No hardcoded secrets

All critical security measures are server-side only, preventing client-side tampering.
