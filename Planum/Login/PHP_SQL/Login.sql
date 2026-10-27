create database Bartotech;
use Bartotech;

create table cadastro(
id int not null primary key auto_increment,
email varchar(100) not null,
senha varchar(100) not null,
nome varchar(100) not null
);
select*from registros;
select*from cadastro;

create table registros(
    id int not null primary key auto_increment,
    usuario_id int not null,
    tabela varchar(30) not null,
    dados text not null,
    foreign key (usuario_id) references cadastro(id) on delete cascade
);
