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

 Date: 15/04/2019 15:43:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

drop database if exists koa;
create database koa;
use koa;


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
) ENGINE=InnoDB AUTO_INCREMENT=1005 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1004, 'xhfkindergarten', 'XHFkindergarten@gmail.com', '$2b$10$/giZnw3V6t0.BdIfmgf36OOdYRirCaKEH8dBX1MSKlb.dOAUsh.G.', '//www.gravatar.com/avatar/b3e1e6262aec2f3bb87dc4aafb31dccb?s=200&r=pg&d=mm');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
