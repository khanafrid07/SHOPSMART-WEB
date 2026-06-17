const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => {
    console.log("Redis connected successfully");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err.message);
});


const invalidateProductCache = async (productId = null) => {
    try {
        // Find all list keys (e.g. products:list:*) and delete them
        const listKeys = await redis.keys("products:list:*");
        if (listKeys.length > 0) {
            await redis.del(listKeys);
        }

        // If a specific product ID is supplied, invalidate its detail cache
        if (productId) {
            await redis.del(`products:item:${productId}`);
        }

        console.log(`Cache cleared for listings${productId ? ` and product ${productId}` : ""}`);
    } catch (err) {
        console.error("Failed to clear Redis cache:", err.message);
    }
};

module.exports = {
    redis,
    invalidateProductCache
};
