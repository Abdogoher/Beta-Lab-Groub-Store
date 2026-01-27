import { dbRun, dbAll, dbGet } from "../config/postgres.js";

export const getAllOffers = async (req, res) => {
  try {
    const offers = await dbAll("SELECT * FROM offers");
    res.json(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).json({ error: "Failed to fetch offers" });
  }
};

export const createOffer = async (req, res) => {
  try {
    const { name, original_price, discounted_price, start_date, end_date } =
      req.body;

    let image_url = req.body.image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    // Basic validation
    if (
      !name ||
      !image_url ||
      !original_price ||
      !discounted_price ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        success: false,
        message: "الرجاء إدخال الحقول المطلوبة",
      });
    }

    // Normalize values for PostgreSQL
    const numOriginalPrice = Number(original_price);
    const numDiscountedPrice = Number(discounted_price);
    const startDate = new Date(start_date).toISOString();
    const endDate = new Date(end_date).toISOString();

    // Insert into database - Fixed for PostgreSQL ($1, $2...)
    const insertQuery = `
            INSERT INTO offers (name, image_url, original_price, discounted_price, start_date, end_date)
            VALUES (?, ?, ?, ?, ?, ?) RETURNING id
        `;
    const insertParams = [
      name,
      image_url,
      numOriginalPrice,
      numDiscountedPrice,
      startDate,
      endDate,
    ];
    const result = await dbRun(insertQuery, insertParams);

    res.json({
      success: true,
      message: "تم إضافة العرض بنجاح",
      id: result.lastID,
    });
  } catch (error) {
    console.error("Error creating offer:", error);
    res.status(500).json({ error: "Failed to create offer" });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun("DELETE FROM offers WHERE id = ?", [id]);
    res.json({ success: true, message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Error deleting offer:", error);
    res.status(500).json({ error: "Failed to delete offer" });
  }
};
