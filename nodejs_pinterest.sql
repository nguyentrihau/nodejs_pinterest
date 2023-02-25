-- Adminer 4.8.1 MySQL 8.0.31 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

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
(15,	24,	'Đây là comment mới',	'2023-02-25 15:45:56',	4),
(15,	24,	'Đây là comment mới',	'2023-02-25 15:50:05',	5),
(15,	23,	'Đây là comment mới',	'2023-02-25 16:15:29',	6),
(15,	23,	'Đây là comment mới',	'2023-02-25 16:15:31',	7),
(15,	24,	'Đây là comment mới',	'2023-02-25 16:15:35',	8),
(15,	24,	'Đây là comment mới',	'2023-02-25 16:15:36',	9),
(15,	24,	'Đây là comment mới',	'2023-02-25 16:15:37',	10),
(15,	25,	'Đây là comment mới',	'2023-02-25 16:15:43',	11),
(15,	25,	'Đây là comment mới',	'2023-02-25 16:17:44',	12),
(15,	24,	'Đây là comment mới',	'2023-02-25 16:19:17',	13),
(15,	24,	'Đây là comment mới',	'2023-02-25 16:19:18',	14),
(15,	24,	'Đây là comment mới',	'2023-02-25 16:19:19',	15);

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


DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `permission_name` varchar(100) NOT NULL,
  `permission_value` int NOT NULL,
  PRIMARY KEY (`permission_value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


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


-- 2023-02-25 16:24:29
