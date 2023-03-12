-- Adminer 4.8.1 MySQL 8.0.31 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `nodejs_pinterest`;
CREATE DATABASE `nodejs_pinterest` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `nodejs_pinterest`;

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `user_id` int NOT NULL,
  `img_id` int NOT NULL,
  `comment` varchar(255) NOT NULL,
  `comment_time` datetime NOT NULL,
  `comment_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `img_id` (`img_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`img_id`) REFERENCES `images` (`img_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `comments` (`user_id`, `img_id`, `comment`, `comment_time`, `comment_id`) VALUES
(15,	137,	'không có để trống',	'2023-03-08 07:04:33',	6);

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `img_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `img_time` date NOT NULL,
  `img_name` longtext NOT NULL,
  `path` varchar(150) NOT NULL,
  PRIMARY KEY (`img_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `images` (`img_id`, `user_id`, `img_time`, `img_name`, `path`) VALUES
(137,	15,	'2023-03-08',	'newUpdate',	'1678257074073_pexels-cesar-perez-733745.jpg'),
(139,	15,	'2023-03-08',	'My first upload imgs',	'1678259716339_floral-designs-3840x2160-10372.jpg'),
(140,	15,	'2023-03-08',	'My first upload imgs',	'1678259732685_floral-designs-3840x2160-10372.jpg'),
(141,	15,	'2023-03-08',	'My first upload imgs',	'1678259740913_floral-designs-3840x2160-10372.jpg');

DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `permission_name` varchar(100) NOT NULL,
  `permission_value` int NOT NULL,
  PRIMARY KEY (`permission_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `permission` (`permission_name`, `permission_value`) VALUES
('Banned user',	0),
('Members',	1),
('Editors',	2),
('Moderators',	3),
('Administrators',	4);

DROP TABLE IF EXISTS `save`;
CREATE TABLE `save` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `img_id` int NOT NULL,
  `save_time` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `img_id` (`img_id`),
  CONSTRAINT `save_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `save_ibfk_2` FOREIGN KEY (`img_id`) REFERENCES `images` (`img_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password` varchar(500) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `age` int NOT NULL,
  `avatar` longtext,
  `permission` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`user_id`),
  KEY `permission` (`permission`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`permission`) REFERENCES `permission` (`permission_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`user_id`, `email`, `password`, `user_name`, `age`, `avatar`, `permission`) VALUES
(14,	'abc@gmail.com',	'$2b$10$3RQSMdq.RHVWK9JVggtz/e.ToVIQK75HAhHcxZuKp3com7n7psK7.',	'hau',	18,	'1678032998942_pexels-cesar-perez-733745.jpg',	4),
(15,	'abcd@gmail.com',	'$2b$10$g1xDinVJAjmIaoXcAyBALuJoE4vWJQX21lgbyMQCdIYQB.HbT1M1a',	'Thinh',	26,	'avatardefault.png',	3),
(16,	'abce@gmail.com',	'$2b$10$el.91ZNXNR2N5vmIQCeyiuw9g789qVWlRqhvMgY0tAAfXOCzRDElK',	'Thinh',	26,	'avatardefault.png	',	0),
(17,	'abcf@gmail.com',	'$2b$10$cj.HUrUGO0scy19nblV/UOiB8lE2Z51igvO93ZA7egb1plQY1hnRy',	'Thinh',	26,	'avatardefault.png',	1),
(18,	'xyz@gmail.com',	'$2b$10$s5YIM6GJhXR3cpk9Jr7Mpefcwl6jSmI8T6HygJE35KgoWnm8q1PM6',	'thinh abc',	8,	'1677779830586_pexels-cesar-perez-733745.jpg',	0),
(19,	'hau@gmail.com',	'$2b$10$si/JN3KYTnfa4e1ftuPjjOjTfZrqg7TmjrZO2rrVlVoZS/9CRhfue',	'Hau',	26,	'avatardefault.png',	1);

-- 2023-03-12 06:21:09
