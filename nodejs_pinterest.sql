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
(18,	56,	'Đây là comment mới!',	'2023-02-26 16:59:08',	26),
(18,	56,	'Đây là comment mới 123 xyz!',	'2023-02-26 16:59:14',	27),
(18,	56,	'abcsd',	'2023-02-26 16:59:14',	28),
(18,	56,	'abcsd',	'2023-02-26 16:59:15',	29),
(15,	56,	'abcsd',	'2023-02-26 17:07:49',	30),
(15,	56,	'không có để trống',	'2023-02-26 17:07:52',	31),
(15,	56,	'abcsd',	'2023-02-26 17:07:54',	32),
(15,	56,	'abcsd',	'2023-02-26 17:16:00',	33),
(15,	56,	'commet mới tinh',	'2023-02-26 17:20:29',	34),
(15,	56,	'commet mới tinh',	'2023-02-26 17:21:34',	35),
(15,	56,	'comment mới tinh',	'2023-02-26 17:21:36',	36),
(15,	56,	'comment mới tinh',	'2023-02-26 17:22:25',	37),
(15,	56,	'comment mới tinh',	'2023-02-26 17:22:49',	38),
(15,	56,	'comment mới tinh',	'2023-02-26 17:23:03',	39),
(15,	56,	'comment mới tinh',	'2023-02-26 17:25:03',	40),
(15,	56,	'comment mới tinh',	'2023-02-26 17:25:45',	41),
(15,	56,	'comment mới tinh',	'2023-02-26 17:26:43',	42);

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
(56,	18,	'2023-02-26',	'My first upload imgs',	'1677426453955_avatardefault.png'),
(57,	18,	'2023-02-26',	'My first upload imgs',	'1677427047916_avatardefault.png'),
(58,	18,	'2023-02-26',	'My first upload imgs',	'1677427055550_avatardefault.png'),
(59,	18,	'2023-02-26',	'My first upload imgs',	'1677427697053_avatardefault.png'),
(60,	18,	'2023-02-26',	'My first upload imgs',	'1677427976548_avatardefault.png');

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
(14,	'abc@gmail.com',	'$2b$10$3RQSMdq.RHVWK9JVggtz/e.ToVIQK75HAhHcxZuKp3com7n7psK7.',	'Thinh',	26,	'avatardefault.png',	4),
(15,	'abcd@gmail.com',	'$2b$10$g1xDinVJAjmIaoXcAyBALuJoE4vWJQX21lgbyMQCdIYQB.HbT1M1a',	'Thinh',	26,	'avatardefault.png',	1),
(16,	'abce@gmail.com',	'$2b$10$el.91ZNXNR2N5vmIQCeyiuw9g789qVWlRqhvMgY0tAAfXOCzRDElK',	'Thinh',	26,	'avatardefault.png	',	0),
(17,	'abcf@gmail.com',	'$2b$10$cj.HUrUGO0scy19nblV/UOiB8lE2Z51igvO93ZA7egb1plQY1hnRy',	'Thinh',	26,	'avatardefault.png',	1),
(18,	'xyz@gmail.com',	'$2b$10$s5YIM6GJhXR3cpk9Jr7Mpefcwl6jSmI8T6HygJE35KgoWnm8q1PM6',	'Thinh',	26,	'avatardefault.png',	1);

-- 2023-02-26 18:40:10
