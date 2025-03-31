/*
 file: index.ts
 description: This file contains the routes for the API
 author: damour nsanzimfura
*/

import express from "express";

import authRoutes from "../features/auth";
import shortenURLRoutes from "../features/urlShorten";

const routes = express.Router();

routes.use("/auth", authRoutes);
routes.use("/", shortenURLRoutes);

export default routes;
