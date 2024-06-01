INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("어린왕자들", "종이책", 0, "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2019-01-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("신데렐라들", "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2023-12-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("백설공주들", "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2023-11-01");

INSERT INTO books (title, form, isbn, summary, detail, author, pages, contents, price, pub_date)
VALUES ("흥부와 놀부들", "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2023-12-08");

select * FROM books 
LEFT JOIN category On books.category_id=category.id

SELECT * FROM books LEFT JOIN category ON books.category_id=category.id WHERE books.id = 1 


// 좋아요 추가
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (1, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (3, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (4, 4);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 1);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 2);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 3);
INSERT INTO likes (user_id, liked_book_id) VALUES (2, 5);


// 좋아요 삭제
DELETE FROM likes WHERE user_id = 1 AND liked_book_id = 3;

//장바구니 담기
INSERT INTO cartItems (book_id, quantity, user_id) VALUES (1,1,1)

//장바구니 조회
SELECT cartItem_id, cartItems.book_id,title,summary,quantity,price FROM cartItems LEFT JOIN books ON cartItems.book_id=books.book_id WHERE cartItems.user_id = 1;  

DELETE FROM cartItems WHERE cartItem_id = ?;

SELECT * FROM Bookshop.cartItems
WHERE user_id = 1
AND cartItem_id IN(1,3)


// 주문하기
// 배송 정보 입력
INSERT INTO delivery (address, receiver, contact) VALUES ("서울시 중구", "홍길동", "010-1234-5678");
const delivery_id = SELECT max(delivery_id) FROM delivery;

// 주문 정보 입력
INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) 
VALUES ("어린왕자들", 3, 60000, 1, delivery_id);
const order_id = SELECT max(order_id) FROM orders;

// 주문 상세 목록 입력
INSERT INTO orderedBook (order_id, book_id, quantity)
VALUES (order_id, 1, 1);
INSERT INTO orderedBook (order_id, book_id, quantity)
VALUES (order_id, 3, 2);

//

SELECT order_id, book_title,total_quantity,total_price,created_at,address,receiver,contact 
FROM orders
LEFT JOIN delivery
ON orders.delivery_id = delivery.delivery_id