import { kafka } from "./kafka";
import { logger } from "../util/logger";

const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
  logger.info('kafka connected');
  
}


export async function publishUserAuthCreated(data: any) {
  try {
    await producer.send({
      topic: "USER_AUTH_CREATED",
      messages: [
        {
          key: String(data.id),
          value: JSON.stringify(data),
        },
      ],
    });
  } catch (err) {
    logger.error("Kafka produce failed", err);
    // optional: save event for retry
  }
}


