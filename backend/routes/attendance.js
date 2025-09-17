const router = require("express").Router();

// Mark attendance
router.post("/mark", async (req, res) => {
  try {
    const { userId } = req.body;

    const attendance = await req.prisma.attendance.create({
      data: {
        userId: parseInt(userId),
        status: "PRESENT",
      },
      include: {
        user: true,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get attendance by date range
router.get("/", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let where = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const attendance = await req.prisma.attendance.findMany({
      where,
      include: {
        user: true,
      },
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
