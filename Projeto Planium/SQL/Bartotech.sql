create database Bartotech;
use Bartotech;

create table login(
id int not null primary key auto_increment,
email varchar(100) not null,
senha varchar(100) not null,
nome varchar(100) not null
);
create table produto(
id int not null primary key auto_increment,
nome varchar (100) not null,
categoria varchar (100) not null,
prc int not null,
qtd float not null
);




select*from produto;
drop database Bartotech;