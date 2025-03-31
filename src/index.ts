// Dependencies
import express, { Request, Response, NextFunction } from "express";

// Server configs
import { APP_PORT } from "./config/basic";

// Middlewares
import { handleError } from "./shared/middleware";

// Errors
import { NotFoundError } from "./utils/errors";

// Routes
import routes from "./routes";

// App configuration
import { configureApp } from "./app.configuration";

// Associations
import "./database/models/associations";

import { getShortCodeUrlLongUrlController } from "./features/urlShorten/controllers";

// App
const port = APP_PORT;

// Express app
const app = configureApp(express());


// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the URL shortener API",
  });
});

app.use("/", routes);

// app.use("/:short_code", getShortCodeUrlLongUrlController);


// catch all 404 errors
app.all("*", (req, res, next) => {
  const err = new NotFoundError("Page Requested not found");
  next(err);
});

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  handleError(err, req, res, next);
});

// TODO: Add a health check endpoint & move to server/index.ts
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
