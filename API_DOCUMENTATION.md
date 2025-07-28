# Scribal API Documentation

This document outlines the organized API routes that replace the previous function-based architecture.

## Overview

All API routes are organized by resource type and follow RESTful conventions. Authentication is handled via Supabase Auth, and all routes require authentication unless specified otherwise.

## Base URL

All API routes are prefixed with `/api/`

## Authentication

Most routes require authentication. The API automatically checks for a valid Supabase session and returns `401 Unauthorized` if no valid session is found.

## API Routes

### Authentication (`/api/auth/`)

#### POST `/api/auth/signin`

Sign in with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true
}
```

#### POST `/api/auth/signup`

Sign up with email, password, and display name.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "displayName": "John Doe"
}
```

**Response:**

```json
{
  "success": true
}
```

#### POST `/api/auth/signout`

Sign out the current user.

**Response:**

```json
{
  "success": true
}
```

### Users (`/api/users/`)

#### GET `/api/users`

Get the current user's profile.

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

#### POST `/api/users`

Create a new user document.

**Request Body:**

```json
{
  "email": "user@example.com",
  "phoneNumber": null,
  "displayName": "John Doe"
}
```

#### PUT `/api/users`

Update the current user's profile.

**Request Body:**

```json
{
  "email": "newemail@example.com"
}
```

#### POST `/api/users/ensure`

Ensure a user document exists (create if it doesn't).

**Request Body:**

```json
{
  "email": "user@example.com",
  "phoneNumber": null,
  "displayName": "John Doe"
}
```

#### POST `/api/users/profile-picture`

Upload a profile picture.

**Request Body:** `FormData` with a `file` field.

**Response:**

```json
{
  "success": true,
  "url": "https://example.com/profile-picture.jpg"
}
```

### Documents (`/api/documents/`)

#### GET `/api/documents`

Get all documents for the current user.

**Response:**

```json
{
  "success": true,
  "generatedDocuments": [
    {
      "id": "doc-id",
      "userId": "user-id",
      "writingStyleId": "style-id",
      "title": "Document Title",
      "prompt": "Document prompt",
      "requirements": "Document requirements",
      "generatedContent": "Generated content...",
      "wordCount": 500,
      "authenticityScore": 85,
      "generationTimeMs": 3000,
      "status": "completed",
      "isFavorite": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/documents`

Create a new document.

**Request Body:**

```json
{
  "title": "Document Title",
  "prompt": "Document prompt",
  "requirements": "Optional requirements",
  "writingStyleId": "optional-style-id"
}
```

**Response:**

```json
{
  "success": true,
  "generatedDocument": {
    "id": "doc-id",
    "title": "Document Title",
    "generatedContent": "Generated content...",
    "wordCount": 500,
    "authenticityScore": 85,
    "status": "completed"
  }
}
```

#### GET `/api/documents/[id]`

Get a specific document by ID.

**Response:**

```json
{
  "success": true,
  "document": {
    "id": "doc-id",
    "title": "Document Title",
    "generatedContent": "Generated content...",
    "type": "generated"
  }
}
```

#### PUT `/api/documents/[id]`

Update a document (e.g., toggle favorite status).

**Request Body:**

```json
{
  "isFavorite": true
}
```

#### DELETE `/api/documents/[id]`

Delete a document.

**Response:**

```json
{
  "success": true
}
```

#### GET `/api/documents/check-writing-styles`

Check if the user has writing styles.

**Response:**

```json
{
  "success": true,
  "hasStyles": true,
  "count": 2,
  "warning": "You don't have any writing styles yet..."
}
```

### Writing Styles (`/api/writing-styles/`)

#### GET `/api/writing-styles`

Get all writing styles for the current user.

**Response:**

```json
{
  "success": true,
  "writingStyles": [
    {
      "id": "style-id",
      "userId": "user-id",
      "styleName": "Academic Style",
      "vocabularyLevel": 8,
      "avgSentenceLength": 25.5,
      "complexityScore": 7,
      "toneAnalysis": {
        "formality": "formal",
        "emotion": "neutral",
        "confidence": "high",
        "engagement": "medium"
      },
      "writingPatterns": {
        "sentenceStructure": "complex",
        "paragraphLength": "long",
        "transitionWords": ["furthermore", "moreover"],
        "repetitivePhrases": [],
        "uniqueCharacteristics": ["academic tone", "complex sentences"]
      },
      "samplePhrases": [
        "Furthermore, it is evident that...",
        "Moreover, the analysis reveals..."
      ],
      "authenticityBaseline": 85,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST `/api/writing-styles`

Create a new writing style.

**Request Body:** `FormData` with:

- `name`: Writing style name
- `files`: Array of `.txt` files

**Response:**

```json
{
  "success": true,
  "writingStyle": {
    "id": "style-id",
    "styleName": "Academic Style",
    "vocabularyLevel": 8,
    "complexityScore": 7,
    "authenticityBaseline": 85
  }
}
```

#### GET `/api/writing-styles/[id]`

Get a specific writing style by ID.

**Response:**

```json
{
  "success": true,
  "writingStyle": {
    "id": "style-id",
    "styleName": "Academic Style",
    "vocabularyLevel": 8,
    "complexityScore": 7
  }
}
```

#### DELETE `/api/writing-styles/[id]`

Delete a writing style and its associated sample documents.

**Response:**

```json
{
  "success": true
}
```

#### GET `/api/writing-styles/selection`

Get writing styles for selection in document creation (minimal data).

**Response:**

```json
{
  "success": true,
  "writingStyles": [
    {
      "id": "style-id",
      "styleName": "Academic Style",
      "vocabularyLevel": 8,
      "toneAnalysis": {
        "formality": "formal",
        "emotion": "neutral"
      }
    }
  ]
}
```

## Error Responses

All API routes return consistent error responses:

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Client Usage

Use the provided `lib/api-client.ts` for easy integration:

```typescript
import { documentsAPI, writingStylesAPI, userAPI } from "@/lib/api-client";

// Create a document
const result = await documentsAPI.createDocument({
  title: "My Document",
  prompt: "Write about AI",
  requirements: "Make it academic",
});

// Get writing styles
const styles = await writingStylesAPI.getAllWritingStyles();

// Update user profile
await userAPI.updateUser({ email: "newemail@example.com" });
```

## Migration from Function Files

The old function files in `lib/functions/` have been replaced with these organized API routes. The client-side helper functions are now available in `lib/api-client.ts` and provide the same functionality with better organization and type safety.

### Key Changes:

1. **Server Functions** → **API Routes**: All server-side logic moved to `/api/` routes
2. **Client Functions** → **API Client**: Client-side functions now use the API client
3. **Better Organization**: Routes organized by resource type
4. **Consistent Error Handling**: All routes return consistent error responses
5. **Type Safety**: Better TypeScript support with proper types

### Migration Guide:

- Replace `import { createDocument } from '@/lib/functions/documentFunctions'` with `import { documentsAPI } from '@/lib/api-client'`
- Replace `createDocument()` calls with `documentsAPI.createDocument()`
- Replace `import { signInWithEmail } from '@/lib/functions/authFunctions'` with `import { authAPI } from '@/lib/api-client'`
- Replace `signInWithEmail()` calls with `authAPI.signIn()`
