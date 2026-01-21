# Delegation Brief: Demo Sentinel Platform

## Summary

Build a demo platform replicating Microsoft Sentinel interface for MSSP sales demos.

## Design Document

See: `docs/plans/2026-01-21-demo-sentinel-design.md`

## Scope

Phase 1: Project Setup + Core UI Shell

## Tasks

1. Initialize React + TypeScript project with Vite
2. Install and configure Fluent UI v9
3. Create app shell with Sentinel layout (header, sidebar, content area)
4. Implement Sentinel dark theme styling
5. Build collapsible navigation sidebar with all Sentinel section links
6. Set up routing for all Sentinel pages (placeholder components)
7. Create basic Azure Functions project structure

## Acceptance Criteria

- [ ] `npm run dev` starts the frontend successfully
- [ ] App displays Sentinel-like dark theme UI
- [ ] Navigation sidebar shows all Sentinel sections
- [ ] Clicking nav items routes to corresponding pages
- [ ] Layout matches Sentinel visually (header, sidebar, content)

## Requirements

- No stubs or placeholder implementations for completed tasks
- Run linter and fix all issues before completion
- Include TypeScript types for all components
- Follow Fluent UI v9 patterns and best practices

## Tech Stack

- React 18+ with TypeScript
- Vite for build tooling
- Fluent UI v9 (@fluentui/react-components)
- React Router v6 for routing
- Azure Functions (Node.js) for API

## Reference

Microsoft Sentinel portal: Dark theme, left sidebar navigation, Azure portal header style
