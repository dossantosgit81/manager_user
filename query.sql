create table users(
	id_user serial primary key not null,
	name_user varchar(100),
	email_user varchar(150) not null unique,
	password_user varchar(200) not null,
	role_user int
);