import type { Request, Response } from "express";
import { asyncHandler } from "../Middleware/asyncHandler.js";
import Property from "../Model/PropertyModel.js";

export const bulkCreateProperties = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const properties = req.body;

    console.log(properties)

    if (!Array.isArray(properties) || properties.length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array.",
      });
      return;
    }

    const createdProperties = await Property.insertMany(properties);

    res.status(201).json({
      success: true,
      message: `${createdProperties.length} properties created successfully.`,
      total: createdProperties.length,
      data: createdProperties,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAllProperty = asyncHandler(async (req: Request, res: Response) => {
  // 📄 Pagination
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 8;
  const skip = (page - 1) * limit;

  const { title, minPrice, maxPrice, city, address } = req.query;

  // 🔹 Normalize inputs (safe)
  const titleQuery = typeof title === "string" ? title.trim() : "";
  const cityQuery = typeof city === "string" ? city.trim() : "";
  const addressQuery = typeof address === "string" ? address.trim() : "";

  const pipeline: any[] = [];

  // 🧠 1️⃣ Build Fuzzy Search Queries (NO EMPTY VALUES)
  const shouldQueries: any[] = [];

  if (titleQuery.length > 0) {
    shouldQueries.push({
      text: {
        query: titleQuery,
        path: "title",
        fuzzy: { maxEdits: 2 },
      },
    });
  }

  if (cityQuery.length > 0) {
    shouldQueries.push({
      text: {
        query: cityQuery,
        path: "location.city",
        fuzzy: { maxEdits: 2 },
      },
    });
  }

  if (addressQuery.length > 0) {
    shouldQueries.push({
      text: {
        query: addressQuery,
        path: "location.address",
        fuzzy: { maxEdits: 2 },
      },
    });
  }

  // ✅ Only add $search if valid queries exist
  if (shouldQueries.length > 0) {
    pipeline.push({
      $search: {
        index: "property_search",
        compound: {
          should: shouldQueries,
          minimumShouldMatch: 1, // 🔥 at least one must match
        },
      },
    });
  }

  // 🧱 2️⃣ Normal Filters
  const match: any = { isAvailable: true };

  if (minPrice || maxPrice) {
    match.price = {};
    if (minPrice) match.price.$gte = parseFloat(minPrice as string);
    if (maxPrice) match.price.$lte = parseFloat(maxPrice as string);
  }

  pipeline.push({ $match: match });

  // 📊 3️⃣ Project (select fields)
  pipeline.push({
    $project: {
      title: 1,
      description: 1,
      price: 1,
      location: 1,
      type: 1,
      bedrooms: 1,
      bathrooms: 1,
      areaSqFt: 1,
      images: 1,
      isAvailable: 1,
      score: { $meta: "searchScore" }, // optional ranking
    },
  });

  // 🔥 4️⃣ Sorting
  pipeline.push({
    $sort: {
      score: -1,       // best match first
      createdAt: -1,   // newest next
    },
  });

  // 📄 5️⃣ Pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // 🚀 Execute aggregation
  const properties = await Property.aggregate(pipeline);

  // 📊 Count (only filters, not fuzzy exact count)
  const totalCount = await Property.countDocuments({ isAvailable: true });
  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    page,
    totalPages,
    totalCount,
    limit,
    data: properties,
  });
});