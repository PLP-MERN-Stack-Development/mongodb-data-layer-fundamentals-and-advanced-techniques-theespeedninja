# MongoDB Queries Documentation

This documentation covers various MongoDB queries implemented in `queries.js` for managing a bookstore database.

## Table of Contents
1. [Database Setup](#database-setup)
2. [Basic Operations](#basic-operations)
3. [Advanced Queries](#advanced-queries)
4. [Aggregation Pipeline](#aggregation-pipeline)
5. [Indexing](#indexing)

## Database Setup
```javascript
// Initialize database connection and create collection
const { MongoClient } = require('mongodb');
const db = db('plp_bookstore');
await db.createCollection('books');
```

## Basic Operations

### Find Operations
- Find books by genre:
  ```javascript
  db.books.find({genre: "Fiction"});
  ```
- Find books after a specific year:
  ```javascript
  db.books.find({published_year: {$gt: 1950}});
  ```
- Find books by author:
  ```javascript
  db.books.find({author: "Paulo Coelho"});
  ```

### Update Operation
```javascript
db.books.updateOne(
    {title: "Wuthering Heights"},
    {$set: {price: 12.50}}
);
```

### Delete Operation
```javascript
db.books.deleteOne({title: "Moby Dick"});
```

## Advanced Queries

### Combined Conditions
Find books that are both in stock and published after 2010:
```javascript
db.books.find({
    $and: [
        {in_stock: true},
        {published_year: {$gt: 2010}}
    ]
});
```

### Projection
Return specific fields (title, author, price):
```javascript
db.books.find(
    {},
    {_id: 0, title: 1, author: 1, price: 1}
);
```

### Sorting
Sort books by price:
```javascript
// Ascending order
db.books.find({}).sort({price: 1});
// Descending order
db.books.find({}).sort({price: -1});
```

### Pagination
Implementation using skip and limit:
```javascript
// Page 1 (first 5 results)
db.books.find({}).sort({price: -1}).limit(5);
// Page 2 (next 5 results)
db.books.find({}).sort({price: -1}).skip(5).limit(5);
// Page 3 (next 5 results)
db.books.find({}).sort({price: -1}).skip(10).limit(5);
```

## Aggregation Pipeline

### 1. Average Price by Genre
```javascript
db.books.aggregate([
    {$group: {
        _id: "$genre",
        totalBooks: {$sum: 1},
        averagePrice: {$avg:"$price"}
    }},
    {$sort: {totalBooks: -1}}
]);
```

### 2. Author with Most Books
```javascript
db.books.aggregate([
    {$group: {_id: "$author", totalBooks: {$sum: 1}}},
    {$sort: {totalBooks: -1}},
    {$limit: 1}
]);
```

### 3. Books by Decade
```javascript
db.books.aggregate([
    {
        $project: {
            decade: { $subtract: [ "$year", { $mod: [ "$year", 10 ] } ] }
        }
    },
    {
        $group: {
            _id: "$decade",
            bookCount: { $sum: 1 }
        }
    },
    {
        $sort: { _id: 1 }
    }
]);
```

## Indexing

### Single Field Index
```javascript
// Create index on title field
db.books.createIndex({ title: 1 });
```

### Compound Index
```javascript
// Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });
```

### Performance Analysis
- Use `.explain("executionStats")` to analyze query performance:
  ```javascript
  db.books.find({ title: "The Hobbit" }).explain("executionStats");
  ```
- List all indexes:
  ```javascript
  db.books.getIndexes();
  ```

## Tips
- Use pagination for large result sets
- Create indexes for frequently queried fields
- Use projection to limit returned fields
- Formula for skip in pagination: (page number - 1) * items per page
