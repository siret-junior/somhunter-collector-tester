create table user_progress (
    id           integer PRIMARY KEY,
    user_string  varchar(40) UNIQUE NOT NULL,
    display      integer NOT NULL,
    last_modif   date
);
