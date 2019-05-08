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

 Date: 08/05/2019 22:54:24
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

-- ----------------------------
-- Records of articleGroup
-- ----------------------------
BEGIN;
INSERT INTO `articleGroup` VALUES (1019, 'Sequelize', 1031, 1557241863243, 1557241863243);
INSERT INTO `articleGroup` VALUES (1021, 'Vue-element', 1037, 1557246429651, 1557246429651);
INSERT INTO `articleGroup` VALUES (1022, 'Koa', 1031, 1557301991268, 1557301991268);
INSERT INTO `articleGroup` VALUES (1023, 'Mysql', 1037, 1557321637377, 1557321637377);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
