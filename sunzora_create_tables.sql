CREATE TABLE contest
(
  title character varying(100),
  description character varying(250),
  end_date timestamp with time zone,
  start_date timestamp with time zone,
  contest_id integer NOT NULL,
  CONSTRAINT contest_pkey PRIMARY KEY (contest_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE contest
  OWNER TO postgres;

CREATE TABLE users
(
  email text,
  password character(40),
  user_id integer NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY (user_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO postgres;

CREATE TABLE permission
(
  permission_id integer NOT NULL,
  name character varying(100),
  CONSTRAINT permission_pkey PRIMARY KEY (permission_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE permission
  OWNER TO postgres;

CREATE TABLE entry
(
  contest_id integer,
  entry_id integer NOT NULL,
  user_id integer,
  text_details character varying(250),
  CONSTRAINT entry_pkey PRIMARY KEY (entry_id),
  CONSTRAINT entry_contest_id_fkey FOREIGN KEY (contest_id)
      REFERENCES contest (contest_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT entry_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE entry
  OWNER TO postgres;

CREATE TABLE permission_link
(
  user_id integer NOT NULL,
  permission_id integer NOT NULL,
  CONSTRAINT permission_link_pkey PRIMARY KEY (user_id, permission_id),
  CONSTRAINT permission_link_permission_id_fkey FOREIGN KEY (permission_id)
      REFERENCES permission (permission_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT permission_link_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE permission_link
  OWNER TO postgres;

CREATE TABLE rating
(
  entry_id integer NOT NULL,
  user_id integer,
  selected_rating smallint,
  rating_id integer NOT NULL,
  CONSTRAINT rating_pkey PRIMARY KEY (rating_id),
  CONSTRAINT rating_entry_id_fkey FOREIGN KEY (entry_id)
      REFERENCES entry (entry_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT rating_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES users (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE rating
  OWNER TO postgres;

INSERT INTO contest 
VALUES ('best 3 word entries', 'Submit entries of 3 words and vote on best one','2015-12-31 11:46:13-05','2014-12-29 11:46:13-05', '1'),
('best 5 word entries', 'Submit entries of 5 words and vote on best one', '2014-12-30 11:47:13-05', '2014-12-29 11:47:13-05', '2');

INSERT INTO users
VALUES ('tlebeda@gmail.com', 'pass1234', '1'),
('mark.karavan@gmail.com', 'pass4321', '2');

INSERT INTO permission
VALUES ('1','submit entry'),
('2', 'create contest');

INSERT INTO entry
VALUES ('1','1','1','Blue Man Dude'),
('1', '2', '2', 'Three Random Words'),
('2', '3', '1', 'Now I need five words'),
('2', '4', '1', 'I have submitted two entries'),
('2', '5', '2', 'Mark has one submission here');

INSERT INTO permission_link
VALUES ('1', '1'),
('2', '1'),
('2', '2');

INSERT INTO rating
VALUES ('1', '1', '4', '1'),
('2', '1', '5', '2'),
('3', '1', '6', '3'),
('4', '1', '7', '4'),
('5', '1', '5', '5'),
('1', '2', '5', '6'),
('2', '2', '5', '7'),
('3', '2', '5', '8'),
('4', '2', '5', '9'),
('5', '2', '8', '10');