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

 Date: 10/05/2019 01:01:07
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `group_id` int(11) NOT NULL COMMENT '分组id',
  `content` text NOT NULL COMMENT '文章内容',
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '无标题' COMMENT '文章标题',
  `label_img` varchar(255) DEFAULT NULL COMMENT '标签图',
  `created_at` bigint(255) NOT NULL COMMENT '创建时间',
  `updated_at` bigint(255) NOT NULL COMMENT '更新时间',
  `summary` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '暂无简介' COMMENT '文章简介',
  `comment_num` int(11) NOT NULL DEFAULT '0' COMMENT '评论数',
  `like_num` int(11) NOT NULL DEFAULT '0' COMMENT '喜欢数',
  `view_time` int(11) NOT NULL DEFAULT '0' COMMENT '查看次数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1089 DEFAULT CHARSET=utf8;


SET FOREIGN_KEY_CHECKS = 1;