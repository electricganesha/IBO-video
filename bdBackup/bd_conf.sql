-- phpMyAdmin SQL Dump
-- version 4.4.15.5
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Oct 31, 2016 at 06:31 PM
-- Server version: 5.5.49-log
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bd_conf`
--

-- --------------------------------------------------------

--
-- Table structure for table `cadeiras`
--

CREATE TABLE IF NOT EXISTS `cadeiras` (
  `nome_procedural` varchar(255) NOT NULL DEFAULT '',
  `fila` varchar(255) NOT NULL DEFAULT '',
  `lugar` varchar(255) NOT NULL DEFAULT '',
  `estado` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `cadeiras`
--

INSERT INTO `cadeiras` (`nome_procedural`, `fila`, `lugar`, `estado`) VALUES
('CADEIRA_12', 'L', '1', 'LIVRE'),
('CADEIRA_13', 'L', '2', 'LIVRE'),
('CADEIRA_14', 'L', '3', 'LIVRE'),
('CADEIRA_15', 'L', '4', 'LIVRE'),
('CADEIRA_16', 'L', '5', 'LIVRE'),
('CADEIRA_17', 'L', '6', 'LIVRE'),
('CADEIRA_18', 'L', '7', 'LIVRE'),
('CADEIRA_19', 'L', '8', 'LIVRE'),
('CADEIRA_22', 'L', '9', 'LIVRE'),
('CADEIRA_23', 'L', '10', 'LIVRE'),
('CADEIRA_21', 'L', '11', 'LIVRE'),
('CADEIRA_20', 'L', '12', 'LIVRE'),
('CADEIRA_11', 'L', '13', 'LIVRE'),
('CADEIRA_10', 'L', '14', 'LIVRE'),
('CADEIRA_9', 'L', '15', 'LIVRE'),
('CADEIRA_8', 'L', '16', 'LIVRE'),
('CADEIRA_6', 'L', '17', 'LIVRE'),
('CADEIRA_7', 'L', '18', 'LIVRE'),
('CADEIRA_4', 'L', '19', 'LIVRE'),
('CADEIRA_5', 'L', '20', 'LIVRE'),
('CADEIRA_2', 'L', '21', 'LIVRE'),
('CADEIRA_3', 'L', '22', 'LIVRE'),
('CADEIRA_1', 'L', '23', 'LIVRE'),
('CADEIRA_0', 'L', '24', 'LIVRE'),
('CADEIRA_36', 'K', '1', 'LIVRE'),
('CADEIRA_37', 'K', '2', 'LIVRE'),
('CADEIRA_38', 'K', '3', 'LIVRE'),
('CADEIRA_39', 'K', '4', 'LIVRE'),
('CADEIRA_40', 'K', '5', 'LIVRE'),
('CADEIRA_41', 'K', '6', 'LIVRE'),
('CADEIRA_42', 'K', '7', 'LIVRE'),
('CADEIRA_43', 'K', '8', 'LIVRE'),
('CADEIRA_46', 'K', '9', 'LIVRE'),
('CADEIRA_47', 'K', '10', 'LIVRE'),
('CADEIRA_45', 'K', '11', 'LIVRE'),
('CADEIRA_44', 'K', '12', 'LIVRE'),
('CADEIRA_35', 'K', '13', 'LIVRE'),
('CADEIRA_34', 'K', '14', 'LIVRE'),
('CADEIRA_33', 'K', '15', 'LIVRE'),
('CADEIRA_32', 'K', '16', 'LIVRE'),
('CADEIRA_31', 'K', '17', 'LIVRE'),
('CADEIRA_30', 'K', '18', 'LIVRE'),
('CADEIRA_29', 'K', '19', 'LIVRE'),
('CADEIRA_28', 'K', '20', 'LIVRE'),
('CADEIRA_27', 'K', '21', 'LIVRE'),
('CADEIRA_26', 'K', '22', 'LIVRE'),
('CADEIRA_25', 'K', '23', 'LIVRE'),
('CADEIRA_24', 'K', '24', 'LIVRE'),
('CADEIRA_235', 'J', '1', 'LIVRE'),
('CADEIRA_236', 'J', '2', 'LIVRE'),
('CADEIRA_237', 'J', '3', 'LIVRE'),
('CADEIRA_238', 'J', '4', 'LIVRE'),
('CADEIRA_239', 'J', '5', 'LIVRE'),
('CADEIRA_240', 'J', '6', 'LIVRE'),
('CADEIRA_241', 'J', '7', 'LIVRE'),
('CADEIRA_242', 'J', '8', 'LIVRE'),
('CADEIRA_243', 'J', '9', 'LIVRE'),
('CADEIRA_244', 'J', '10', 'LIVRE'),
('CADEIRA_245', 'J', '11', 'LIVRE'),
('CADEIRA_246', 'J', '12', 'LIVRE'),
('CADEIRA_247', 'J', '13', 'LIVRE'),
('CADEIRA_234', 'J', '14', 'LIVRE'),
('CADEIRA_233', 'J', '15', 'LIVRE'),
('CADEIRA_232', 'J', '16', 'LIVRE'),
('CADEIRA_231', 'J', '17', 'LIVRE'),
('CADEIRA_230', 'J', '18', 'LIVRE'),
('CADEIRA_229', 'J', '19', 'LIVRE'),
('CADEIRA_228', 'J', '20', 'LIVRE'),
('CADEIRA_227', 'J', '21', 'LIVRE'),
('CADEIRA_226', 'J', '22', 'LIVRE'),
('CADEIRA_225', 'J', '23', 'LIVRE'),
('CADEIRA_224', 'J', '24', 'LIVRE'),
('CADEIRA_223', 'J', '25', 'LIVRE'),
('CADEIRA_213', 'I', '1', 'LIVRE'),
('CADEIRA_214', 'I', '2', 'LIVRE'),
('CADEIRA_215', 'I', '3', 'LIVRE'),
('CADEIRA_300', 'I', '4', 'LIVRE'),
('CADEIRA_301', 'I', '5', 'LIVRE'),
('CADEIRA_216', 'I', '6', 'LIVRE'),
('CADEIRA_217', 'I', '7', 'LIVRE'),
('CADEIRA_218', 'I', '8', 'LIVRE'),
('CADEIRA_219', 'I', '9', 'LIVRE'),
('CADEIRA_220', 'I', '10', 'LIVRE'),
('CADEIRA_221', 'I', '11', 'LIVRE'),
('CADEIRA_222', 'I', '12', 'LIVRE'),
('CADEIRA_212', 'I', '13', 'LIVRE'),
('CADEIRA_211', 'I', '14', 'LIVRE'),
('CADEIRA_210', 'I', '15', 'LIVRE'),
('CADEIRA_209', 'I', '16', 'LIVRE'),
('CADEIRA_208', 'I', '17', 'LIVRE'),
('CADEIRA_207', 'I', '18', 'LIVRE'),
('CADEIRA_206', 'I', '19', 'LIVRE'),
('CADEIRA_205', 'I', '20', 'LIVRE'),
('CADEIRA_204', 'I', '21', 'LIVRE'),
('CADEIRA_203', 'I', '22', 'LIVRE'),
('CADEIRA_202', 'I', '23', 'LIVRE'),
('CADEIRA_189', 'H', '1', 'LIVRE'),
('CADEIRA_109', 'H', '2', 'LIVRE'),
('CADEIRA_191', 'H', '3', 'LIVRE'),
('CADEIRA_192', 'H', '4', 'LIVRE'),
('CADEIRA_193', 'H', '5', 'LIVRE'),
('CADEIRA_194', 'H', '6', 'LIVRE'),
('CADEIRA_195', 'H', '7', 'LIVRE'),
('CADEIRA_196', 'H', '8', 'LIVRE'),
('CADEIRA_197', 'H', '9', 'LIVRE'),
('CADEIRA_198', 'H', '10', 'LIVRE'),
('CADEIRA_199', 'H', '11', 'LIVRE'),
('CADEIRA_201', 'H', '12', 'LIVRE'),
('CADEIRA_200', 'H', '13', 'LIVRE'),
('CADEIRA_188', 'H', '14', 'LIVRE'),
('CADEIRA_187', 'H', '15', 'LIVRE'),
('CADEIRA_186', 'H', '16', 'LIVRE'),
('CADEIRA_185', 'H', '17', 'LIVRE'),
('CADEIRA_184', 'H', '18', 'LIVRE'),
('CADEIRA_183', 'H', '19', 'LIVRE'),
('CADEIRA_182', 'H', '20', 'LIVRE'),
('CADEIRA_181', 'H', '21', 'LIVRE'),
('CADEIRA_180', 'H', '22', 'LIVRE'),
('CADEIRA_179', 'H', '23', 'LIVRE'),
('CADEIRA_178', 'H', '24', 'LIVRE'),
('CADEIRA_177', 'H', '25', 'LIVRE'),
('CADEIRA_152', 'G', '1', 'LIVRE'),
('CADEIRA_153', 'G', '2', 'LIVRE'),
('CADEIRA_154', 'G', '3', 'LIVRE'),
('CADEIRA_155', 'G', '4', 'LIVRE'),
('CADEIRA_156', 'G', '5', 'LIVRE'),
('CADEIRA_157', 'G', '6', 'LIVRE'),
('CADEIRA_158', 'G', '7', 'LIVRE'),
('CADEIRA_159', 'G', '8', 'LIVRE'),
('CADEIRA_160', 'G', '9', 'LIVRE'),
('CADEIRA_161', 'G', '10', 'LIVRE'),
('CADEIRA_162', 'G', '11', 'LIVRE'),
('CADEIRA_163', 'G', '12', 'LIVRE'),
('CADEIRA_164', 'G', '13', 'LIVRE'),
('CADEIRA_176', 'G', '14', 'LIVRE'),
('CADEIRA_175', 'G', '15', 'LIVRE'),
('CADEIRA_174', 'G', '16', 'LIVRE'),
('CADEIRA_173', 'G', '17', 'LIVRE'),
('CADEIRA_172', 'G', '18', 'LIVRE'),
('CADEIRA_171', 'G', '19', 'LIVRE'),
('CADEIRA_170', 'G', '20', 'LIVRE'),
('CADEIRA_169', 'G', '21', 'LIVRE'),
('CADEIRA_168', 'G', '22', 'LIVRE'),
('CADEIRA_167', 'G', '23', 'LIVRE'),
('CADEIRA_166', 'G', '24', 'LIVRE'),
('CADEIRA_165', 'G', '25', 'LIVRE'),
('CADEIRA_139', 'F', '1', 'LIVRE'),
('CADEIRA_140', 'F', '2', 'LIVRE'),
('CADEIRA_141', 'F', '3', 'LIVRE'),
('CADEIRA_142', 'F', '4', 'LIVRE'),
('CADEIRA_143', 'F', '5', 'LIVRE'),
('CADEIRA_144', 'F', '6', 'LIVRE'),
('CADEIRA_145', 'F', '7', 'LIVRE'),
('CADEIRA_146', 'F', '8', 'LIVRE'),
('CADEIRA_147', 'F', '9', 'LIVRE'),
('CADEIRA_148', 'F', '10', 'LIVRE'),
('CADEIRA_149', 'F', '11', 'LIVRE'),
('CADEIRA_150', 'F', '12', 'LIVRE'),
('CADEIRA_151', 'F', '13', 'LIVRE'),
('CADEIRA_138', 'F', '14', 'LIVRE'),
('CADEIRA_137', 'F', '15', 'LIVRE'),
('CADEIRA_136', 'F', '16', 'LIVRE'),
('CADEIRA_135', 'F', '17', 'LIVRE'),
('CADEIRA_134', 'F', '18', 'LIVRE'),
('CADEIRA_133', 'F', '19', 'LIVRE'),
('CADEIRA_132', 'F', '20', 'LIVRE'),
('CADEIRA_131', 'F', '21', 'LIVRE'),
('CADEIRA_130', 'F', '22', 'LIVRE'),
('CADEIRA_129', 'F', '23', 'LIVRE'),
('CADEIRA_128', 'F', '24', 'LIVRE'),
('CADEIRA_127', 'F', '25', 'LIVRE'),
('CADEIRA_102', 'E', '1', 'LIVRE'),
('CADEIRA_103', 'E', '2', 'LIVRE'),
('CADEIRA_104', 'E', '3', 'LIVRE'),
('CADEIRA_105', 'E', '4', 'LIVRE'),
('CADEIRA_106', 'E', '5', 'LIVRE'),
('CADEIRA_107', 'E', '6', 'LIVRE'),
('CADEIRA_108', 'E', '7', 'LIVRE'),
('CADEIRA_109', 'E', '8', 'LIVRE'),
('CADEIRA_110', 'E', '9', 'LIVRE'),
('CADEIRA_111', 'E', '10', 'LIVRE'),
('CADEIRA_112', 'E', '11', 'LIVRE'),
('CADEIRA_113', 'E', '12', 'LIVRE'),
('CADEIRA_114', 'E', '13', 'LIVRE'),
('CADEIRA_126', 'E', '14', 'LIVRE'),
('CADEIRA_125', 'E', '15', 'LIVRE'),
('CADEIRA_124', 'E', '16', 'LIVRE'),
('CADEIRA_123', 'E', '17', 'LIVRE'),
('CADEIRA_122', 'E', '18', 'LIVRE'),
('CADEIRA_121', 'E', '19', 'LIVRE'),
('CADEIRA_120', 'E', '20', 'LIVRE'),
('CADEIRA_119', 'E', '21', 'LIVRE'),
('CADEIRA_118', 'E', '22', 'LIVRE'),
('CADEIRA_117', 'E', '23', 'LIVRE'),
('CADEIRA_116', 'E', '24', 'LIVRE'),
('CADEIRA_115', 'E', '25', 'LIVRE'),
('CADEIRA_89', 'D', '1', 'LIVRE'),
('CADEIRA_90', 'D', '2', 'LIVRE'),
('CADEIRA_91', 'D', '3', 'LIVRE'),
('CADEIRA_92', 'D', '4', 'LIVRE'),
('CADEIRA_93', 'D', '5', 'LIVRE'),
('CADEIRA_94', 'D', '6', 'LIVRE'),
('CADEIRA_95', 'D', '7', 'LIVRE'),
('CADEIRA_96', 'D', '8', 'LIVRE'),
('CADEIRA_97', 'D', '9', 'LIVRE'),
('CADEIRA_98', 'D', '10', 'LIVRE'),
('CADEIRA_99', 'D', '11', 'LIVRE'),
('CADEIRA_100', 'D', '12', 'LIVRE'),
('CADEIRA_101', 'D', '13', 'LIVRE'),
('CADEIRA_88', 'D', '14', 'LIVRE'),
('CADEIRA_87', 'D', '15', 'LIVRE'),
('CADEIRA_86', 'D', '16', 'LIVRE'),
('CADEIRA_85', 'D', '17', 'LIVRE'),
('CADEIRA_84', 'D', '18', 'LIVRE'),
('CADEIRA_83', 'D', '19', 'LIVRE'),
('CADEIRA_82', 'D', '20', 'LIVRE'),
('CADEIRA_81', 'D', '21', 'LIVRE'),
('CADEIRA_80', 'D', '22', 'LIVRE'),
('CADEIRA_79', 'D', '23', 'LIVRE'),
('CADEIRA_78', 'D', '24', 'LIVRE'),
('CADEIRA_77', 'D', '25', 'LIVRE'),
('CADEIRA_290', 'C', '1', 'LIVRE'),
('CADEIRA_291', 'C', '2', 'LIVRE'),
('CADEIRA_292', 'C', '3', 'LIVRE'),
('CADEIRA_293', 'C', '4', 'LIVRE'),
('CADEIRA_294', 'C', '5', 'LIVRE'),
('CADEIRA_295', 'C', '6', 'LIVRE'),
('CADEIRA_297', 'C', '7', 'LIVRE'),
('CADEIRA_298', 'C', '8', 'LIVRE'),
('CADEIRA_299', 'C', '9', 'LIVRE'),
('CADEIRA_289', 'C', '10', 'LIVRE'),
('CADEIRA_286', 'C', '11', 'LIVRE'),
('CADEIRA_288', 'C', '12', 'LIVRE'),
('CADEIRA_287', 'C', '13', 'LIVRE'),
('CADEIRA_285', 'C', '14', 'LIVRE'),
('CADEIRA_284', 'C', '15', 'LIVRE'),
('CADEIRA_283', 'C', '16', 'LIVRE'),
('CADEIRA_282', 'C', '17', 'LIVRE'),
('CADEIRA_281', 'C', '18', 'LIVRE'),
('CADEIRA_280', 'C', '20', 'LIVRE'),
('CADEIRA_279', 'C', '21', 'LIVRE'),
('CADEIRA_278', 'C', '22', 'LIVRE'),
('CADEIRA_63', 'B', '1', 'LIVRE'),
('CADEIRA_64', 'B', '2', 'LIVRE'),
('CADEIRA_65', 'B', '3', 'LIVRE'),
('CADEIRA_66', 'B', '4', 'LIVRE'),
('CADEIRA_67', 'B', '5', 'LIVRE'),
('CADEIRA_68', 'B', '6', 'LIVRE'),
('CADEIRA_69', 'B', '7', 'LIVRE'),
('CADEIRA_70', 'B', '8', 'LIVRE'),
('CADEIRA_71', 'B', '9', 'LIVRE'),
('CADEIRA_72', 'B', '10', 'LIVRE'),
('CADEIRA_73', 'B', '11', 'LIVRE'),
('CADEIRA_74', 'B', '12', 'LIVRE'),
('CADEIRA_75', 'B', '13', 'LIVRE'),
('CADEIRA_76', 'B', '14', 'LIVRE'),
('CADEIRA_62', 'B', '15', 'LIVRE'),
('CADEIRA_61', 'B', '16', 'LIVRE'),
('CADEIRA_60', 'B', '17', 'LIVRE'),
('CADEIRA_59', 'B', '18', 'LIVRE'),
('CADEIRA_58', 'B', '19', 'LIVRE'),
('CADEIRA_57', 'B', '20', 'LIVRE'),
('CADEIRA_56', 'B', '21', 'LIVRE'),
('CADEIRA_55', 'B', '22', 'LIVRE'),
('CADEIRA_54', 'B', '23', 'LIVRE'),
('CADEIRA_53', 'B', '24', 'LIVRE'),
('CADEIRA_52', 'B', '25', 'LIVRE'),
('CADEIRA_51', 'B', '26', 'LIVRE'),
('CADEIRA_50', 'B', '27', 'LIVRE'),
('CADEIRA_49', 'B', '28', 'LIVRE'),
('CADEIRA_48', 'B', '29', 'LIVRE'),
('CADEIRA_264', 'A', '1', 'LIVRE'),
('CADEIRA_265', 'A', '2', 'LIVRE'),
('CADEIRA_266', 'A', '3', 'LIVRE'),
('CADEIRA_267', 'A', '4', 'LIVRE'),
('CADEIRA_268', 'A', '5', 'LIVRE'),
('CADEIRA_269', 'A', '6', 'LIVRE'),
('CADEIRA_270', 'A', '7', 'LIVRE'),
('CADEIRA_271', 'A', '8', 'LIVRE'),
('CADEIRA_272', 'A', '9', 'LIVRE'),
('CADEIRA_273', 'A', '10', 'LIVRE'),
('CADEIRA_274', 'A', '11', 'LIVRE'),
('CADEIRA_275', 'A', '12', 'LIVRE'),
('CADEIRA_276', 'A', '13', 'LIVRE'),
('CADEIRA_277', 'A', '14', 'LIVRE'),
('CADEIRA_263', 'A', '15', 'LIVRE'),
('CADEIRA_248', 'A', '16', 'LIVRE'),
('CADEIRA_261', 'A', '17', 'LIVRE'),
('CADEIRA_260', 'A', '18', 'LIVRE'),
('CADEIRA_259', 'A', '19', 'LIVRE'),
('CADEIRA_258', 'A', '20', 'LIVRE'),
('CADEIRA_257', 'A', '21', 'LIVRE'),
('CADEIRA_256', 'A', '22', 'LIVRE'),
('CADEIRA_255', 'A', '23', 'LIVRE'),
('CADEIRA_254', 'A', '24', 'LIVRE'),
('CADEIRA_253', 'A', '25', 'LIVRE'),
('CADEIRA_252', 'A', '26', 'LIVRE'),
('CADEIRA_251', 'A', '27', 'LIVRE'),
('CADEIRA_250', 'A', '28', 'LIVRE'),
('CADEIRA_249', 'A', '29', 'LIVRE'),
('CADEIRA_262', 'A', '30', 'LIVRE');

-- --------------------------------------------------------

--
-- Table structure for table `tb_conferencias`
--

CREATE TABLE IF NOT EXISTS `tb_conferencias` (
  `id_conferencia` int(255) NOT NULL,
  `nome` varchar(255) NOT NULL DEFAULT '',
  `orador` varchar(255) NOT NULL DEFAULT '',
  `estado` varchar(255) NOT NULL DEFAULT '',
  `video_url` varchar(255) NOT NULL DEFAULT '',
  `n_pessoas` int(255) NOT NULL,
  `dia` varchar(255) NOT NULL DEFAULT '',
  `hour` varchar(255) NOT NULL DEFAULT '',
  `peer_id` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tb_conferencias`
--

INSERT INTO `tb_conferencias` (`id_conferencia`, `nome`, `orador`, `estado`, `video_url`, `n_pessoas`, `dia`, `hour`, `peer_id`) VALUES
(27, 'testeurl', 'ricardo pinto', 'live', '', 0, '28/10/2016', '03:16', 'weff678wtf8wef'),
(28, 'testeurl', 'ricardo pinto', 'live', '', 0, '28/10/2016', '03:18', 'weff678wtf8wef');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_conferencias`
--
ALTER TABLE `tb_conferencias`
  ADD PRIMARY KEY (`id_conferencia`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_conferencias`
--
ALTER TABLE `tb_conferencias`
  MODIFY `id_conferencia` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=29;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
