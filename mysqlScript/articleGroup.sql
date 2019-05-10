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

 Date: 10/05/2019 11:13:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for articleGroup
-- ----------------------------
DROP TABLE IF EXISTS `articleGroup`;
CREATE TABLE `articleGroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '分组id',
  `name` varchar(255) NOT NULL DEFAULT '默认分组' COMMENT '分组名称',
  `userId` int(11) NOT NULL COMMENT '用户id',
  `createdAt` bigint(255) NOT NULL COMMENT '创建时间',
  `updatedAt` bigint(20) NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1024 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;
