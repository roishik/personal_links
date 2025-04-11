import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since this is a static site with no API endpoints needed,
  // we don't need to add any routes here
  
  const httpServer = createServer(app);
  return httpServer;
}
