# Upgrading Your Google Push Notification Service

**URL:** https://help.fliplet.com/upgrading-your-google-push-notification-service/

**Description:** Learn how to upgrade your push notification service for Android apps

## Overview

Google has announced the deprecation of their legacy Google Cloud Messaging (GCM) API, culminating in a complete removal after June 20, 2024.

This article outlines the steps to upgrade your push notification service to ensure your notifications operate as expected.

**📝 Note:** These steps should only be followed if you have previously configured Android push notifications. If this is your first time setting up push notifications, please see [Push notifications](./help-center/) for instructions.

## Upgrade Process

The upgrade process includes:

1. **Get Google service file**
2. **Visit Google Cloud to set up your FCM services**
3. **Create service account**
4. **Create a new key**
5. **Submit the information in Fliplet**

## Step 1 – Get Google Services File

1. **Log in to your Google Firebase account**
2. **Ensure you select the app** you are updating your push notification service for

**📝 Note:** If you have not previously registered your app for a project you will need to do this first. Each app should have a separate firebase project.

3. **Select the Android app** in the project
4. **For the Android package name** - Enter the Bundle id found in the Google publish tab of Studio
5. **Click on "register app"**
6. **This will enable you to download** the google-services file

### Download the Services File

1. **Click the "General" tab** at the top of the screen
2. **Find the "google-services.json" file** and download it

## Step 2 – Visit Google Cloud to Set Up Your FCM Services

1. **Start by opening Google Cloud**
2. **Now, select the project** that relates to your existing app from the dropdown menu
3. **Once you have selected the project**, use the search bar to search for "roles" and select

## Why Upgrade from GCM to FCM?

### GCM Deprecation
- **Google Cloud Messaging (GCM)** is being discontinued
- **Complete removal** after June 20, 2024
- **No new features** or security updates
- **Limited support** for legacy implementations

### FCM Benefits
- **Firebase Cloud Messaging (FCM)** is the modern replacement
- **Enhanced security** and authentication
- **Better performance** and reliability
- **Advanced features** and capabilities
- **Long-term support** and updates

## Technical Requirements

### Firebase Project Setup
- **Active Firebase project** for your app
- **Android app registration** in Firebase
- **Google services configuration** file
- **Project permissions** and access rights

### Google Cloud Configuration
- **Service account creation** for FCM
- **API key generation** for authentication
- **Role assignment** for proper permissions
- **Project selection** and configuration

## Security Considerations

### Service Account Management
- **Secure key storage** and management
- **Limited permissions** following least privilege
- **Regular key rotation** for security
- **Access monitoring** and logging

### API Security
- **Secure API key handling** in your app
- **HTTPS communication** for all requests
- **Authentication validation** for notifications
- **Rate limiting** and abuse prevention

## Migration Best Practices

### Planning and Preparation
- **Test the upgrade process** in a development environment
- **Backup existing configurations** before making changes
- **Plan for downtime** during the migration
- **Communicate changes** to your users

### Testing and Validation
- **Verify notification delivery** after upgrade
- **Test on multiple devices** and Android versions
- **Validate user experience** and functionality
- **Monitor performance** and reliability

### Rollback Planning
- **Keep old configurations** as backup
- **Document rollback procedures** if needed
- **Test rollback process** before production
- **Maintain support** for both systems during transition

## Common Issues and Solutions

### Configuration Problems
- **Incorrect bundle ID** - Verify the package name matches exactly
- **Missing permissions** - Check service account roles and permissions
- **Invalid API keys** - Ensure keys are properly generated and configured
- **Project mismatch** - Confirm you're working with the correct Firebase project

### Notification Delivery Issues
- **Token generation problems** - Verify FCM configuration in your app
- **Authentication failures** - Check API key validity and permissions
- **Device registration issues** - Ensure proper FCM SDK integration
- **Network connectivity** - Verify internet access and firewall settings

## Post-Upgrade Tasks

### Verification and Testing
- **Send test notifications** to verify functionality
- **Monitor delivery rates** and performance
- **Check user engagement** with notifications
- **Validate error handling** and fallback mechanisms

### Documentation Updates
- **Update technical documentation** with new configurations
- **Revise user guides** for notification features
- **Maintain configuration records** for future reference
- **Share best practices** with your development team

### Monitoring and Maintenance
- **Set up monitoring** for notification delivery
- **Track performance metrics** and trends
- **Regular security reviews** of configurations
- **Plan for future updates** and enhancements

## Support and Resources

### Getting Help
- **Google Firebase documentation** for FCM setup
- **Google Cloud support** for service account issues
- **Fliplet support** for app-specific configuration
- **Community forums** for peer assistance

### Additional Resources
- **FCM migration guides** and best practices
- **Sample code** and implementation examples
- **Troubleshooting guides** for common issues
- **Performance optimization** recommendations

---

*Extracted from Fliplet Help Center using MCP tools*












