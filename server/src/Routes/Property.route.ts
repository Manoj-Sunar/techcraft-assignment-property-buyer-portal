
import express from "express";
import { getAllProperty } from "../Controller/Property.controller.js";

export const propertyRouter=express.Router();

propertyRouter.get("/",getAllProperty)