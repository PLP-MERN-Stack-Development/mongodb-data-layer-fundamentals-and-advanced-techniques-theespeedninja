// TASK 1: Creating plp_bookstore database and books collection
const { MongoClient } = require('mongodb');
const db = db('plp_bookstore');
await db.createCollection('books');

// TASK 2: Inserting multiple book documents into the books collection
//ran the insert_books.js file
//mongoDB queries to:
db.books.find({genre: "Fiction"}); // finding all books in a specific genre (eg. Fiction, (replace with genre of choice))
db.books.find({published_year: {$gt: 1950}}); // finding all books published after a certain year (eg. 1950, replace with year of choice)
db.books.find({author: "Paulo Coelho" }); // finding all books by a specific author (eg. Paulo Coelho, replace with author of choice)
db.books.updateOne(
    {title: "Wuthering Heights"},
    {$set: {price: 12.50}}
); // updating the price of a specific book (eg. Wuthering Heights, replace with book title of choice and new price)
db.books.deleteOne({title: "Moby Dick"}); // deleting a specific book from the collection (eg. Moby Dick, replace with book title of choice)

// TASK 3: Advance Queries:
// books both in sotck and published after 2010
db.books.find({
    $and: [
        {in_stock: true},
        {published_year: {$gt: 2010}}
    ]
});

//using projection to return only title, author and price fields
db.books.find({
    $and: [
        {in_stock: true},
        {published_year: {$gt: 2010}}
    ]
    },{
    _id: 0, title: 1, author: 1, price: 1 // using projection
});
// implementing sorting to display books (using projection still) by price:
// ascending order: 
db.books.find(
    {},
    {_id: 0, title: 1, author: 1, price: 1}
).sort({price: 1});
// Descending
db.books.find(
    {},
    {_id: 0, title: 1, author: 1, price: 1}
).sort({price: -1});

//implementing pagination using the  .limit and .skip  methods and still mainting projection and alsoin descending order 
// page 1:
db.books.find(
    {},
    {_id: 0, title: 1, author: 1, price: 1}
).sort({price: -1}).limit(5);
// page 2: 
db.books.find(
    {},
    {_id: 0, title: 1, author: 1, price: 1}
).sort({price: -1}).skip(5).limit(5);
// page 3:
db.books.find(
    {},
    {_id: 0, title: 1, author: 1, price: 1}
).sort({price: -1}).skip(10).limit(5);
// skip formular used: (page number - 1) * items per page(=limit number)

// TASK 4: Aggregation Pipeline
// 1. Average price of books in each genre
db.books.aggregate([
    {$group: {_id: "$genre", totalBooks: {$sum: 1}, averagePrice: {$avg:"$price"}}},
    {$sort: {totalBooks: -1}}
]);
//2. finding author with most books in the collection
db.books.aggregate([
    {$group:{_id: "$author", totalBooks:{$sum:1}}},
    {$sort: {totalBooks: -1}},
    {$limit: 1}
]);
// 3. Group books by publication decade and count them
db.books.aggregate([
    {
        // Create a new field for decade (e.g.1880s, 1990s)
        $project: {
        decade: { $subtract: [ "$year", { $mod: [ "$year", 10 ] } ] }
        }
    },
    {
        // Group by decade and count
        $group: {
        _id: "$decade",
        bookCount: { $sum: 1 }
        }
    },
    {
        // Sort results by decade ascending
        $sort: { _id: 1 }
    }
]);


//TASK5: Indexing

//using explain before creating indexes to see query performance
// Without index (before createIndex)
db.books.find({ title: "The Hobbit" }).explain("executionStats");
// creating an index on the title field for fastere searches
db.books.createIndex({ title: 1 });
// After creating index on title
db.books.find({ title: "The Hobbit" }).explain("executionStats");

//before creating compound index
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");
//creating a compound index on author and published_year 
db.books.createIndex({ author: 1, published_year: -1 });
//after creating compound index
db.books.find({ author: "George Orwell", published_year: 1949 }).explain("executionStats");

// listing all indexes in the collection
db.books.getIndexes();

