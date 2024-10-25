export default {
  getBook: `
    SELECT
        books.id,
        title,
        authors,
        publisher,
        published,
        genre,
        summary
    FROM
        books
    WHERE
        books.id = $1 OR title = $1
  `,
  getAllBook: `
    SELECT
      books.id,
      title,
      authors,
      publisher,
      published,
      genre,
      summary
  FROM
      books;
`,
  createBook: `
    INSERT INTO 
        books(title, authors, publisher, published, genre, summary, cover_image)
    VALUES
        ($(title), $(authors), $(publisher), 
        $(published), $(genre), $(summary), $(cover_image))
    RETURNING id
  `,
  updateBook: `
    UPDATE 
      books
    SET
      title = COALESCE($(title), title),
      authors = COALESCE($(authors), authors),
      publisher = COALESCE($(publisher), publisher),
      published = COALESCE($(published), published),
      genre = COALESCE($(genre), genre),
      summary = COALESCE($(summary), summary),
      cover_image = COALESCE($(cover_image), cover_image),
      updated_at = NOW()
  WHERE
      id = $(id)
  RETURNING *;
`,
  deleteBook: `
    DELETE FROM 
      books
    WHERE 
      id = $1
    RETURNING
      books.id
  `,
  purchaseBook: `
    INSERT INTO
      purchases(email, user_id, username, book_id, amount, purchase_status, reference, callback_url)
    VALUES
      ($(email), $(user_id), $(username), $(book_id), $(amount), 
      $(purchase_status), $(reference), $(callback_url))
    RETURNING *;
  `,
  updatePurchaseStatus: `
    UPDATE
      purchases
    SET
      purchase_status = $(purchase_status)
    WHERE
      reference = $(reference)  
  `,
  fetchPurchasedBooks: `
    SELECT
      id,
      book_id,
      user_id,
      amount,
      purchase_status,
      reference,
      created_at
    FROM
      purchases
    WHERE
      reference = $1 OR user_id = $1;
  `,
};
