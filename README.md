# aws-iam-identity-center-shortcut-portal

AWS IAM Identity Center Access Role Portal - Deeplink your AWS Console access to its finest!

Know more about why this project was created: [Dev.to](https://dev.to/aws-builders/deep-linking-aws-console-with-all-your-aws-iam-identity-center-roles-148c)

## Overview

<img width="944" alt="roleList" src="https://github.com/user-attachments/assets/c8a20245-7cda-4ad9-b470-978f309634ff">

This tool provides a web-based interface for managing access roles in AWS IAM Identity Center (formerly AWS Single Sign-On). It allows users to easily create, view, edit, and delete role records associated with Identity Center aliases and AWS accounts.

The ability to use shortcuts with AWS IAM Identity Center is a handy new feature released in 2024 Apr 11 [Source](https://aws.amazon.com/about-aws/whats-new/2024/04/aws-iam-identity-center-shortcut-links-aws-access-portal/). Refer to the documentation [here](https://docs.aws.amazon.com/singlesignon/latest/userguide/createshortcutlink.html).

## Features

- View existing role records in a table format
- Create new role records, optionally from a pasted shortcut created from AWS IAM Identity Center
- Edit existing role records
- Delete role records
- Search functionality to filter role records
- Direct links to redirect URIs for quick access

## Usage

### Viewing Role Records

The main page displays a table with the following columns:
- Identity Center Alias
- Account ID (AWS Account ID)
- Role Name
- Display Name
- Redirect URI
- Actions (Use Role, Edit, Delete)

### Creating a New Role Record

1. Click the "Create Role Record" button
2. Fill in the required fields:
   - Identity Center Alias
   - Account ID
   - Role Name
3. Optionally, provide:
   - Display Name
   - Redirect URI
4. Alternatively, create the shortcut within your AWS IAM Identity Center start page, then paste the shortcut link from Identity Center to prefill values
5. Click "CREATE" to add the new role record
<img width="443" alt="RoleCreation" src="https://github.com/user-attachments/assets/c011f8e6-d217-4235-b918-fcc6b31417dd">

### Editing a Role Record

1. Click the "Edit" action for the desired role
2. Modify the fields as needed
3. Click "UPDATE" to save changes

### Deleting a Role Record

Click the "Delete" action for the role you wish to remove.

### Using a Role

Click the "Use Role" action to directly access the role via the specified redirect URI.

### Export & Import

You can Click the "💾" button on top right corner to export your current role list as a deep linked URL,
so that your teammates get share the same set of URLs as you, saving time for onboarding!

<img width="441" alt="ExportFunction" src="https://github.com/user-attachments/assets/36f93ae1-1ecf-409c-b243-3939fff86c27">

## Security Considerations

- Add data are stored in your browser's local storage only
- No client side tracking or analytics are implemented

## Dependencies

- AWS IAM Identity Center with Access Roles configured
