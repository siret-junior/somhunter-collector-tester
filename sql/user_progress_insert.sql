insert into user_progress (id, user_string, display, last_modif) values (nextval('somsequence'), $1, 0, CURRENT_DATE);