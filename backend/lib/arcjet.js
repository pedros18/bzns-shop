import arcjet,{ tokenBucket,shield,detectBot} from "@arcjet/node";
import "dotenv/config";

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules: [
        shield({mode:"LIVE",}),
        detectBot({mode:"LIVE",allow:["CATEGORY:SEARCH_ENGINE"]}),
    ],
    tokenBucket: tokenBucket({
        mode: "LIVE",
        capacity: 1000,
        refillRate: 1000,
        interval: 1000,
        
})
});