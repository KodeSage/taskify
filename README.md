# Taskify

A TypeScript React application that demonstrates the capabilities of the [Fireproof](https://use-fireproof.com/) local-first database. This task manager app provides robust task management features with prioritization functionalities, all powered by Fireproof for persistent storage without requiring a backend.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Prioritization**: Set and change task priorities (High, Medium, Low) with visual indicators
- **Filtering & Sorting**: Organize tasks by status, priority, and due date
- **Local-First Storage**: All data persists in the browser using Fireproof
- **Data Export**: Export your task data as JSON for backup or transfer

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/KodeSage/taskify.git
   cd taskify
   ```

2. Install dependencies
   ```
   npm i --force
   ```
   or
   ```
   yarn install
   ```

3. Start the development server
   ```
   npm run dev
   ```
   or
   ```
   yarn run dev
   ```

4. Open your browser to `http://localhost:3000`



## How It Uses Fireproof

This application demonstrates several key Fireproof capabilities:

1. **Document Store**: Using Fireproof's document-oriented storage for tasks
2. **Indexing**: Creating indexes to optimize querying and filtering
3. **Real-time Updates**: Listening for changes to update the UI
4. **Local-First**: Storing all data in the browser for offline capability

The key Fireproof integration points are:

- Using `useFireproof` hook for database access
- Creating and querying documents with full CRUD operations
- Setting up change listeners for real-time updates
- Working with indexes for optimized data access


## VO Fork Version 
https://v0.dev/chat/taskify-JAkTJWX8vH7?b=b_Jl9ZgX2uaYi



Created with ❤️ using Fireproof - The local-first database for web applications.
