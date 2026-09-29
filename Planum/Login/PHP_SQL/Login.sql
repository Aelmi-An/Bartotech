create database Bartotech;
use Bartotech;

create table cadastro(
id int not null primary key auto_increment,
email varchar(100) not null,
senha varchar(100) not null,
nome varchar(100) not null
);

select*from cadastro;
