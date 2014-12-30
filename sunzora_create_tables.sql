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

CREATE TABLE "user"
(
  username character varying(100)[],
  password character(40),
  user_id integer NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY (user_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "user"
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
      REFERENCES "user" (user_id) MATCH SIMPLE
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
      REFERENCES "user" (user_id) MATCH SIMPLE
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
      REFERENCES "user" (user_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE rating
  OWNER TO postgres;