# Taskify

A TypeScript React application that demonstrates the capabilities of the Fireproof local-first database. This task manager app provides robust task management features with prioritization and reminder functionalities, all powered by Fireproof for persistent storage without requiring a backend.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **Prioritization**: Set and change task priorities (High, Medium, Low) with visual indicators
- **Filtering & Sorting**: Organize tasks by status, priority, and due date
- **Local-First Storage**: All data persists in the browser using Fireproof
- **Statistics Dashboard**: Track your productivity with real-time metrics
- **Data Export**: Export your task data as JSON for backup or transfer

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/fireproof-task-manager.git
   cd fireproof-task-manager
   ```

2. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

4. Open your browser to `http://localhost:3000`

## Customization Guide

### Adding Categories/Tags

You can extend the app to support task categorization by modifying the Task interface and components:

1. Update the Task interface in `TaskManager.tsx`:

```typescript
interface Task {
  // Existing fields...
  categories: string[]; // Add this line
}
```

2. Add a category selection UI in the form components
3. Update the filtering logic to include category filtering

### Implementing Subtasks

To add support for subtasks:

1. Create a new interface for subtasks:

```typescript
interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}
```

2. Update the Task interface:

```typescript
interface Task {
  // Existing fields...
  subtasks: Subtask[]; // Add this line
}
```

3. Add UI components for managing subtasks within the task cards

### Time Tracking Features

To implement time tracking:

1. Update the Task interface:

```typescript
interface Task {
  // Existing fields...
  estimatedTime: number; // in minutes
  actualTime: number; // in minutes
  startTime?: string; // ISO string
  endTime?: string; // ISO string
}
```

2. Add UI controls for starting/stopping timers
3. Implement timer functionality to track actual time spent

### Custom Themes

To implement theme customization:

1. Create a themes configuration file with color schemes
2. Add a theme selector in the header
3. Use CSS variables or Tailwind theme extension to apply the selected theme

### Sync with Remote Storage

Fireproof supports synchronization with remote storage. To implement this:

1. Set up a CouchDB-compatible server or use a service like PouchDB Server
2. Configure Fireproof to sync with the remote database:

```typescript
import { useFireproof } from 'use-fireproof';

const { db } = useFireproof('task-manager');

// Set up sync with remote server
const syncUrl = 'https://your-remote-db-url.com/tasks';
const sync = db.sync(syncUrl, {
  live: true,
  retry: true
});

// Monitor sync events
sync.on('change', function (change) {
  console.log('Sync change:', change);
});
```

## Deployment Options

### GitHub Pages

1. Install gh-pages:
   ```
   npm install --save-dev gh-pages
   ```

2. Add deployment scripts to package.json:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```

3. Deploy:
   ```
   npm run deploy
   ```

### Netlify

1. Create a `netlify.toml` file:
   ```toml
   [build]
     publish = "build"
     command = "npm run build"
   ```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Or use Netlify CLI:
     ```
     npm install -g netlify-cli
     netlify deploy
     ```

### Vercel

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Deploy:
   ```
   vercel
   ```

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

## Using with AI Tools

This app is designed to be easily customizable with AI tools. Here are some ways to use AI to modify the app:

1. **Prompt for New Features**: Ask the AI to add specific features like recurring tasks
2. **Modify the UI**: Ask for UI enhancements or redesigns
3. **Add External Integrations**: Get help implementing connections to calendars or other services
4. **Optimize Performance**: Request code optimizations for better performance

Example AI prompt: "Help me add a feature to group tasks into projects in the Fireproof Task Manager app"

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created with ❤️ using Fireproof - The local-first database for web applications.