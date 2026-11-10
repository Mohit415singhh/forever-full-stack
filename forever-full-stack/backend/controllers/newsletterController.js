import validator from "validator";
import subscriberModel from "../models/subscriberModel.js";
import { senderRequest } from "../services/senderService.js";

const subscribe = async (req, res) => {
    try {
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email address" });
        }

        const groupId = process.env.SENDER_NEWSLETTER_GROUP_ID;
        if (!process.env.SENDER_API_TOKEN || !groupId) {
            console.error("Sender newsletter configuration is missing");
            return res.status(503).json({ success: false, message: "Subscriptions are temporarily unavailable" });
        }

        const existingSubscriber = await subscriberModel.findOne({ email });

        let senderSubscriberExists = true;
        try {
            await senderRequest(`subscribers/${encodeURIComponent(email)}`);
        } catch (error) {
            if (error.status === 404) {
                senderSubscriberExists = false;
            } else {
                throw error;
            }
        }

        if (senderSubscriberExists) {
            await senderRequest(`subscribers/groups/${encodeURIComponent(groupId)}`, {
                method: "POST",
                body: { subscribers: [email], trigger_automation: true }
            });
        } else {
            await senderRequest("subscribers", {
                method: "POST",
                body: {
                    email,
                    groups: [groupId],
                    trigger_automation: true
                }
            });
        }

        if (!existingSubscriber) {
            await subscriberModel.create({ email });
        }

        if (existingSubscriber) {
            return res.json({ success: true, alreadySubscribed: true, message: "This email is already subscribed" });
        }

        res.status(201).json({ success: true, message: "Thanks for subscribing!" });
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ success: true, alreadySubscribed: true, message: "This email is already subscribed" });
        }
        console.error("Sender newsletter sync failed", {
            status: error.status,
            request: error.message,
            providerMessage: error.providerMessage
        });
        const status = error.name === "TimeoutError" || error.name === "AbortError"
            ? 504
            : error.status ? 502 : 500;
        res.status(status).json({ success: false, message: "Unable to subscribe right now. Please try again later." });
    }
}

const listSubscribers = async (req, res) => {
    try {
        const subscribers = await subscriberModel.find({}, "email subscribedAt").sort({ subscribedAt: -1 });
        res.json({ success: true, subscribers });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Unable to load subscribers" });
    }
}

export { subscribe, listSubscribers };
