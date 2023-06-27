const express = require("express");
//conecting sqlite to express js
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json()); //midleware

const dbPath = path.join(__dirname, "goodreads.db");

let db = null;

const instalizingDatabaseAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, console.log("server is running on port is 3000"));

    //get method is used to get all multiple rows in that table

    app.get("/books/", async (request, response) => {
      const getQuery = `
        select * 
        from book 
        order by book_id;
        `;
      const array = await db.all(getQuery);
      response.send(array);
    });
    //only i want titles of the books
    app.get("/books/title/", async (request, response) => {
      const getQuery = `
        select title 
        from book 
        order by book_id;
        `;
      const array = await db.all(getQuery);
      response.send(array);
    });
    // only to get one row from table by using get method

    app.get("/books/onerow/", async (request, response) => {
      const getQuery = `
    select title 
    from book 
    order by book_id;
    `;
      const array = await db.get(getQuery);
      response.send(array.title);
    });

    // i want prices of each book with page numbers also

    app.get("/books/price/", async (request, response) => {
      const getQuery = `
        select title, pages, price 
        from book 
        order by price asc;
        `;
      const array = await db.all(getQuery);
      response.send(array);
    });

    //get book using path parameters

    app.get("/books/:bookId/", async (request, response) => {
      const { bookId } = request.params;
      const getQuery = `
        select * 
        from book 
        where book_id =${bookId};
        `;

      const array = await db.get(getQuery);
      response.send(array);
    });

    // to insert the data in the databse

    app.post("/books/", async (request, response) => {
      const bookDetails = request.body;
      const {
        title,
        authorId,
        rating,
        ratingCount,
        reviewCount,
        description,
        pages,
        dateOfPublication,
        editionLanguage,
        price,
        onlineStores,
      } = bookDetails;

      const addQuery = `
      insert into book ( title,
        author_id,
        rating,
        rating_count,
        review_count,
        description,
        pages,
        date_of_publication,
        edition_language,
        price,
        online_stores)
      values (
          '${title}',
          '${authorId}',
          '${rating}',
          '${ratingCount}',
          '${reviewCount}',
          '${description}',
          '${pages}',
          '${dateOfPublication}',
          '${editionLanguage}',
          '${price}',
          '${onlineStores}'

      );
      `;
      const dbResponse = await db.run(addQuery);
      const bookId = dbResponse.lastID;
      response.send({ bookId: bookId });
    });

    //update database using put method

    app.put("/books/:bookId/", async (request, response) => {
      const { bookId } = request.params;
      const bookDetails = request.body;
      const {
        title,
        authorId,
        rating,
        ratingCount,
        reviewCount,
        description,
        pages,
        dateOfPublication,
        editionLanguage,
        price,
        onlineStores,
      } = bookDetails;
      const updateBookQuery = `
    UPDATE
      book
    SET
      title='${title}',
      author_id=${authorId},
      rating=${rating},
      rating_count=${ratingCount},
      review_count=${reviewCount},
      description='${description}',
      pages=${pages},
      date_of_publication='${dateOfPublication}',
      edition_language='${editionLanguage}',
      price=${price},
      online_stores='${onlineStores}'
    WHERE
      book_id = ${bookId};`;
      await db.run(updateBookQuery);
      response.send("Book Updated Successfully");
    });

    //delete the book

    app.delete("/books/:bookId", async (request, response) => {
      const { bookId } = request.params;
      const deleteBookQuery = `
        delete from book 
        where book_id=${bookId};
        `;
      await db.run(deleteBookQuery);
      response.send("deleted book SuccessFully");
    });
  } catch (error) {
    console.log(`DB Error ${error.message}`);
    process.exit(1);
  }
};

instalizingDatabaseAndServer();
