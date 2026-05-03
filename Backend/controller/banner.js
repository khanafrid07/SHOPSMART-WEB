const expressError = require("../middlewares/expressError.js");
const Banner = require("../models/banner.js")

const createBanner = async (req, res) => {

    const { title, heading, subHeading, ctaText, ctaLink, type, placement, category, template, isActive, schedule } = req.body;
    const img = req.file;


    if (!img) {
        throw new expressError(400, "Image is required");
    }

    if (!type || !template) {
        throw new expressError(400, "Type and template are required");
    }
    const lastBanner = await Banner.findOne({ type })
        .sort({ priority: -1 });

    const newPriority = lastBanner ? lastBanner.priority + 1 : 1;

    const banner = new Banner({
        title,
        heading,
        subHeading,
        ctaText,
        ctaLink,
        type,
        placement,
        category,
        template,
        priority: newPriority,
        isActive: isActive !== undefined ? isActive : true,
        schedule,

        image: `${req.protocol}://${req.get("host")}/uploads/${img.filename}`
    });

    await banner.save();

    res.status(201).json({
        message: "Banner created successfully",
        banner
    });
};

const getAllBanners = async (req, res) => {
    const { type, category, status } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (status == "active") {
        filter.isActive = true
    } if (status == "inactive") {
        filter.isActive = false
    }

    let banners = await Banner.find(filter).sort({ priority: -1, createdAt: -1 });

    // Add default template to old banners that don't have one
    banners = banners.map(banner => {
        const bannerObj = banner.toObject();
        if (!bannerObj.template) {
            bannerObj.template = "left-dark";
        }
        return bannerObj;
    });

    res.status(200).json(banners);
}

const getBannerById = async (req, res) => {
    const { id } = req.params;

    let banner = await Banner.findById(id);

    if (!banner) {
        throw new expressError(404, "Banner not found");
    }

    // Add default template to old banners that don't have one
    const bannerObj = banner.toObject();
    if (!bannerObj.template) {
        bannerObj.template = "left-dark";
    }

    res.status(200).json(bannerObj);
}

const updateBanner = async (req, res) => {
    const { id } = req.params;

    const banner = await Banner.findById(id);
    if (!banner) {
        throw new expressError(404, "Banner not found");
    }


    const { title, heading, subHeading, ctaText, ctaLink, type, placement, category, template, priority, isActive, schedule } = req.body;

    // If new image is uploaded
    if (req.file) {
        Object.assign(banner, {
            title,
            heading,
            subHeading,
            ctaText,
            ctaLink,
            type,
            placement,
            category,
            template,
            priority: priority || 0,
            isActive: isActive !== undefined ? isActive : true,
            schedule: schedule
                ? {
                    startDate: schedule.startDate || null,
                    endDate: schedule.endDate || null,
                }
                : undefined,
            image: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        });
    } else {
        // Update without image
        Object.assign(banner, {
            title,
            heading,
            subHeading,
            ctaText,
            ctaLink,
            type,
            placement,
            category,
            template,
            priority: priority || 0,
            isActive: isActive !== undefined ? isActive : true,
            schedule: schedule
                ? {
                    startDate: schedule.startDate || null,
                    endDate: schedule.endDate || null,
                }
                : undefined,

        });
    }

    await banner.save();

    res.status(200).json({
        message: "Banner updated successfully",
        banner
    });
}

const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const banner = await Banner.findByIdAndUpdate(
        id,
        { isActive },
        { new: true, runValidators: true }
    );

    if (!banner) {
        throw new expressError(404, "Banner not found");
    }

    res.status(200).json({
        message: "Banner status updated successfully",
        banner
    });
}

const deleteBanner = async (req, res) => {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
        throw new expressError(404, "Banner not found");
    }

    res.status(200).json({
        message: "Banner deleted successfully"
    });
}

module.exports = { createBanner, getAllBanners, getBannerById, updateBanner, updateStatus, deleteBanner };