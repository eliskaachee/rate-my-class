CREATE DATABASE ratemyclass;

DROP TABLE comment;
DROP TABLE professors;
DROP TABLE course;
DROP TABLE student;

CREATE TABLE student (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL
);

CREATE TABLE course (
  id SERIAL PRIMARY KEY NOT NULL,
  course_code VARCHAR(10) NOT NULL
);

CREATE TABLE professor (
  id SERIAL PRIMARY KEY NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL
);

CREATE TABLE comment (
  id SERIAL PRIMARY KEY NOT NULL,
  comment_text TEXT NOT NULL,
  date_added DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  student_id INT references student(id) NOT NULL,
  course_id INT references course(id) NOT NULL,
  professor_id INT references professor(id)
);

CREATE USER ta_user WITH PASSWORD 'ta_pass';
GRANT SELECT, INSERT, UPDATE ON student TO ta_user;
GRANT SELECT, INSERT, UPDATE ON course TO ta_user;
GRANT SELECT, INSERT, UPDATE ON professor TO ta_user;
GRANT SELECT, INSERT, UPDATE ON comment TO ta_user;
GRANT USAGE, SELECT ON SEQUENCE student_id_seq TO ta_user;
GRANT USAGE, SELECT ON SEQUENCE course_id_seq TO ta_user;
GRANT USAGE, SELECT ON SEQUENCE professor_id_seq TO ta_user;
GRANT USAGE, SELECT ON SEQUENCE comment_id_seq TO ta_user;

INSERT INTO student(first_name, last_name, username, password) VALUES
  ('Eliska', 'Achee', 'eachee', 'password');

INSERT INTO course(course_code) VALUES
  ('CS101'),
  ('CS124'),
  ('CS165'),
  ('CS213'),
  ('CS225'),
  ('CS235'),
  ('CS237'),
  ('CS238'),
  ('CS241'),
  ('CS246'),
  ('CS306'),
  ('CS308'),
  ('CS312'),
  ('CS313'),
  ('CS335'),
  ('CS345'),
  ('CS364'),
  ('CS371'),
  ('CS416'),
  ('CS432'),
  ('CS450'),
  ('CS460'),
  ('CS470'),
  ('CS480'),
  ('CS490R'),
  ('CS499'),
  ('ECEN101'),
  ('ECEN150'),
  ('ECEN160'),
  ('ECEN160L'),
  ('ECEN250'),
  ('ECEN260'),
  ('ECEN324'),
  ('ECEN340'),
  ('ECEN350'),
  ('ECEN351'),
  ('ECEN361'),
  ('ECEN380'),
  ('ECEN390'),
  ('ECEN410'),
  ('ECEN420'),
  ('ECEN430'),
  ('ECEN440'),
  ('ECEN451'),
  ('ECEN461'),
  ('ECEN470'),
  ('ECEN480'),
  ('ECEN490R'),
  ('ECEN499');

INSERT INTO professor(first_name, last_name) VALUES
  ('Richard', 'Grimmett'),
  ('Scott', 'Burton'),
  ('Bill', 'Clements'),
  ('Luc', 'Comeau'),
  ('Kevin', 'Cook'),
  ('Scott', 'Ercanbrack'),
  ('Rex', 'Fisher'),
  ('James', 'Helfrich'),
  ('Randy', 'Jack'),
  ('Ron', 'Jones'),
  ('Eric', 'Karl'),
  ('Chad', 'Macbeth'),
  ('Rick', 'Neff'),
  ('Jody', 'Swenson'),
  ('Kevin', 'Smith'),
  ('Kristi', 'Hansen');

INSERT INTO comment(comment_text, student_id, course_id, professor_id) VALUES
  ('Buy the book, you will want to keep it!', 1, 20, 3),
  ('Take this class early -- it teaches a lot of valuable web skills.', 1, 14, 2),
  ('Make sure to work with other people on labs -- it is extremely necessary', 1, 33, 10);
