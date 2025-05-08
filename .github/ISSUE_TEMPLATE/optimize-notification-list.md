---
name: Optimize NotificationList Component
about: Optimize the NotificationList component for better performance and maintainability
title: "Optimize NotificationList Component"
labels: "enhancement, performance, refactor"
assignees: ""
---

## Description

The NotificationList component needs optimization in three key areas to improve performance, maintainability, and code organization.

## Current Issues

### 1. Client/Server Data Synchronization

- The component currently mixes localStorage and React Query for state management
- This leads to inconsistencies between UI state and server state
- Users may see incorrect read/unread status

### 2. Component Size and Responsibility

- The component handles too many responsibilities:
  - List rendering
  - Individual notification rendering
  - Read status button logic
  - State management
- This makes the code harder to maintain and test

### 3. Constant Definition Location

- Constants like `TYPE_TO_PATH` are defined inside the component
- This causes unnecessary recreation on each render
- Violates React best practices for static data

## Proposed Solutions

### 1. Data Synchronization

- Remove localStorage dependency
- Rely solely on React Query for state management
- Use `markAsReadMutation` for state updates
- Let React Query handle data refetching

### 2. Component Structure

- Extract individual notification rendering to a separate `NotificationItem` component
- Keep NotificationList focused on list structure and data fetching
- Pass necessary data and callbacks via props

### 3. Constant Management

- Move constants like `TYPE_TO_PATH` outside the component
- Define them at the module level
- Prevent unnecessary recreation on renders

## Expected Benefits

- Improved performance through reduced re-renders
- Better code maintainability and readability
- More reliable state management
- Easier testing and debugging
- Better alignment with React best practices

## Additional Notes

- This refactor should not affect the existing functionality
- All changes should be backward compatible
- Consider adding tests to verify the improvements
