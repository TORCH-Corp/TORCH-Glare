## Security Policy

The Glare team takes security seriously. This document outlines security procedures and policies for the Glare UI component library.

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.6.0 - 1.6.4 | :white_check_mark: |
| < 1.6.0 | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

### Reporting Process

1. **Email**: Send details to glare.security@torchcorp.com
2. **Subject Line**: Start with [SECURITY] for quick identification
3. **Include**:
   - Type of issue
   - Component affected
   - Steps to reproduce
   - Impact of the issue
   - Any potential solutions you've identified

### What to Expect

- **Acknowledgment**: We will acknowledge receipt within 48 hours
- **Assessment**: We'll evaluate the vulnerability and determine its scope
- **Timeline**: We aim to respond with a detailed plan within 7 days
- **Disclosure**: We coordinate disclosure with you once a fix is ready

## Security Update Policy

- Security patches are released as soon as possible
- All security updates will be clearly marked in the CHANGELOG.md file
- Critical updates will be announced through our GitHub Discussions

## Best Practices for Using Glare Securely

1. **Keep Updated**: Always use the latest version of Glare (currently 1.6.4)
2. **CSS Isolation**: Ensure component styles are properly scoped to avoid leaking styles
3. **Accessibility**: Follow our guidelines to ensure components remain accessible when implemented
4. **Avoid Inline Styles from Untrusted Sources**: If allowing dynamic styling, validate the styling props

## Known Security Considerations

- Some components may use CSS that could potentially cause z-index stacking issues
- Animation components should be used with care for users with vestibular disorders
- Highly styled components may have rendering implications in older browsers
- Custom color props should be validated when accepting user input

## Security Contact

Please report any security issues to:

**Security Team**: glare.security@torchcorp.com

## Attribution Policy

We appreciate security researchers who report vulnerabilities to us and will acknowledge their contributions publicly if desired.

## Changes to This Policy

This Security Policy may be updated from time to time. You can always find the latest version on our GitHub repository.

---

Last updated: 2025-03-12
