# Contributing to Library Management System

Thank you for considering contributing to the **Library Management System**! This project uses **Express.js**, **TypeScript**, and **MongoDB** to manage book data. Your contributions help us improve and extend this project, and we welcome all types of contributions.

## Table of Contents
- [Contributing to Library Management System](#contributing-to-library-management-system)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [How to Contribute](#how-to-contribute)
  - [Project Setup](#project-setup)
  - [Access Control](#access-control)
  - [Features to Implement](#features-to-implement)
  - [Submitting Changes](#submitting-changes)
  - [Reporting Issues](#reporting-issues)
  - [Style Guide](#style-guide)
    - [Authentication Implementation](#authentication-implementation)
    - [API Implementation](#api-implementation)
    - [Testing Guidelines](#testing-guidelines)
    - [Code Style](#code-style)
  - [Need Help?](#need-help)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/), a widely accepted standard in open-source communities. Please read and adhere to these guidelines to foster a welcoming environment for all contributors.

## How to Contribute

You can contribute by:
- Adding new features
- Improving existing code
- Fixing bugs
- Updating documentation
- Improving code structure and readability

## Project Setup

Follow these steps to get the project up and running on your local machine:

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/your-username/library-management-system.git
   cd library-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your MongoDB connection string and other required variables.

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

## Access Control

The system implements the following access control:

1. **Public Access** (no authentication required):
   - View list of books (`GET /books`)
   - View single book details (`GET /books/:id`)
   - Search books
   - View book reviews and ratings

2. **Admin Access** (requires authentication with admin role):
   - Create new books (`POST /books`)
   - Update book information (`PUT /books/:id`)
   - Delete books (`DELETE /books/:id`)
   - Manage book categories
   - Moderate comments and reviews

## Features to Implement

1. **Authentication System**:
   - User registration and login endpoints
   - JWT-based authentication
   - Admin role management
   - Password reset functionality

2. **Book Management** (Admin Only):
   - Create new book endpoint (`POST /books`)
   ```typescript
   interface Book {
     title: string;
     author: string;
     isbn: string;
     publishedYear: number;
     category: string[];
     description: string;
   }
   ```
   
   - Update book endpoint (`PUT /books/:id`)
   - Delete book endpoint (`DELETE /books/:id`)

3. **Public Access Features**:
   - View book details (`GET /books/:id`)
   - List all books with pagination (`GET /books`)
   - Search and filter books
   - View reviews and ratings

4. **Review System**:
   - Add book reviews and ratings
   - View reviews for a book
   - Moderate reviews (admin only)

## Submitting Changes

1. **Create a New Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, maintainable code
   - Add appropriate comments
   - Follow the style guide
   - Include tests for new features

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: Add description of your changes"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Submit a Pull Request**
   - Fill out the pull request template
   - Reference any related issues
   - Provide a clear description of your changes
   - Wait for review and address any feedback

## Reporting Issues

When reporting issues, please include:

1. **Description**: Clear description of the problem
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment Details**:
   - Node.js version
   - npm version
   - Operating system
   - Browser (if applicable)
   - Any relevant configuration

## Style Guide

### Authentication Implementation

```typescript
interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name: string;
}

// Authentication middleware
const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }
    req.user = await verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authorization middleware
const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }
  next();
};

// Protected route example
router.post('/books', authenticateUser, requireAdmin, createBook);
```

### API Implementation

```typescript
/**
 * Creates a new book (Admin only)
 */
async function createBook(req: Request, res: Response): Promise<void> {
  try {
    const book = await BookModel.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Updates a book (Admin only)
 */
async function updateBook(req: Request, res: Response): Promise<void> {
  try {
    const book = await BookModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

### Testing Guidelines

Write tests for both authentication and functionality:

```typescript
describe('Book API', () => {
  describe('POST /books', () => {
    it('should require authentication', async () => {
      const response = await request(app)
        .post('/books')
        .send(validBookData);
      expect(response.status).toBe(401);
    });

    it('should require admin role', async () => {
      const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validBookData);
      expect(response.status).toBe(403);
    });

    it('should create book when admin authenticated', async () => {
      const response = await request(app)
        .post('/books')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validBookData);
      expect(response.status).toBe(201);
    });
  });
});
```

### Code Style

- Use TypeScript's strict mode
- Define interfaces for all data structures
- Use meaningful variable and function names
- Add type annotations where TypeScript cannot infer types
- Document with JSDoc comments
- Implement proper error handling
- Follow RESTful conventions
- Use appropriate HTTP status codes

## Need Help?

If you need help or have questions:
1. Check existing issues and documentation
2. Contact maintainers through the issue tracker

Thank you for contributing to the Library Management System! Your efforts help make this project better for everyone.