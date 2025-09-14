# Managing Multiple Environments

**URL:** https://help.fliplet.com/multi-environment/

**Description:** Understanding multi-environment in Fliplet

## Overview

Managing multiple environments, such as production, staging, and development, is essential for maintaining stability, security, and efficiency in your Fliplet apps. This guide walks you through setting up and managing users, accounts, and apps across multiple environments.

## Get Started

The multi-environment management process includes:

1. **Create root accounts**
2. **Configure each environment**
3. **Implement user roles and policies**
4. **Set up environment-specific configurations**
5. **Copy apps**

## Step 1 – Create Root Accounts

1. **Go to https://studio.fliplet.com/signup**
2. **Register unique email addresses** for each environment. For example:
   - **Production:** prod-fliplet@your-org.com
   - **Staging:** staging-fliplet@your-org.com
   - **Development:** dev-fliplet@your-org.com

## Step 2 – Configure Each Environment

1. **Sign in to each root account** separately
2. **Set up an organizational structure** for each environment
3. **Ensure environments remain isolated** to prevent accidental changes

## Step 3 – Implement User Roles and Policies

1. **Define Admin and Standard roles** for each environment
2. **Assign permissions based on user needs** (e.g., admins manage apps, standards contribute content)
3. **Ensure roles follow the principle of least privilege**

## Step 4 – Set Up Environment-Specific Configurations

1. **Set up security rules** tailored to each environment
2. **Implement access restrictions** to control who can enter sensitive environments (like Production)
3. **Define any additional environment settings** for testing or development

## Step 5 – Copy Apps

1. **From Fliplet Studio, duplicate the apps** you want to migrate to other environments
2. **Remove any sensitive or production-specific data** from the copies
3. **Configure environment-specific settings** for each copy

## Key Benefits of Multi-Environment Management

### Stability and Reliability
- **Isolated environments** prevent cross-contamination
- **Stable production** environment for end users
- **Controlled testing** in staging environments
- **Risk-free development** in development environments

### Security and Access Control
- **Environment-specific permissions** and roles
- **Controlled access** to production environments
- **Separate user accounts** for different environments
- **Data isolation** between environments

### Development Efficiency
- **Parallel development** across multiple environments
- **Faster iteration** and testing cycles
- **Collaborative development** without production risk
- **Streamlined deployment** processes

## Environment Types and Purposes

### Production Environment
- **Live apps** accessible to end users
- **Stable, tested** functionality
- **Restricted access** for administrators only
- **Performance monitoring** and optimization

### Staging Environment
- **Pre-production testing** and validation
- **User acceptance testing** (UAT)
- **Final quality assurance** before production
- **Stakeholder review** and approval

### Development Environment
- **Active development** and feature building
- **Experimental features** and testing
- **Team collaboration** and iteration
- **Continuous integration** and testing

## User Management Across Environments

### Role Definitions
- **Environment Administrators** - Full control over specific environments
- **App Developers** - Create and modify apps in development/staging
- **Testers** - Access to staging for testing and validation
- **End Users** - Access only to production apps

### Permission Management
- **Granular access control** for different user types
- **Environment-specific permissions** based on user roles
- **Temporary access** for contractors or external teams
- **Regular permission reviews** and updates

## Security Considerations

### Data Protection
- **Sensitive data isolation** between environments
- **Production data protection** with strict access controls
- **Test data creation** for development purposes
- **Data encryption** and security measures

### Access Control
- **Multi-factor authentication** for production access
- **IP restrictions** for sensitive environments
- **Session management** and timeout policies
- **Audit logging** for all environment access

### Compliance and Governance
- **Environment separation** for regulatory compliance
- **Change management** processes for production
- **Documentation** of environment configurations
- **Regular security audits** and assessments

## App Management Strategies

### App Lifecycle Management
- **Development** → **Staging** → **Production** workflow
- **Version control** and change tracking
- **Rollback procedures** for production issues
- **Continuous deployment** pipelines

### Data Management
- **Data migration** between environments
- **Test data creation** and management
- **Data synchronization** when needed
- **Data cleanup** procedures

### Configuration Management
- **Environment-specific settings** and configurations
- **Feature flags** for gradual rollouts
- **A/B testing** capabilities in staging
- **Performance tuning** and optimization

## Best Practices

### Environment Setup
- **Clear naming conventions** for all environments
- **Consistent configuration** across environments
- **Automated setup** scripts and templates
- **Documentation** of environment configurations

### User Onboarding
- **Clear role definitions** and responsibilities
- **Training materials** for each environment
- **Access request** and approval processes
- **Regular access reviews** and updates

### Monitoring and Maintenance
- **Performance monitoring** across all environments
- **Regular backups** and disaster recovery planning
- **Environment health checks** and maintenance
- **Capacity planning** and resource management

## Troubleshooting

### Common Issues
- **Environment access problems** - Check user permissions and account status
- **App copying failures** - Verify app configurations and data sources
- **User synchronization issues** - Check invitation and access processes
- **Configuration conflicts** - Review environment-specific settings

### Getting Help
- **Review environment setup** documentation
- **Check user permissions** and access levels
- **Verify app configurations** across environments
- **Contact Fliplet support** for technical issues

## Advanced Features

### Environment Templates
- **Pre-configured environments** for common use cases
- **Standardized configurations** across organizations
- **Quick environment setup** for new projects
- **Consistent security** and access policies

### Automation and Integration
- **CI/CD pipelines** for automated deployments
- **Environment provisioning** through APIs
- **Monitoring and alerting** systems
- **Integration** with development tools and workflows

---

*Extracted from Fliplet Help Center using MCP tools*












