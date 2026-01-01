import { logger } from "../util/logger";
import { kafka } from "./kafka";
import userController from "../api/controller/userController";

const consumer = kafka.consumer({
  groupId: "auth-group",
});

// export async function consuming() {
//   await consumer.connect();

//   await consumer.subscribe({
//     topic: "USER_PROFILE_CREATED",
//     fromBeginning: false,
//   });

//   logger.info('User Service Kafka Consumer connected');
//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       try {
//         if (!message.value) return;
//         const data = JSON.parse(message.value.toString());
//         logger.info(`USER_PROFILE_CREATED successfully ${message.value}`)
//       } catch (err) {
//         logger.error(`there is error with kafka consuming ${err}`);
//       }
//     },
//   });
// }

export async function deleteConsuming() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "USER_DELETED",
    fromBeginning: false,
  });

  logger.info('deleteUser Service Kafka Consumer connected');
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;
        const data = JSON.parse(message.value.toString());
        userController.deleteUser(data);
        logger.info(`USER_PROFILE_CREATED successfully ${message.value}`);
        
      } catch (err) {
        logger.error(`there is error with kafka consuming ${err}`);
      }
    },
  });
}
