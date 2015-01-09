CREATE TABLE users
(
  email text,
  password character(40),
  user_id serial,
  CONSTRAINT "User_pkey" PRIMARY KEY (user_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO postgres;

CREATE TABLE contest
(
  title character varying(100),
  description character varying(250),
  end_date timestamp with time zone,
  start_date timestamp with time zone,
  contest_id serial,
  user_id integer,
  CONSTRAINT contest_pkey PRIMARY KEY (contest_id),
  CONSTRAINT contest_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES users (user_id) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE contest
  OWNER TO postgres;
CREATE TABLE permission
(
  permission_id serial,
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
  entry_id serial,
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
  rating_id serial,
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

CREATE OR REPLACE FUNCTION rating_upsert(eid INT, uid INT, rating_value INT2) RETURNS VOID AS
$$
BEGIN
        UPDATE public.rating SET selected_rating = rating_value WHERE user_id = uid AND entry_id = eid;
        IF found THEN
            RETURN;
        END IF;

        BEGIN
            INSERT INTO public.rating(entry_id, user_id, selected_rating) VALUES (eid, uid, rating_value);
            RETURN;
        EXCEPTION WHEN unique_violation THEN

        END;
END;
$$
LANGUAGE plpgsql;

INSERT INTO users (email, password)
VALUES ('tlebeda@gmail.com', 'pass1234'),
('mark.karavan@gmail.com', 'pass4321');

INSERT INTO contest (title, description, end_date, start_date, user_id)
VALUES ('best 3 word entries', 'Submit entries of 3 words and vote on best one','2015-12-31 11:46:13-05','now()', '1'),
('best 5 word entries', 'Submit entries of 5 words and vote on best one', '2014-12-30 11:47:13-05', '2014-12-29 11:47:13-05', '2');

INSERT INTO permission (name)
VALUES ('submit entry'),
('create contest');

INSERT INTO entry (contest_id, user_id, text_details)
VALUES ('1','1', 'Blue Man Dude'),
('1', '2', 'Three Random Words'),
('2', '1', 'Now I need five words'),
('2', '1', 'I have submitted two entries'),
('2', '2', 'Mark has one submission here');

INSERT INTO permission_link
VALUES ('1', '1'),
('2', '1'),
('2', '2');

INSERT INTO rating (entry_id, user_id, selected_rating)
VALUES ('1', '1', '4'),
('2', '1', '5'),
('3', '1', '6'),
('4', '1', '7'),
('5', '1', '5'),
('3', '2', '5'),
('4', '2', '5'),
('5', '2', '8');