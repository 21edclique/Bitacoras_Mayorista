-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-08-2023 a las 19:17:10
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gestionbitacora`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bitacora`
--

CREATE TABLE `bitacora` (
  `id_bitacora` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `id_usuario_per` int(11) NOT NULL,
  `hora` time NOT NULL,
  `id_nave_per` int(11) DEFAULT NULL,
  `camara` varchar(5) DEFAULT NULL,
  `novedad` varchar(244) NOT NULL,
  `resultado` varchar(244) DEFAULT NULL,
  `referencia` varchar(244) DEFAULT NULL,
  `turno` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `bitacora`
--

INSERT INTO `bitacora` (`id_bitacora`, `fecha`, `id_usuario_per`, `hora`, `id_nave_per`, `camara`, `novedad`, `resultado`, `referencia`, `turno`) VALUES
(48, '2023-08-10', 11, '09:09:15', 13, 'LL2', 'Sin novedad', 'Resuelto', '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `camara`
--

CREATE TABLE `camara` (
  `id_camara` int(11) NOT NULL,
  `nombre` varchar(5) NOT NULL,
  `id_nave_per` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `camara`
--

INSERT INTO `camara` (`id_camara`, `nombre`, `id_nave_per`) VALUES
(1, 'A1', 1),
(2, 'B1', 2),
(3, 'B2', 2),
(4, 'C1', 3),
(5, 'C2', 3),
(6, 'D1', 4),
(7, 'D2', 4),
(8, 'D3', 4),
(9, 'E1', 5),
(10, 'E2', 5),
(11, 'F1', 6),
(12, 'F3', 6),
(13, 'G1', 7),
(14, 'H1', 8),
(15, 'H2', 8),
(16, 'I1', 9),
(17, 'J1', 14),
(18, 'J2', 14),
(19, 'J3', 14),
(20, 'K1', 12),
(21, 'K2', 12),
(22, 'L1', 11),
(23, 'L3', 11),
(24, 'M1', 15),
(25, 'M2', 15),
(26, 'M3', 15),
(27, 'N1', 16),
(28, 'N2', 16),
(29, 'Ñ1', 17),
(30, 'Ñ2', 17),
(31, 'O1', 18),
(32, 'O2', 18),
(33, 'O3', 18),
(34, 'O4', 18),
(35, 'P2', 19),
(36, 'P3', 19),
(37, 'Q1', 20),
(38, 'Q3', 20),
(39, 'LL1', 13),
(40, 'LL2', 13),
(41, 'T1', 21),
(42, 'T2', 21),
(43, 'T4', 21),
(44, 'T5', 21),
(45, 'T6', 21),
(46, 'T7', 21),
(47, 'T8', 21),
(48, 'T9', 21),
(49, 'T11', 21),
(50, 'T3', 22);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nave`
--

CREATE TABLE `nave` (
  `id_nave` int(11) NOT NULL,
  `nombre` varchar(2) NOT NULL,
  `sector` int(11) NOT NULL,
  `productos` varchar(244) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `nave`
--

INSERT INTO `nave` (`id_nave`, `nombre`, `sector`, `productos`) VALUES
(1, 'A', 1, 'Fruta Importada'),
(2, 'B', 1, 'Tomate Riñon, Zanahoria'),
(3, 'C', 1, 'Fruta Importada, Naranjilla'),
(4, 'D', 2, 'Granos Tiernos, Choclo'),
(5, 'E', 2, 'Abarrotes'),
(6, 'F', 2, 'Papas'),
(7, 'G', 2, 'Ajo, Cebolla importada'),
(8, 'H', 2, 'Papas, Melloco'),
(9, 'I', 2, 'Papas'),
(10, 'Z', 2, 'Costales'),
(11, 'L', 3, 'Cebolla blanca, Fruta del valle'),
(12, 'K', 3, 'Tomate de árbol'),
(13, 'LL', 3, 'Envases, Mora, Fresa'),
(14, 'J', 3, 'Granos y Gramineas'),
(15, 'M', 3, 'Ajo, Cebolla'),
(16, 'N', 3, 'Cebolla colorada, Hiervas'),
(17, 'Ñ', 3, 'Huevos'),
(18, 'O', 4, 'Hortalizas'),
(19, 'P', 4, 'Fruta de la Costa'),
(20, 'Q', 4, 'Fruta de la Sierra'),
(21, 'T1', 1, ''),
(22, 'T3', 3, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`) VALUES
(1, 'Admin'),
(2, 'Operador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `cedula` varchar(10) NOT NULL,
  `usuario` varchar(15) NOT NULL,
  `contrasenia` varchar(10) NOT NULL,
  `nombres` varchar(244) NOT NULL,
  `direccion` varchar(244) NOT NULL,
  `telefono` varchar(10) NOT NULL,
  `estado` varchar(1) NOT NULL,
  `id_rol_per` int(11) NOT NULL,
  `ultimo_uso` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `cedula`, `usuario`, `contrasenia`, `nombres`, `direccion`, `telefono`, `estado`, `id_rol_per`, `ultimo_uso`) VALUES
(1, '1802992774', 'admin', 'Pato090776', 'Patricio Giovanny Jijón Haro', 'Ambato', '0979183343', 'A', 1, NULL),
(2, '0932131972', 'fer', 'luis1357', 'Luis Fernando Zerna Ramos', 'Ambato Huachi', '0984710706', 'A', 1, NULL),
(5, '1804790614', 'VelasquezR', '1804790614', 'Ricardo Sebastian Velasquez Lascano', 'Barrio Solis', '0958837875', 'A', 2, NULL),
(10, '1804505111', 'JorgeN', '1804505111', 'Jorge Edisson Nuñez Portero', 'Ambato', '0984220236', 'A', 2, NULL),
(11, '999999999', 'ope', 'ope', 'operador', 'operador', '1234567899', 'A', 2, '2023-08-10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `video`
--

CREATE TABLE `video` (
  `id_video` int(11) NOT NULL,
  `cedula_persona` int(11) NOT NULL,
  `nombres` varchar(244) NOT NULL,
  `id_nave` int(11) NOT NULL,
  `novedad` varchar(244) NOT NULL,
  `resultado` varchar(244) NOT NULL,
  `estado` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD PRIMARY KEY (`id_bitacora`),
  ADD KEY `id_nave_per` (`id_nave_per`),
  ADD KEY `id_video_per` (`camara`),
  ADD KEY `id_usario_uno_per` (`id_usuario_per`);

--
-- Indices de la tabla `camara`
--
ALTER TABLE `camara`
  ADD PRIMARY KEY (`id_camara`),
  ADD KEY `id_nave_per` (`id_nave_per`);

--
-- Indices de la tabla `nave`
--
ALTER TABLE `nave`
  ADD PRIMARY KEY (`id_nave`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `id_rol_per` (`id_rol_per`);

--
-- Indices de la tabla `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id_video`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bitacora`
--
ALTER TABLE `bitacora`
  MODIFY `id_bitacora` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `camara`
--
ALTER TABLE `camara`
  MODIFY `id_camara` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT de la tabla `nave`
--
ALTER TABLE `nave`
  MODIFY `id_nave` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `video`
--
ALTER TABLE `video`
  MODIFY `id_video` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bitacora`
--
ALTER TABLE `bitacora`
  ADD CONSTRAINT `bitacora_ibfk_1` FOREIGN KEY (`id_nave_per`) REFERENCES `nave` (`id_nave`),
  ADD CONSTRAINT `bitacora_ibfk_3` FOREIGN KEY (`id_usuario_per`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `camara`
--
ALTER TABLE `camara`
  ADD CONSTRAINT `camara_ibfk_1` FOREIGN KEY (`id_nave_per`) REFERENCES `nave` (`id_nave`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_rol_per`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
