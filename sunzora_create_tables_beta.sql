CREATE TABLE users
(
  fb_user_id integer,
  email text,
  first_name character varying(70),
  last_name character varying(70),
  gender character varying(6),
  CONSTRAINT "User_pkey" PRIMARY KEY (fb_user_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE users
  OWNER TO postgres;

CREATE TYPE contest_type AS ENUM ('elo', 'star');
CREATE TABLE contest
(
  contest_id serial,
  type contest_type,
  title character varying(100),
  description character varying(250),
  start_date timestamp with time zone, 
  end_date timestamp with time zone,
  user_id integer,
  c_avatar character varying(40),
  CONSTRAINT contest_pkey PRIMARY KEY (contest_id),
  CONSTRAINT contest_fb_user_id_fkey FOREIGN KEY (fb_user_id)
    REFERENCES users (fb_user_id) MATCH SIMPLE
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
  entry_id serial,
  contest_id integer,
  user_id integer,
  image_details character varying(40) NOT NULL,
  text_details character varying(250),
  created_ts timestamp with time zone,
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

CREATE TABLE star_rating
(
  rating_id serial,
  entry_id integer NOT NULL,
  user_id integer,
  star_rating smallint,
  created_ts timestamp with time zone,
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

CREATE TABLE elo_rating
(
  rating_id serial,
  entry_id integer NOT NULL,
  user_id integer,
  elo_rating integer,
  competitor_id integer, 
  outcome character,
  created_ts timestamp with time zone,
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

INSERT INTO users (fb_user_id, email, first_name, last_name, gender)
VALUES ('10152564612991689', '', '', '', ''),
('310666765798989', '', '', '', '');

INSERT INTO contest (type, title, description, start_date, end_date, user_id, c_avatar)
VALUES ('elo', 'elo_con', 'This is an example elo contest', '12/29/2014 11:46:13', '', '1', '?'),
('star', 'star_con', 'This is an example star contest', '12/29/2014 11:46:13', '12/30/2014 11:47:13', '2', '?');

INSERT INTO permission (name)
VALUES ('submit_entry'),
('create_contest');

INSERT INTO entry (contest_id, user_id, image_details, text_details, created_ts)
VALUES ('1', '1', '?', 'first', '12/29/2014 11:47:13'),
('1', '2', '?', 'second', '12/29/2014 11:47:13'),
('1', '2', '?', 'third', '12/29/2014 11:47:13'),
('2', '1', '?', 'First', '12/29/2014 11:47:13'),
('2', '1', '?', 'Second', '12/29/2014 11:47:13'),
('2', '1', '?', 'Third', '12/29/2014 11:47:13'),
('2', '2', '?', 'Fourth', '12/29/2014 11:47:13'),
('2', '2', '?', 'Fifth', '12/29/2014 11:47:13'),
('2', '2', '?', 'Sixth', '12/29/2014 11:47:13');

INSERT INTO permission_link
VALUES ('1', '1'),
('2', '1'),
('2', '2');

INSERT INTO star_rating (entry_id, user_id, star_rating, created_ts)
VALUES ('1', '1', '4', '12/29/2014 11:47:13'),
('2', '1', '5', '12/29/2014 11:47:13'),
('1', '2', '6', '12/29/2014 11:47:13');

INSERT INTO elo_rating (entry_id, user_id, elo_rating, competitor_id, outcome, created_ts)
VALUES ('4', '11', '110', '5', 'w', '12/29/2014 11:47:13'),
('5', '11', '90', '4', 'l', '12/29/2014 11:47:13'),
('4', '22', '120', '6', 'w', '12/29/2014 11:47:13'),
('6', '22', '90', '4', 'l', '12/29/2014 11:47:13'),
('4', '33', '110', '7', 'l', '12/29/2014 11:47:13'),
('7', '33', '110', '4', 'w', '12/29/2014 11:47:13'),
('4', '44', '120', '8', 'w', '12/29/2014 11:47:13'),
('8', '44', '90', '4', 'l', '12/29/2014 11:47:13'),
('5', '55', '100', '6', 'w', '12/29/2014 11:47:13'),
('6', '55', '80', '5', 'l', '12/29/2014 11:47:13');