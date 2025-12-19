import { logger } from "../util/logger";
import { kafka } from "./kafka";
// import { UserController } from "../api/controllers/userController";

const consumer = kafka.consumer({
  groupId: "auth-group",
});

export async function consuming() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "USER_PROFILE_CREATED",
    fromBeginning: false,
  });

  logger.info('User Service Kafka Consumer connected');
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;
        const data = JSON.parse(message.value.toString());
        logger.info(`USER_PROFILE_CREATED successfully ${message.value}`)
        // 👉 yahin pe future me DB / service call aayega
      } catch (err) {
        logger.error(`there is error with kafka consuming ${err}`);
      }
    },
  });
}
