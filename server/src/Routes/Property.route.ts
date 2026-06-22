
import express from "express";
import { bulkCreateProperties, getAllProperty } from "../Controller/Property.controller.js";

export const propertyRouter=express.Router();

propertyRouter.post("/bulk-insert",bulkCreateProperties);
propertyRouter.get("/",getAllProperty)