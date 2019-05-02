/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80012
 Source Host           : localhost:3306
 Source Schema         : koa

 Target Server Type    : MySQL
 Target Server Version : 80012
 File Encoding         : 65001

 Date: 02/05/2019 22:15:37
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `email` varchar(255) NOT NULL COMMENT '注册邮箱',
  `password` varchar(255) NOT NULL COMMENT '用户密码',
  `avatar` varchar(255) DEFAULT NULL COMMENT '用户头像',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1026 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1024, 'lzk', '1131911308@qq.com', '$2b$10$hxuakXxTcRiTLU6Z1O93W.PNPSn70K1TFAcHW0wly1NyXVgBeTpy.', 'http://localhost:3000/upload/avatar/1556676727159.png');
INSERT INTO `users` VALUES (1025, 'XHFkindergarten', '791319924@qq.com', '$2b$10$Iu2SSPIv0KMDmEraE3gYEeMvUJGcZ.q9HBZ2wmN5MhMWbKsy9.YxS', 'http://localhost:3000/upload/avatar/default-avatar.png');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
